-- ==========================================
-- NKBA CORE SYSTEM - DATABASE MIGRATION V1
-- ==========================================

-- 1. KÍCH HOẠT EXTENSIONS CẦN THIẾT
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TẠO CÁC KIỂU DỮ LIỆU ENUM
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'COMPANY_ADMIN', 'MEMBER', 'CLIENT', 'TALENT');
CREATE TYPE kyc_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE company_tier AS ENUM ('STANDARD', 'SILVER', 'GOLD');
CREATE TYPE project_status AS ENUM ('PLANNING', 'TENDERING', 'IN_PROGRESS', 'COMPLETED');
CREATE TYPE bidding_status AS ENUM ('OPEN', 'EVALUATING', 'AWARDED', 'CANCELLED');
CREATE TYPE bid_submission_status AS ENUM ('SUBMITTED', 'SHORTLISTED', 'WON', 'LOST');

-- 3. HÀM TỰ ĐỘNG CẬP NHẬT TRƯỜNG updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==========================================
-- TẠO CÁC BẢNG CỐT LÕI (CORE TABLES)
-- ==========================================

-- BẢNG 1: COMPANIES (Hồ sơ Công ty / Đối tác)
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(2) NOT NULL, -- 'VN' hoặc 'JP'
    tax_code VARCHAR(50) UNIQUE NOT NULL,
    kyc_status kyc_status DEFAULT 'PENDING',
    tier company_tier DEFAULT 'STANDARD',
    capabilities JSONB,
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE -- Phục vụ xóa mềm
);

-- BẢNG 2: USERS (Người dùng - Liên kết với Supabase Auth)
-- Lưu ý: Không lưu mật khẩu ở đây vì Supabase Auth (auth.users) đã lo việc bảo mật.
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'MEMBER',
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- BẢNG 3: PROJECTS (Dự án xây dựng)
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_company_id UUID REFERENCES public.companies(id),
    title VARCHAR(255) NOT NULL,
    status project_status DEFAULT 'PLANNING',
    budget DECIMAL(15,2),
    currency VARCHAR(3) NOT NULL DEFAULT 'VND', -- 'VND' hoặc 'JPY'
    location VARCHAR(255),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- BẢNG 4: BIDDINGS (Gói thầu / Yêu cầu báo giá)
CREATE TABLE public.biddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    requirements TEXT NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    status bidding_status DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- BẢNG 5: BID_SUBMISSIONS (Hồ sơ dự thầu)
CREATE TABLE public.bid_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bidding_id UUID REFERENCES public.biddings(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    bid_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status bid_submission_status DEFAULT 'SUBMITTED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- BẢNG 6: DOCUMENTS (Quản lý file/bản vẽ trên AWS S3 / Supabase Storage)
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    uploader_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    is_watermarked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- BẢNG 7: TALENT_PROFILES (Hồ sơ Chuyên gia)
CREATE TABLE public.talent_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    skills JSONB,
    yoe INT NOT NULL DEFAULT 0,
    is_open_to_work BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ==========================================
-- ÁP DỤNG TRIGGER CHO CỘT updated_at
-- ==========================================
CREATE TRIGGER set_updated_at_companies BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_projects BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_biddings BEFORE UPDATE ON public.biddings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_bid_submissions BEFORE UPDATE ON public.bid_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_documents BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_talent_profiles BEFORE UPDATE ON public.talent_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- BẬT ROW LEVEL SECURITY (RLS)
-- Bước đầu để bảo mật: Kích hoạt RLS cho tất cả các bảng.
-- Các chính sách (Policies) chi tiết sẽ được viết ở các bản migration sau.
-- ==========================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bid_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_profiles ENABLE ROW LEVEL SECURITY;