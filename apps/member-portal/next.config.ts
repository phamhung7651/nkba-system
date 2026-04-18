import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // QUAN TRỌNG: Tạo ra thư mục standalone để deploy server
  output: 'standalone',
  
  // Bổ sung transpile để tránh lỗi khi dùng chung thư viện supabase
  transpilePackages: ["supabase"],
};

export default nextConfig;