-- Chạy lệnh này riêng biệt để Postgres cập nhật bộ nhớ ENUM
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'ADMIN_BIZLINK';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'ADMIN_TALENT';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'ADMIN_INSIGHTS';