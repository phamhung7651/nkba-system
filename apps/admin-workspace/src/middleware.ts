import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 1. Tạo response mặc định
  let response = NextResponse.next({ request });

  // 2. Cài đặt "Máy đọc thẻ từ" của Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. Quét thẻ xem có User nào đang đứng trước cửa không
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // ==========================================
  // 🕵️‍♂️ CAMERA GIÁM SÁT (HIỂN THỊ TRONG TERMINAL VS CODE)
  // ==========================================
  console.log("\n=== 🕵️‍♂️ MIDDLEWARE BÁO CÁO ===");
  console.log("📍 Đang truy cập URL:", request.url);
  console.log("📍 Pathname:", path);
  console.log("👤 Thẻ Auth (User):", user ? `Có (ID: ${user.id})` : "KHÔNG CÓ (NULL)");
  console.log("================================\n");

  // 4. LOGIC 1: CÓ THẺ TỪ mà lại lảng vảng ở trang /login -> Mời vào Dashboard làm việc
  if (user && path === '/login') {
    console.log("👉 User đã login, mời từ /login về / (Dashboard)");
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 5. LOGIC 2: KHÔNG CÓ THẺ TỪ mà lại đòi vào Dashboard -> Đuổi ra trang /login
  if (!user && path !== '/login') {
    console.log("🚨 Khách KHÔNG CÓ thẻ, ĐUỔI RA /login");
    // [QUAN TRỌNG]: Thêm đuôi ?error=middleware_kicked_you để in dấu vết lên thanh URL trình duyệt
    return NextResponse.redirect(new URL('/login?error=middleware_kicked_you', request.url));
  }

  // 6. Hợp lệ -> Cho qua
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};