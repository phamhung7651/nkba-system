import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // QUAN TRỌNG: Tạo ra thư mục standalone để deploy server
  output: 'standalone',

  transpilePackages: ["supabase"],
};

export default nextConfig;