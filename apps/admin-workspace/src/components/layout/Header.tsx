'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Header() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    // 1. Xóa phiên đăng nhập trên Supabase
    await supabase.auth.signOut();
    // 2. Chuyển hướng về trang đăng nhập
    router.push('/login');
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm w-full">
      {/* KHU VỰC BÊN TRÁI HEADER (Có thể để Title hoặc Breadcrumbs) */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-black text-slate-800 tracking-tight hidden md:block">
          Workspace Dashboard
        </h2>
      </div>

      {/* KHU VỰC BÊN PHẢI (User profile & Nút Đăng xuất) */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
            <i className="ph-fill ph-user text-slate-500 text-xl"></i>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-slate-700">Quản trị viên</p>
            <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Đang trực tuyến</p>
          </div>
        </div>

        <div className="w-px h-8 bg-slate-200"></div>

        {/* NÚT ĐĂNG XUẤT */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 text-sm font-bold rounded-xl hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all group"
        >
          Đăng xuất 
          <i className="ph-bold ph-sign-out text-lg group-hover:translate-x-1 transition-transform"></i>
        </button>
      </div>
    </header>
  );
}