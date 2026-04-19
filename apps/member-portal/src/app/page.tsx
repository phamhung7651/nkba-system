'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function MemberDashboard() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [memberInfo, setMemberInfo] = useState<any>(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      setLoading(true);
      
      // 1. Lấy thông tin user đang login
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        router.push('/login'); 
        return;
      }

      // ==========================================
      // PHÂN LUỒNG 1: TÌM TRONG BẢNG HỘI VIÊN TRƯỚC
      // (Sử dụng user_auth_id để đối chiếu)
      // ==========================================
      const { data: memberData, error: memberError } = await supabase
        .from('individuals')
        .select(`
          full_name,
          email,
          status,
          individual_tiers(name, code),
          corporates(name, tax_code)
        `)
        .eq('user_auth_id', user.id) // <--- ĐIỂM MẤU CHỐT LÀ ĐÂY!
        .maybeSingle();

      if (memberData) {
        // Bắt buộc phải là ACTIVE mới được vào
        if (memberData.status !== 'ACTIVE') {
          alert('Tài khoản của bạn đang chờ phê duyệt từ Ban Thư Ký!');
          router.push('/login');
          return;
        }
        setMemberInfo({ ...memberData, is_admin: false });
      } 
      // ==========================================
      // PHÂN LUỒNG 2: NẾU KHÔNG PHẢI HỘI VIÊN, TÌM TRONG NHÂN VIÊN (ADMIN)
      // ==========================================
      else {
        const { data: empData, error: empError } = await supabase
          .from('employees')
          .select('name, role, email')
          .eq('email', user.email) // Hoặc eq('auth_id', user.id) tùy DB của bạn
          .maybeSingle();

        if (empData) {
          // CẤP QUYỀN TRUY CẬP TỐI CAO ĐỂ ADMIN VÀO PORTAL
          setMemberInfo({
            full_name: empData.name,
            email: user.email,
            status: 'ACTIVE',
            is_admin: true,
            role: empData.role,
            individual_tiers: { name: 'Quyền Truy cập Tối cao' },
            corporates: { name: 'Ban Điều Hành NKBA' }
          });
        } else {
          // Khách vãng lai, không có dữ liệu ở cả 2 bảng -> KICK!
          router.push('/login');
        }
      }
      
      setLoading(false);
    };

    fetchMemberData();
  }, [supabase, router]);

  if (loading || !memberInfo) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <i className="ph-bold ph-spinner animate-spin text-4xl text-[#002D62]"></i>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-sm">Đang xác thực đặc quyền...</p>
        </div>
      </div>
    );
  }

  // Dữ liệu giả lập cho các số liệu thống kê
  const stats = [
    { label: 'Dự án đang kết nối', value: '03', icon: 'ph-fill ph-handshake', color: 'text-blue-600' },
    { label: 'Lượt xem hồ sơ DN', value: '128', icon: 'ph-fill ph-eye', color: 'text-emerald-600' },
    { label: 'Tin tuyển dụng Active', value: '01', icon: 'ph-fill ph-briefcase', color: 'text-amber-600' },
  ];

  // Các thẻ lối tắt tính năng
  const features = [
    { title: 'Sàn Biz-Link', desc: 'Tìm kiếm đối tác & Cơ hội thầu', icon: 'ph ph-buildings', href: '/biz-link', tierRequired: 'GOLD' },
    { title: 'Tuyển dụng J-Job', desc: 'Đăng tin & Tuyển dụng nhân sự Nhật', icon: 'ph ph-user-list', href: '/talent-hub', tierRequired: 'TITANIUM' },
    { title: 'Insights VIP', desc: 'Báo cáo thị trường độc quyền', icon: 'ph ph-chart-line-up', href: '/insights', tierRequired: 'TITANIUM' },
  ];

  return (
    <div className="p-6 md:p-10 space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto">
      
      {/* KHUNG CHÀO ĐÓN */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        
        {/* Nếu là Admin, thêm một lớp background màu đỏ quyền lực */}
        {memberInfo.is_admin && (
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none"></div>
        )}

        <div className="relative z-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Konnichiwa, {memberInfo.full_name}! 👋
          </h1>
          <p className="text-slate-600 mt-2 max-w-lg">
            Chào mừng Đại diện của <strong className={memberInfo.is_admin ? "text-rose-600" : "text-[#002D62]"}>{memberInfo.corporates?.name}</strong> đến với NKBA Portal. 
          </p>
          
          {/* NÚT TẮT DÀNH RIÊNG CHO ADMIN BẰNG NHAU */}
          {memberInfo.is_admin && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                <i className="ph-fill ph-shield-check mr-1"></i> Chế độ Quản trị viên
              </span>
              <a href="http://localhost:3002" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-black rounded-lg font-bold text-sm transition-colors shadow-md">
                Về lại Admin Workspace <i className="ph-bold ph-arrow-square-out"></i>
              </a>
            </div>
          )}
        </div>

        <div className={`flex items-center gap-4 p-4 rounded-2xl border relative z-10 bg-white shadow-sm ${memberInfo.is_admin ? 'border-rose-100' : 'border-[#D4AF37]/20'}`}>
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-3xl shadow-inner ${memberInfo.is_admin ? 'bg-gradient-to-br from-rose-500 to-red-600' : 'bg-gradient-to-br from-[#D4AF37] to-yellow-600'}`}>
            <i className={memberInfo.is_admin ? "ph-fill ph-fingerprint" : "ph-fill ph-crown"}></i>
          </div>
          <div>
            <p className={`text-[10px] font-black uppercase tracking-widest ${memberInfo.is_admin ? 'text-rose-400' : 'text-yellow-600'}`}>
              {memberInfo.is_admin ? 'Phân quyền' : 'Hệ thẻ'}
            </p>
            <p className={`text-xl font-black tracking-tight ${memberInfo.is_admin ? 'text-rose-600' : 'text-[#002D62]'}`}>
              {memberInfo.individual_tiers?.name}
            </p>
          </div>
        </div>
      </div>

      {/* CHỈ SỐ THỐNG KÊ NHANH */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-5 shadow-sm">
            <div className={`w-14 h-14 rounded-full ${stat.color} bg-slate-50 flex items-center justify-center text-2xl`}>
              <i className={stat.icon}></i>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* KHU VỰC TÍNH NĂNG CHÍNH */}
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <i className="ph-bold ph-lightning text-[#002D62]"></i> Công cụ kết nối thực chiến
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, index) => (
            <Link href={feat.href} key={index} className="bg-white p-8 rounded-2xl border border-slate-200 group hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between aspect-square md:aspect-auto">
              <div className="space-y-4">
                <i className={`${feat.icon} text-4xl text-[#002D62]`}></i>
                <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-blue-700">{feat.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
              </div>
              <div className="text-blue-600 font-bold text-sm mt-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Truy cập ngay <i className="ph-bold ph-arrow-right"></i>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}