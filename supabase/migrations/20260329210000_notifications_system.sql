-- Tạo bảng lưu trữ Thông báo cho Member
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE, -- Gửi cho ai?
    
    title TEXT NOT NULL, -- Tiêu đề thông báo
    content TEXT, -- Nội dung chi tiết (VD: Lời nhắn của Admin)
    link_url TEXT, -- Click vào thì bay đi đâu? (VD: '/profile')
    
    is_read BOOLEAN DEFAULT false, -- Đã đọc chưa?
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bật bảo mật RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access notifications" ON public.notifications FOR ALL TO authenticated USING (true);