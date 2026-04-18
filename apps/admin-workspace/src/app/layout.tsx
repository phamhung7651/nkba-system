import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

// 1. Khởi tạo font Roboto, BẮT BUỘC có subset "vietnamese" để không lỗi dấu
const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto",
  display: "swap",
});

// 2. Cập nhật lại tiêu đề trang web cho chuyên nghiệp
export const metadata: Metadata = {
  title: "NKBA Admin Workspace",
  description: "Hệ thống quản trị nội bộ và hệ sinh thái NKBA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi" // Đổi sang tiếng Việt để trình duyệt nhận diện đúng
      className={`${roboto.variable} h-full antialiased`}
    >
      <head>
        {/* Nhúng bộ icon Phosphor dùng xuyên suốt dự án */}
        <script src="https://unpkg.com/@phosphor-icons/web" async></script>
      </head>
      {/* Gắn roboto.className vào body để áp dụng font cho toàn bộ text */}
      <body className={`${roboto.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}