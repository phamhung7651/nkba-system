-- Tạo bảng projects nếu chưa có
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bổ sung các cột quan trọng (Nếu đã có thì bỏ qua)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS member_id UUID REFERENCES public.members(id) ON DELETE CASCADE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS budget_max NUMERIC;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS location TEXT;

-- Đảm bảo RLS được bật và Admin có quyền
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin full access projects" ON public.projects;
CREATE POLICY "Admin full access projects" ON public.projects FOR ALL TO authenticated USING (true);