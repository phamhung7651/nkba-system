-- Thêm các trạng thái mới vào danh sách ENUM project_status hiện có
ALTER TYPE public.project_status ADD VALUE IF NOT EXISTS 'PENDING';
ALTER TYPE public.project_status ADD VALUE IF NOT EXISTS 'OPEN';
ALTER TYPE public.project_status ADD VALUE IF NOT EXISTS 'CLOSED';
ALTER TYPE public.project_status ADD VALUE IF NOT EXISTS 'REJECTED';