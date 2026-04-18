'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function DashboardHome() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminRole, setAdminRole] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Kiểm tra session đăng nhập
      const { data: { user }, error } = await supabase.auth.getUser();
      
      // Nếu không có user, đá văng về trang login
      if (error || !user) {
        console.warn('Không tìm thấy User Session, chuyển hướng về Login');
        router.push('/login');
        return;
      }

      // 2. Lấy Role từ bảng users để hiển thị
      const { data: userData, error: dbError } = await supabase
        .from('employees') // Đổi từ 'users' sang 'employees' nếu bảng phân quyền admin là bảng employees
        .select('role')
        .eq('email', user.email)
        .single();

      if (dbError) {
        console.error('Lỗi khi truy vấn Role:', dbError);
      }

      setAdminEmail(user.email || '');
      if (userData) {
        setAdminRole(userData.role);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#002D62] font-bold animate-pulse">
          <i className="ph ph-spinner animate-spin text-4xl"></i>
          <span>Đang tải không gian quản trị...</span>
        </div>
      </div>
    );
  }

  // Nếu bằng một cách nào đó lọt qua được nhưng không có email
  if (!adminEmail) {
      return null; // Không hiển thị gì, useEffect sẽ lo việc đẩy về login
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Tổng quan Hệ sinh thái</h2>
            <p className="text-slate-500">Số liệu cập nhật trực tiếp từ hệ thống NKBA</p>
          </div>
          
          <div className="text-right">
              <p className="text-sm font-medium text-slate-500">Đang truy cập bởi:</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#002D62]">{adminEmail}</span>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-black tracking-widest uppercase rounded">
                    {adminRole}
                </span>
              </div>
          </div>
      </div>

      {/* Thẻ Thống kê (Metrics Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-blue-600">
          <p className="text-sm font-bold text-slate-500 uppercase">Tổng Hội Viên</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">124</h3>
          <p className="text-sm text-green-600 font-medium mt-2">↑ +12 tháng này</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-sm font-bold text-slate-500 uppercase">Hồ sơ chờ Duyệt (KYC)</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">5</h3>
          <p className="text-sm text-amber-600 font-medium mt-2">Cần xử lý ngay</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-indigo-600">
          <p className="text-sm font-bold text-slate-500 uppercase">Dự án Biz-Link</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">32</h3>
          <p className="text-sm text-slate-500 font-medium mt-2">Đang mở thầu</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-600">
          <p className="text-sm font-bold text-slate-500 uppercase">Chuyên gia Talent-Hub</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">450</h3>
          <p className="text-sm text-green-600 font-medium mt-2">Sẵn sàng kết nối</p>
        </div>
      </div>

      {/* Khu vực Biểu đồ */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[400px] flex items-center justify-center">
        <div className="text-center text-slate-400">
          <i className="ph ph-chart-line-up text-6xl mb-4"></i>
          <p className="font-medium">Khu vực hiển thị Biểu đồ Tăng trưởng (Sẽ tích hợp Chart.js sau)</p>
        </div>
      </div>
    </div>
  );
}