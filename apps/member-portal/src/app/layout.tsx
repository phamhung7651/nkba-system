'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client'; 
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  // STATE THÔNG BÁO
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotiPanel, setShowNotiPanel] = useState(false);

  // Khởi tạo Supabase
  const supabase = createClient();

  // Kiểm tra user có đang ở trang login không
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    const fetchUserAndNotis = async () => {
      // 1. Kiểm tra session đăng nhập
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setCurrentUser(null);
        return;
      }

      const individualId = user.user_metadata?.individual_id;

      // ==========================================
      // LẤY THÔNG TIN HỘI VIÊN CÁ NHÂN
      // ==========================================
      if (individualId) {
        const { data: profile } = await supabase
          .from('individuals')
          .select(`
            id, full_name, status,
            individual_tiers(name, code)
          `)
          .eq('id', individualId)
          .single();

        if (profile && profile.status === 'ACTIVE') {
          setCurrentUser({
            id: profile.id,
            name: profile.full_name,
            tier: profile.individual_tiers?.name,
            is_admin: false
          });

          // Lấy thông báo của hội viên này
          const { data: notis } = await supabase
            .from('notifications')
            .select('*')
            .eq('member_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(10);

          if (notis) setNotifications(notis);
        }
      } 
      // ==========================================
      // LẤY THÔNG TIN QUẢN TRỊ VIÊN (SUPER_ADMIN)
      // ==========================================
      else {
        const { data: empData } = await supabase
          .from('employees')
          .select('name, role')
          .eq('email', user.email)
          .single();

        if (empData) {
          setCurrentUser({
            id: user.id, // Admin lấy auth_id làm ID tạm
            name: empData.name || 'Quản trị viên',
            tier: empData.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : 'ADMIN',
            is_admin: true
          });
        }
      }
    };

    fetchUserAndNotis();
  }, [pathname, supabase]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleReadNotification = async (noti: any) => {
    if (!noti.is_read) {
      await supabase.from('notifications').update({ is_read: true }).eq('id', noti.id);
      setNotifications(notifications.map(n => n.id === noti.id ? { ...n, is_read: true } : n));
    }
    setShowNotiPanel(false);
    if (noti.link_url) {
      router.push(noti.link_url);
    }
  };

  // HÀM XỬ LÝ ĐĂNG XUẤT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    router.push('/login');
  };

  const navItems = [
    { name: 'Tổng quan', path: '/', icon: 'ph-squares-four' },
    { name: 'Sàn Biz-Link', path: '/biz-link', icon: 'ph-handshake' },
    { name: 'Tuyển dụng', path: '/talent-hub', icon: 'ph-users-three' },
    { name: 'Insights VIP', path: '/insights', icon: 'ph-chart-polar' },
  ];

  return (
    <html lang="vi">
      <head>
        <script src="https://unpkg.com/@phosphor-icons/web" async></script>
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
          
          {/* CHỈ HIỂN THỊ HEADER NẾU KHÔNG PHẢI LÀ TRANG LOGIN */}
          {!isLoginPage && (
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
              <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                
                {/* KHU VỰC LOGO & MENU TRÁI */}
                <div className="flex items-center gap-10">
                  <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-[#002D62] rounded-xl flex items-center justify-center text-white font-black text-xl tracking-tighter shadow-md group-hover:bg-blue-800 transition-colors">NK</div>
                    <span className="font-black text-xl text-[#002D62] tracking-tight hidden md:block">PORTAL</span>
                  </Link>
                  
                  <nav className="hidden lg:flex items-center gap-2">
                    {navItems.map(item => {
                      const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
                      return (
                        <Link key={item.path} href={item.path} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${isActive ? 'bg-blue-50 text-[#002D62]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                          <i className={item.icon}></i> {item.name}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* KHU VỰC GÓC PHẢI (CHUÔNG BÁO + USER PROFILE + ĐĂNG XUẤT) */}
                <div className="flex items-center gap-4 relative">
                  
                  {/* NÚT CHUÔNG BÁO */}
                  <button 
                    onClick={() => setShowNotiPanel(!showNotiPanel)} 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative ${showNotiPanel ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 border border-slate-200 text-slate-500 hover:text-blue-600'}`}
                  >
                    <i className="ph ph-bell text-xl"></i>
                    {unreadCount > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>}
                  </button>

                  {/* DROPDOWN THÔNG BÁO */}
                  {showNotiPanel && (
                    <div className="absolute top-14 right-40 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col z-[100] animate-in slide-in-from-top-2">
                      <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <h4 className="font-black text-slate-800">Thông báo</h4>
                        {unreadCount > 0 && <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">{unreadCount} mới</span>}
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-sm text-slate-400">Chưa có thông báo nào.</div>
                        ) : (
                          notifications.map(noti => (
                            <div 
                              key={noti.id} 
                              onClick={() => handleReadNotification(noti)} 
                              className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors flex gap-3 ${!noti.is_read ? 'bg-blue-50/30' : ''}`}
                            >
                              <div className="mt-1">
                                {!noti.is_read ? <div className="w-2 h-2 rounded-full bg-blue-500"></div> : <i className="ph ph-check-circle text-slate-300"></i>}
                              </div>
                              <div>
                                <p className={`text-sm ${!noti.is_read ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`}>{noti.title}</p>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{noti.content}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                                  {new Date(noti.created_at).toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
                  
                  {/* USER PROFILE AVATAR (Linh động theo màu của Admin / User) */}
                  {currentUser ? (
                    <Link href="/profile" className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors">
                      <div className="text-right hidden md:block">
                        <p className={`text-sm font-black leading-tight transition-colors ${currentUser.is_admin ? 'text-rose-600' : 'text-slate-900 group-hover:text-blue-600'}`}>
                          {currentUser.name}
                        </p>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${currentUser.is_admin ? 'text-rose-400' : 'text-amber-600'}`}>
                          {currentUser.tier}
                        </p>
                      </div>
                      <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-black shadow-md border-2 border-white ring-2 ${currentUser.is_admin ? 'bg-gradient-to-br from-rose-500 to-red-600 ring-rose-100' : 'bg-gradient-to-br from-amber-400 to-amber-600 ring-amber-100'}`}>
                        {currentUser.name?.charAt(0) || 'N'}
                      </div>
                    </Link>
                  ) : (
                    <div className="text-sm font-bold text-slate-400 animate-pulse flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200"></div> Đang tải...
                    </div>
                  )}

                  {/* NÚT ĐĂNG XUẤT */}
                  <button 
                    onClick={handleLogout}
                    title="Đăng xuất"
                    className="w-10 h-10 ml-2 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <i className="ph ph-sign-out text-xl"></i>
                  </button>

                </div>
              </div>
            </header>
          )}

          {/* NỘI DUNG CHÍNH (CÁC PAGE TRUYỀN VÀO) */}
          <main className="flex-1 w-full relative">
            {children}
          </main>
          
        </div>
      </body>
    </html>
  );
}