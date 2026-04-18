import Link from 'next/link';

export default function EcosystemPage() {
  // Đã sửa lại đường dẫn (href) cho từng mục
  const services = [
    { 
      id: 1, title: 'Sàn giao dịch Biz-Link', href: '/dich-vu/biz-link',
      icon: 'ph-buildings', color: 'text-blue-600', bg: 'bg-blue-50', 
      desc: 'Đăng tải và tiếp cận hàng trăm dự án thầu phụ, thầu chính được xác thực bởi Ban quản trị NKBA.' 
    },
    { 
      id: 2, title: 'Talent Hub (J-Job)', href: '/dich-vu/talent-hub',
      icon: 'ph-users-three', color: 'text-emerald-600', bg: 'bg-emerald-50', 
      desc: 'Mạng lưới chuyên gia chất lượng cao. Nơi doanh nghiệp săn đón nhân sự có tiếng Nhật và tay nghề kỹ thuật.' 
    },
    { 
      id: 3, title: 'Insights VIP', href: '/dich-vu/insights',
      icon: 'ph-chart-line-up', color: 'text-amber-600', bg: 'bg-amber-50', 
      desc: 'Cập nhật báo cáo chuyên sâu về thị trường BĐS công nghiệp, xu hướng vật liệu và chính sách FDI Nhật Bản.' 
    },
    { 
      id: 4, title: 'Legal & Consulting', href: '/dich-vu/legal',
      icon: 'ph-scales', color: 'text-rose-600', bg: 'bg-rose-50', 
      desc: 'Hỗ trợ tư vấn hợp đồng, giải quyết tranh chấp pháp lý và các thủ tục cấp phép đầu tư xuyên biên giới.' 
    },
  ];

  return (
    <div className="bg-white min-h-screen pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4">
          <p className="text-amber-600 font-bold uppercase tracking-widest text-sm mb-3">Giải pháp toàn diện</p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Hệ Sinh Thái NKBA</h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">Bốn trụ cột sức mạnh giúp doanh nghiệp của bạn vận hành trơn tru và phát triển bứt phá trong môi trường quốc tế.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s, index) => (
            <div key={s.id} className="p-10 rounded-[2rem] border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group animate-in fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm ${s.bg} ${s.color}`}>
                <i className={`ph-fill ${s.icon}`}></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-[#002D62] transition-colors">{s.title}</h3>
              <p className="text-slate-600 font-medium leading-relaxed mb-8">{s.desc}</p>
              
              {/* Nút Khám phá trỏ về trang chi tiết tương ứng */}
              <Link href={s.href} className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-sm font-bold text-slate-700 rounded-xl group-hover:bg-[#002D62] group-hover:text-white group-hover:border-[#002D62] transition-all shadow-sm">
                Khám phá chi tiết <i className="ph-bold ph-arrow-right"></i>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}