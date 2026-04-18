-- ==========================================
-- NKBA SYSTEM - STRATEGY VAULT SCHEMA & RLS
-- ==========================================

-- Tạo ENUM cho trạng thái của Sáng kiến
CREATE TYPE public.initiative_status AS ENUM ('PLANNING', 'ON_TRACK', 'AT_RISK', 'COMPLETED', 'CANCELLED');

-- --------------------------------------------------------
-- 1. BẢNG STRATEGIC_PLANS (Kế hoạch Chiến lược theo Năm)
-- --------------------------------------------------------
CREATE TABLE public.strategic_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    year INTEGER UNIQUE NOT NULL, -- Năm tài chính (VD: 2026)
    target_gmv NUMERIC DEFAULT 0, -- Mục tiêu GMV (Tỷ VNĐ)
    target_members INTEGER DEFAULT 0, -- Mục tiêu số lượng Hội viên
    target_experts INTEGER DEFAULT 0, -- Mục tiêu số lượng Chuyên gia
    created_by UUID REFERENCES public.users(id), -- Ai là người tạo
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------
-- 2. BẢNG DEPARTMENT_BUDGETS (Ngân sách Phòng ban)
-- --------------------------------------------------------
CREATE TABLE public.department_budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID REFERENCES public.strategic_plans(id) ON DELETE CASCADE, -- Gắn với năm nào
    department_name TEXT NOT NULL,
    allocated_percentage NUMERIC DEFAULT 0, -- % Ngân sách được cấp
    spent_percentage NUMERIC DEFAULT 0, -- % Ngân sách đã tiêu
    color_code TEXT, -- Mã màu để vẽ UI (VD: bg-blue-600)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------
-- 3. BẢNG INITIATIVES (Sáng kiến / Hành động Trọng tâm)
-- --------------------------------------------------------
CREATE TABLE public.initiatives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID REFERENCES public.strategic_plans(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status public.initiative_status DEFAULT 'PLANNING',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100), -- Tiến độ 0-100%
    owner_id UUID REFERENCES public.users(id), -- Người chịu trách nhiệm chính
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ==========================================
-- THIẾT LẬP BẢO MẬT (ROW LEVEL SECURITY - RLS)
-- ==========================================
-- Bật khiên bảo vệ cho cả 3 bảng
ALTER TABLE public.strategic_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.initiatives ENABLE ROW LEVEL SECURITY;

-- Chỉ có Admin (Lãnh đạo) mới được phép Xem, Thêm, Sửa, Xóa các kế hoạch này.
-- Các công ty thành viên (MEMBER / COMPANY_ADMIN) tuyệt đối không được truy cập.

CREATE POLICY "Admin full access strategic_plans" ON public.strategic_plans
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('SUPER_ADMIN', 'ADMIN_BIZLINK', 'ADMIN_TALENT', 'ADMIN_INSIGHTS')));

CREATE POLICY "Admin full access department_budgets" ON public.department_budgets
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('SUPER_ADMIN', 'ADMIN_BIZLINK', 'ADMIN_TALENT', 'ADMIN_INSIGHTS')));

CREATE POLICY "Admin full access initiatives" ON public.initiatives
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('SUPER_ADMIN', 'ADMIN_BIZLINK', 'ADMIN_TALENT', 'ADMIN_INSIGHTS')));