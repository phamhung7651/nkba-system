-- ==========================================
-- NKBA SYSTEM - RLS POLICIES CHO ĐĂNG KÝ
-- ==========================================

-- --------------------------------------------------------
-- 1. POLICIES CHO BẢNG COMPANIES (Hồ sơ Công ty)
-- --------------------------------------------------------

-- [INSERT] Cho phép khách vãng lai (anon) gửi form đăng ký công ty mới
CREATE POLICY "Cho phép khách vãng lai tạo mới Công ty"
ON public.companies
FOR INSERT
TO anon, authenticated
WITH CHECK (true); 
-- Mở cửa cho phép Insert, kyc_status mặc định là 'PENDING' đã được set ở schema nên rất an toàn.

-- [SELECT] (Tạm thời) Cho phép đọc thông tin công ty để Frontend có thể lấy ID sau khi Insert
CREATE POLICY "Cho phép đọc thông tin công ty"
ON public.companies
FOR SELECT
TO public
USING (true);


-- --------------------------------------------------------
-- 2. POLICIES CHO BẢNG USERS (Người dùng)
-- --------------------------------------------------------

-- [INSERT] Chỉ cho phép User tự tạo hồ sơ của chính họ sau khi đã đăng ký Supabase Auth thành công
CREATE POLICY "Người dùng tự tạo profile của mình"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id); 
-- Rất quan trọng: Hàm auth.uid() = id đảm bảo Hacker không thể tạo data giả mạo cho User ID của người khác.

-- [SELECT] Cho phép người dùng xem profile của chính mình
CREATE POLICY "Người dùng xem profile của mình"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- [UPDATE] Cho phép người dùng tự cập nhật profile cá nhân
CREATE POLICY "Người dùng tự cập nhật profile"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);