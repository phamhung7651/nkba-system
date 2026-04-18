'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // DANH SÁCH MENU (GIỮ NGUYÊN CŨ + THÊM MỚI + CHIA NHÓM)
  const menuItems = [
    // --- NHÓM CHIẾN LƯỢC ---
    { isDivider: true, title: 'Tổng quan & Chiến lược' },
    { title: 'Dashboard', path: '/', icon: 'ph-squares-four' },
    { title: 'Tầm nhìn & Chiến lược', path: '/strategy/vision', icon: 'ph-compass' },
    { title: 'Kế hoạch năm (OKRs)', path: '/strategy/planning', icon: 'ph-target' },
    { title: 'Theo dõi Thực thi', path: '/strategy/execution', icon: 'ph-kanban' },

    // --- NHÓM NỘI BỘ ---
    { isDivider: true, title: 'Nội bộ NKBA' },
    { title: 'Quản lý Tổ chức', path: '/organization', icon: 'ph-git-branch' },
    { title: 'Quản trị Nhân sự', path: '/employees', icon: 'ph-identification-badge' },
    { title: 'Cấu hình Phân quyền', path: '/roles', icon: 'ph-shield-check' },

    // --- NHÓM HỘI VIÊN (THÊM 3 MENU MỚI Ở ĐÂY) ---
    { isDivider: true, title: 'Hệ sinh thái Hội viên' },
    { title: 'Cấu hình Gói cước', path: '/settings/tiers', icon: 'ph-wallet' }, // THÊM MỚI
    { title: 'Quản lý Pháp nhân', path: '/members/corporates', icon: 'ph-buildings' }, // THÊM MỚI
    { title: 'Quản lý Hội viên', path: '/members/individuals', icon: 'ph-user-list' }, // THÊM MỚI
    { title: 'Danh sách Cũ (Tất cả)', path: '/members', icon: 'ph-users-three' }, // GIỮ NGUYÊN MENU CŨ
    { title: 'Duyệt KYC (Pending)', path: '/members/pending', icon: 'ph-user-check' },

    // --- NHÓM DỰ ÁN & BÁO CÁO ---
    { isDivider: true, title: 'Dự án & Kết nối' },
    { title: 'Biz-Link (Dự án)', path: '/biz-link/projects', icon: 'ph-handshake' },
    { title: 'Talent-Hub', path: '/talent-hub', icon: 'ph-briefcase' },
    { title: 'Insights & Báo cáo', path: '/insights', icon: 'ph-chart-bar' },
  ];

  // HÀM XỬ LÝ ĐĂNG XUẤT TỪ SIDEBAR
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-[#002D62] text-white flex flex-col h-full shadow-xl z-20">
      
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-center border-b border-white/10 shrink-0">
        <h1 className="text-2xl font-black tracking-widest">NKBA<span className="text-blue-400">.ADMIN</span></h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        
        {menuItems.map((item, index) => {
          // 1. NẾU LÀ DÒNG CHIA NHÓM (DIVIDER)
          if (item.isDivider) {
            return (
              <div key={`div-${index}`} className="pt-4 pb-1 px-2 mt-2 first:mt-0">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.title}</p>
              </div>
            );
          }

          // 2. NẾU LÀ MENU BÌNH THƯỜNG
          const isActive = item.path && (pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/'));
          
          return (
            <Link 
              key={item.path} 
              href={item.path!}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-white/10 text-white font-bold shadow-sm' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <i className={`ph ${item.icon} text-xl`}></i>
              <span className="text-sm">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
        >
          <i className="ph ph-sign-out text-xl"></i>
          <span className="text-sm font-bold">Đăng xuất</span>
        </button>
      </div>
      
    </aside>
  );
}