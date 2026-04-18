-- 1. TẠO CÁC ENUM PHÂN LOẠI (Kèm cơ chế an toàn: Bỏ qua nếu đã tồn tại)
DO $$ BEGIN
    CREATE TYPE public.project_category AS ENUM ('DESIGN', 'CONSTRUCTION', 'MATERIAL', 'CONSULTING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.project_status AS ENUM ('PENDING', 'OPEN', 'MATCHING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.bid_status AS ENUM ('PENDING', 'SHORTLISTED', 'REJECTED', 'WON');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. BẢNG PROJECTS (Gói thầu / Yêu cầu dự án)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Ai là người đăng dự án này? (Chủ đầu tư / Thầu chính)
    author_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT,
    
    category public.project_category NOT NULL,
    
    -- Ngân sách (Min - Max)
    budget_min NUMERIC,
    budget_max NUMERIC,
    
    location TEXT, -- Địa điểm thi công
    deadline DATE, -- Hạn chót nộp hồ sơ thầu
    
    status public.project_status DEFAULT 'PENDING',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BẢNG BIDS (Hồ sơ nộp thầu của các Hội viên khác)
CREATE TABLE IF NOT EXISTS public.bids (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    
    -- Ai là người nộp hồ sơ thầu này? (Nhà thầu phụ / Nhà cung cấp)
    bidder_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    
    bid_amount NUMERIC, -- Chào giá
    proposal_text TEXT, -- Lời chào hàng/Giới thiệu năng lực
    
    status public.bid_status DEFAULT 'PENDING',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BẬT BẢO MẬT RLS (ROW LEVEL SECURITY)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- Xóa Policy cũ nếu có để tránh lỗi duplicate, sau đó tạo lại
DROP POLICY IF EXISTS "Admin full access projects" ON public.projects;
CREATE POLICY "Admin full access projects" ON public.projects FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin full access bids" ON public.bids;
CREATE POLICY "Admin full access bids" ON public.bids FOR ALL TO authenticated USING (true);