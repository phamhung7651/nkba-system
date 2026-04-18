'use client'

interface MembershipProps {
  openRegisterModal: (tier: string) => void;
}

export default function Membership({ openRegisterModal }: MembershipProps) {
  return (
    <section id="membership" className="py-32 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-heading font-black text-4xl text-slate-900">QUYỀN LỢI HỘI VIÊN</h2>
          <p className="text-slate-500 mt-4">Lựa chọn cấp độ phù hợp với doanh nghiệp của bạn</p>
        </div>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 items-center">
          {/* Free */}
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-lg">
            <h4 className="font-bold text-lg text-slate-500 uppercase tracking-widest mb-2">Registered</h4>
            <div className="text-4xl font-black text-slate-900 mb-2">0 VNĐ</div>
            <p className="text-sm text-slate-400 mb-8 pb-8 border-b border-slate-100">Miễn phí trọn đời</p>
            <ul className="space-y-4 text-sm text-slate-600 text-left mb-10">
              <li className="flex items-center gap-3"><i className="ph ph-check text-green-500 text-lg"></i> Hồ sơ năng lực điện tử</li>
              <li className="flex items-center gap-3"><i className="ph ph-check text-green-500 text-lg"></i> Xem Job Board công khai</li>
              <li className="flex items-center gap-3 text-slate-400 opacity-50"><i className="ph ph-x text-lg"></i> Không xem contact thầu</li>
            </ul>
            <button onClick={() => openRegisterModal('Registered')} className="w-full py-4 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition">Đăng Ký Miễn Phí</button>
          </div>

          {/* Pro - Center Glow */}
          <div className="bg-gradient-to-b from-[#002D62] to-slate-900 text-white rounded-3xl p-12 text-center shadow-2xl ring-2 ring-[#D4AF37] transform lg:-translate-y-4 relative z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-slate-900 text-xs font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">Khuyên Dùng</div>
            <h4 className="font-bold text-lg text-[#D4AF37] uppercase tracking-widest mb-2">Official Member</h4>
            <div className="text-5xl font-black text-white mb-2">2.4<span className="text-2xl">Tr</span></div>
            <p className="text-sm text-blue-200 mb-8 pb-8 border-b border-white/10">/ Năm (Chỉ 200k/tháng)</p>
            <ul className="space-y-4 text-sm text-slate-200 text-left mb-10">
              <li className="flex items-center gap-3"><i className="ph ph-check-circle text-[#D4AF37] text-xl"></i> <strong className="text-white">Xem Full Contact đối tác</strong></li>
              <li className="flex items-center gap-3"><i className="ph ph-check-circle text-[#D4AF37] text-xl"></i> <strong className="text-white">Networking Private hàng tháng</strong></li>
              <li className="flex items-center gap-3"><i className="ph ph-check-circle text-[#D4AF37] text-xl"></i> Đăng tin B2B lên Group kín</li>
            </ul>
            <button onClick={() => openRegisterModal('Official')} className="w-full py-4 bg-[#D4AF37] text-slate-900 font-black rounded-xl hover:bg-yellow-400 transition shadow-lg shadow-[#D4AF37]/30">Trở thành Hội Viên Mới</button>
          </div>

          {/* VIP */}
          <div className="bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/30 rounded-3xl p-10 text-center shadow-lg">
            <h4 className="font-bold text-lg text-[#D4AF37] uppercase tracking-widest mb-2">Strategic Partner</h4>
            <div className="text-4xl font-black text-slate-900 mb-2">10<span className="text-2xl">Tr</span></div>
            <p className="text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200">/ Năm (Số lượng giới hạn)</p>
            <ul className="space-y-4 text-sm text-slate-600 text-left mb-10">
              <li className="flex items-center gap-3"><i className="ph ph-star-fill text-[#D4AF37] text-lg"></i> <strong className="text-slate-900">Quyền lợi Nhà Tài Trợ (Logo)</strong></li>
              <li className="flex items-center gap-3"><i className="ph ph-star-fill text-[#D4AF37] text-lg"></i> <strong className="text-slate-900">Tiếp cận Sàn thầu kín</strong></li>
              <li className="flex items-center gap-3"><i className="ph ph-star-fill text-[#D4AF37] text-lg"></i> Ưu tiên Matching 1:1 C-Level</li>
            </ul>
            <button onClick={() => openRegisterModal('Strategic')} className="w-full py-4 bg-slate-900 text-[#D4AF37] font-bold rounded-xl hover:bg-slate-800 transition">Liên hệ VIP</button>
          </div>
        </div>
      </div>
    </section>
  );
}