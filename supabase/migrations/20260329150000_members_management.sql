-- Tạo các ENUM phân loại Hội viên
CREATE TYPE public.member_tier AS ENUM ('STANDARD', 'PREMIUM', 'VIP');
CREATE TYPE public.member_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');

-- Tạo bảng Members (Danh sách Doanh nghiệp Hội viên)
CREATE TABLE IF NOT EXISTS public.members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL, -- Tên doanh nghiệp
    tax_code TEXT UNIQUE, -- Mã số thuế
    representative TEXT NOT NULL, -- Người đại diện
    phone TEXT,
    email TEXT,
    
    tier public.member_tier DEFAULT 'STANDARD',
    status public.member_status DEFAULT 'PENDING',
    
    address TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bật bảo mật RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access members" ON public.members FOR ALL TO authenticated USING (true);