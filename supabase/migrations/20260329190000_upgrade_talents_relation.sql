-- Liên kết bảng talents (Hồ sơ chuyên gia) với bảng members (Tài khoản người dùng)
-- Để người dùng có thể tự quản lý và cập nhật CV của chính mình

ALTER TABLE public.talents
ADD COLUMN IF NOT EXISTS member_id UUID REFERENCES public.members(id) ON DELETE CASCADE;

-- Thêm Data mốc (Mock Data) để Hồ cá chuyên gia không bị trống
-- Giả lập có 1 chuyên gia đã được Admin duyệt (VERIFIED)
INSERT INTO public.talents (full_name, title, email, phone, skills, experience_years, expected_salary, status, member_id)
SELECT 'Nguyễn Trần Kiến Quốc', 'Giám đốc Quản lý Dự án (PM)', 'quoc.nguyen@email.com', '0988xxx999', 'Quản lý thi công, Autocad, Đấu thầu, MEP', 12, '60,000,000 VNĐ', 'VERIFIED', m.id
FROM public.members m
WHERE m.email = 'quoc.nguyen@email.com'
AND NOT EXISTS (SELECT 1 FROM public.talents WHERE email = 'quoc.nguyen@email.com');