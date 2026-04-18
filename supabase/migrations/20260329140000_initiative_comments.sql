-- Tạo bảng lưu vết Thảo luận & Chỉ đạo cho từng Sáng kiến
CREATE TABLE IF NOT EXISTS public.initiative_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    initiative_id UUID REFERENCES public.initiatives(id) ON DELETE CASCADE,
    
    sender_name TEXT NOT NULL, -- Tên người gửi (VD: Sếp Khang, Trưởng phòng A)
    sender_role TEXT NOT NULL, -- Vai trò (VD: CEO, HEAD, STAFF)
    
    content TEXT NOT NULL,
    
    -- Phân loại luồng: 'PRIVATE' (Kênh Lãnh đạo) hoặc 'TEAM' (Kênh nội bộ phòng)
    channel TEXT NOT NULL DEFAULT 'TEAM', 
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bật bảo mật (RLS cơ bản)
ALTER TABLE public.initiative_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cho phép admin full quyền comment" ON public.initiative_comments FOR ALL TO authenticated USING (true);