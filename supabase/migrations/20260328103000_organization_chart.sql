-- ==========================================
-- NKBA SYSTEM - ORGANIZATION & EMPLOYEES
-- ==========================================

-- Tạo ENUM cho loại Đơn vị
CREATE TYPE public.department_type AS ENUM ('HEADQUARTER', 'BRANCH', 'DEPARTMENT');

-- --------------------------------------------------------
-- 1. BẢNG DEPARTMENTS (Đơn vị / Phòng ban)
-- --------------------------------------------------------
CREATE TABLE public.departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type public.department_type DEFAULT 'DEPARTMENT',
    -- Cột parent_id tham chiếu ngược lại chính bảng departments để tạo Cây Tổ Chức
    parent_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------
-- 2. BẢNG EMPLOYEES (Nhân sự)
-- --------------------------------------------------------
CREATE TABLE public.employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL, -- Mã nhân viên (VD: NV001)
    name TEXT NOT NULL,
    role TEXT NOT NULL, -- Chức danh (VD: Giám đốc Biz-Link)
    
    -- Liên kết với Phòng ban
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    
    -- Liên kết Sếp trực tiếp (Tham chiếu ngược lại chính bảng employees)
    manager_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- THIẾT LẬP BẢO MẬT (ROW LEVEL SECURITY - RLS)
-- ==========================================
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Cấp quyền Full Access cho các Admin (Lãnh đạo)
CREATE POLICY "Admin full access departments" ON public.departments
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('SUPER_ADMIN', 'ADMIN_BIZLINK', 'ADMIN_TALENT', 'ADMIN_INSIGHTS')));

CREATE POLICY "Admin full access employees" ON public.employees
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('SUPER_ADMIN', 'ADMIN_BIZLINK', 'ADMIN_TALENT', 'ADMIN_INSIGHTS')));