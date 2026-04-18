-- Ép thêm các cột lõi nếu trước đó bị thiếu
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING';

-- LỆNH BÍ MẬT: Ép API của Supabase (PostgREST) phải xóa Cache và cập nhật ngay lập tức!
NOTIFY pgrst, 'reload schema';