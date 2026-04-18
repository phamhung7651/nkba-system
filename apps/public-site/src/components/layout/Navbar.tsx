'use client'

import Link from 'next/link';

export default function Navbar({ openRegisterModal }: { openRegisterModal: (tier: string) => void }) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm transition-all duration-300" id="navbar">
      
      {/* TODO: BẠN HÃY DÁN ĐOẠN CODE HIỂN THỊ LOGO VÀ MENU CŨ CỦA BẠN VÀO ĐÂY */}
      {/* ... Toàn bộ ruột HTML của Navbar từ code cũ ... */}

      {/* KHU VỰC 2 NÚT BẤM BÊN PHẢI (Copy và đặt vào đúng vị trí nút bấm cũ của bạn) */}
      <div className="flex items-center gap-3">
        <Link 
          href="/upgrade" 
          className="hidden md:flex px-5 py-2.5 text-sm font-bold text-[#002D62] hover:text-amber-600 transition-colors"
        >
          Nâng cấp Đặc quyền
        </Link>
        
        <button 
          onClick={() => openRegisterModal('Registered (Miễn phí)')} 
          className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-[#002D62] transition-colors shadow-lg shadow-slate-900/20 ring-1 ring-slate-900/50"
        >
          Tham gia Miễn phí
        </button>
      </div>

    </nav>
  );
}