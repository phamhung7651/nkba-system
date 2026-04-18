-- Thêm các cột phục vụ Giao việc & Theo dõi tiến độ cho bảng initiatives
-- Dùng IF NOT EXISTS để bỏ qua nếu cột đã tồn tại từ trước

ALTER TABLE public.initiatives
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;