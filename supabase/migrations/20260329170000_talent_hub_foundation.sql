-- 1. TẠO ENUM PHÂN LOẠI (Có cơ chế chống duplicate)
DO $$ BEGIN CREATE TYPE public.talent_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.job_status AS ENUM ('PENDING', 'OPEN', 'CLOSED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.app_status AS ENUM ('APPLIED', 'RECOMMENDED', 'INTERVIEWING', 'HIRED', 'REJECTED'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. BẢNG TALENTS (Hồ sơ Chuyên gia / Kỹ sư)
CREATE TABLE IF NOT EXISTS public.talents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    title TEXT NOT NULL, -- VD: "Giám đốc Dự án", "Kỹ sư MEP"
    email TEXT,
    phone TEXT,
    skills TEXT, -- Các kỹ năng (phân cách bằng dấu phẩy)
    experience_years INTEGER DEFAULT 0, -- Số năm kinh nghiệm
    expected_salary TEXT, -- Mức lương mong muốn
    bio TEXT, -- Giới thiệu bản thân
    
    status public.talent_status DEFAULT 'PENDING',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BẢNG JOBS (Tin tuyển dụng từ các Doanh nghiệp)
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE, -- Công ty nào đăng tuyển?
    
    title TEXT NOT NULL,
    description TEXT,
    requirements TEXT,
    salary_range TEXT,
    
    status public.job_status DEFAULT 'PENDING',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BẢNG TALENT APPLICATIONS (Trạm Khớp nối: Nơi lưu vết Ứng tuyển & Tiến cử)
CREATE TABLE IF NOT EXISTS public.talent_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    talent_id UUID REFERENCES public.talents(id) ON DELETE CASCADE,
    
    status public.app_status DEFAULT 'APPLIED',
    notes TEXT, -- Lời phê/Bảo lãnh của Admin khi tiến cử
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, talent_id) -- Một người chỉ được nộp/tiến cử vào 1 job 1 lần
);

-- 5. BẬT BẢO MẬT RLS & POLICY
ALTER TABLE public.talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access talents" ON public.talents;
CREATE POLICY "Admin full access talents" ON public.talents FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin full access jobs" ON public.jobs;
CREATE POLICY "Admin full access jobs" ON public.jobs FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin full access apps" ON public.talent_applications;
CREATE POLICY "Admin full access apps" ON public.talent_applications FOR ALL TO authenticated USING (true);