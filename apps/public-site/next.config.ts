import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ["supabase"],
  
  // Xóa mục experimental: { turbo: ... } cũ gây lỗi Type error
  // Nếu bạn muốn định nghĩa root cho Turbopack ở bản mới, dùng:
  bundlePagesRouterDependencies: true, 
};

export default nextConfig;