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

  // 4. LOGIC 1: CÓ THẺ TỪ mà lại lảng vảng ở trang /login -> Mời vào Dashboard làm việc
  if (user && path === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 5. LOGIC 2: KHÔNG CÓ THẺ TỪ mà lại đòi vào Dashboard -> Đuổi ra trang /login
  if (!user && path !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 6. Hợp lệ -> Cho qua
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};