import Link from 'next/link';

export default function TalentHubDiscoverPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      
      {/* HERO SECTION */}
      <div className="bg-emerald-900 pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-luminosity"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-xs uppercase tracking-widest mb-6">
            <i className="ph-fill ph-users-three text-lg"></i> Mạng Lưới Chuyên Gia (J-Job)
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6">
            Săn Đón Nhân Sự <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500">Chất Lượng Cao</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-100/80 font-medium leading-relaxed max-w-3xl mx-auto">
            Không cần qua Headhunter tốn kém. Truy cập trực tiếp vào hồ sơ của hàng trăm Kỹ sư, Chỉ huy trưởng, Quản lý dự án song ngữ Việt - Nhật (N2, N1) đã được NKBA thẩm định năng lực.
          </p>
        </div>
      </div>

      {/* SNEAK PEEK (HỒ SƠ CHUYÊN GIA BỊ MỜ) */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 p-8 md:p-12">
          <div className="flex justify-between items-end border-b border-slate-100 pb-6 mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900"><i className="ph-fill ph-star text-amber-500"></i> Talent Pool (Top 5%)</h2>
              <p className="text-slate-500 font-medium mt-1">Các ứng viên đang "Bật đèn xanh" tìm kiếm cơ hội mới.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Candidate 1 */}
            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50 relative overflow-hidden group">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 text-2xl font-black blur-[2px]">?</div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Giám đốc Dự án (Bilingual)</h3>
                  <p className="text-sm font-bold text-emerald-600">Kinh nghiệm: 12 năm • Tiếng Nhật: N1</p>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <span className="inline-block px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-md mr-2">Quản lý thi công</span>
                <span className="inline-block px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-md mr-2">Hợp đồng FIDIC</span>
                <span className="inline-block px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-md">BIM Manager</span>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-slate-200 relative">
                <div className="blur-sm opacity-50 select-none">
                  <p className="text-xs font-bold font-mono">Từng làm việc tại: Shimizu Corp, Obayashi</p>
                  <p className="text-xs font-bold font-mono">Mức lương mong muốn: 3.000 USD/tháng</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link href="/upgrade" className="px-6 py-2 bg-emerald-600 text-white text-xs font-black rounded-lg shadow-lg hover:bg-emerald-700 transition-colors">
                    <i className="ph-fill ph-lock-key"></i> Mở khóa CV
                  </Link>
                </div>
              </div>
            </div>

            {/* Candidate 2 */}
            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50 relative overflow-hidden group">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 text-2xl font-black blur-[2px]">?</div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Kỹ sư trưởng Cơ điện (MEP)</h3>
                  <p className="text-sm font-bold text-emerald-600">Kinh nghiệm: 8 năm • Tiếng Nhật: N2</p>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <span className="inline-block px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-md mr-2">Revit MEP</span>
                <span className="inline-block px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-md mr-2">Thiết kế HVAC</span>
                <span className="inline-block px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-md">Bóc tách khối lượng</span>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-slate-200 relative">
                <div className="blur-sm opacity-50 select-none">
                  <p className="text-xs font-bold font-mono">Dự án tiêu biểu: Nhà máy Panasonic, KCN Thăng Long</p>
                  <p className="text-xs font-bold font-mono">Liên hệ: 091x.xxx.xxx</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link href="/upgrade" className="px-6 py-2 bg-emerald-600 text-white text-xs font-black rounded-lg shadow-lg hover:bg-emerald-700 transition-colors">
                    <i className="ph-fill ph-lock-key"></i> Mở khóa CV
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-24 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Nhân tài là cốt lõi của dự án thành công</h2>
        <p className="text-slate-600 font-medium mb-8">Nâng cấp hạng thẻ Titanium để truy cập toàn bộ kho dữ liệu ứng viên và đăng tin tuyển dụng không giới hạn, tiếp cận trực tiếp mạng lưới kỹ sư chất lượng cao nhất Việt Nam.</p>
        <Link href="/upgrade" className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-black rounded-xl shadow-lg hover:bg-black transition-colors">
          NÂNG CẤP ĐẶC QUYỀN <i className="ph-bold ph-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
}