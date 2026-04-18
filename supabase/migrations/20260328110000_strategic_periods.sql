-- ==========================================
-- NKBA SYSTEM - STRATEGIC PERIODS (TẦM NHÌN)
-- ==========================================

-- 1. TẠO BẢNG KỲ CHIẾN LƯỢC (Ví dụ: 2026 - 2030)
CREATE TABLE public.strategic_periods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL, -- Tên kỳ (VD: Chiến lược Bứt phá 2026-2030)
    start_year INTEGER NOT NULL,
    end_year INTEGER NOT NULL,
    
    vision TEXT, -- Tầm nhìn
    mission TEXT, -- Sứ mệnh
    
    long_term_goals TEXT, -- Chiến lược Dài hạn (3-5 năm)
    mid_term_goals TEXT, -- Chiến lược Trung hạn (1-3 năm)
    short_term_goals TEXT, -- Chiến lược Ngắn hạn (<1 năm)
    
    is_active BOOLEAN DEFAULT false, -- Đánh dấu đây là kỳ chiến lược đang áp dụng
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CẬP NHẬT BẢNG STRATEGIC_PLANS (Kế hoạch năm)
-- Thêm cột period_id để biết Kế hoạch năm này thuộc Kỳ chiến lược nào
ALTER TABLE public.strategic_plans 
ADD COLUMN period_id UUID REFERENCES public.strategic_periods(id) ON DELETE SET NULL;

-- 3. THIẾT LẬP BẢO MẬT (RLS)
ALTER TABLE public.strategic_periods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access strategic_periods" ON public.strategic_periods
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('SUPER_ADMIN', 'ADMIN_BIZLINK', 'ADMIN_TALENT', 'ADMIN_INSIGHTS')));