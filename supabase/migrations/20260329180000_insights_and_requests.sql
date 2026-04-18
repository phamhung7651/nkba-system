-- 1. TẠO ENUM PHÂN QUYỀN & TRẠNG THÁI
DO $$ BEGIN CREATE TYPE public.report_tier AS ENUM ('PUBLIC', 'STANDARD', 'PREMIUM', 'VIP'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.request_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. BẢNG REPORTS (Kho Báo cáo & Phân tích thị trường)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'MARKET_RESEARCH', -- Phân loại: Nghiên cứu, Giá vật tư, Vĩ mô...
    
    file_url TEXT, -- Link file PDF/Excel (Hoặc ID file lưu trên Supabase Storage)
    cover_image_url TEXT, -- Ảnh bìa báo cáo cho đẹp
    
    access_tier public.report_tier DEFAULT 'STANDARD', -- Chốt chặn quyền lực: Ai được xem?
    downloads INTEGER DEFAULT 0, -- Bộ đếm lượt tải
    
    is_active BOOLEAN DEFAULT true, -- Ẩn/Hiện báo cáo
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BẢNG DATA_REQUESTS (Trạm tiếp nhận yêu cầu "đặt hàng" dữ liệu từ VIP)
CREATE TABLE IF NOT EXISTS public.data_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE, -- Doanh nghiệp nào yêu cầu?
    
    title TEXT NOT NULL,
    content TEXT NOT NULL, -- Nội dung cần thu thập (VD: Xin báo giá đá Marble tại Đà Nẵng)
    
    status public.request_status DEFAULT 'PENDING',
    
    result_file_url TEXT, -- File Admin trả kết quả cho hội viên
    admin_note TEXT, -- Lời nhắn nhủ của Admin khi trả kết quả
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BẬT BẢO MẬT RLS & POLICY
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access reports" ON public.reports;
CREATE POLICY "Admin full access reports" ON public.reports FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin full access data_requests" ON public.data_requests;
CREATE POLICY "Admin full access data_requests" ON public.data_requests FOR ALL TO authenticated USING (true);