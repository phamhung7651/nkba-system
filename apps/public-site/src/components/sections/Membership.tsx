'use client'

interface MembershipProps {
  openRegisterModal: (tier: string) => void;
}

export default function Membership({ openRegisterModal }: MembershipProps) {
  return (
    <section id="membership" className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* TIÊU ĐỀ */}
        <div className="text-center mb-20">
          <h2 className="font-heading font-black text-4xl text-slate-900 uppercase tracking-tight">Quyền lợi Hội viên</h2>
          <p className="text-slate-500 mt-4 text-lg">
            Lựa chọn cấp độ phù hợp với doanh nghiệp của bạn <br className="hidden md:block"/>
            <span className="font-bold text-rose-500">🔥 Ưu đãi đặc quyền dành riêng cho 100 thành viên sáng lập.</span>
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 items-center">
          
          {/* 1. GÓI FREE (Tiêu chuẩn - Giảm rào cản) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-lg hover:shadow-xl transition-shadow relative">
            <h4 className="font-bold text-lg text-slate-500 uppercase tracking-widest mb-2">Registered</h4>
            <div className="text-4xl font-black text-slate-900 mb-2">0 VNĐ</div>
            <p className="text-sm text-slate-400 mb-8 pb-8 border-b border-slate-100">Miễn phí trọn đời</p>
            
            <ul className="space-y-4 text-sm text-slate-600 text-left mb-10 min-h-[160px]">
              <li className="flex items-center gap-3"><i className="ph ph-check text-green-500 text-lg shrink-0"></i> Hồ sơ năng lực điện tử</li>
              <li className="flex items-center gap-3"><i className="ph ph-check text-green-500 text-lg shrink-0"></i> Xem Job Board công khai</li>
              <li className="flex items-center gap-3 text-slate-400 opacity-50"><i className="ph ph-x text-lg shrink-0"></i> Không xem contact thầu</li>
              <li className="flex items-center gap-3 text-slate-400 opacity-50"><i className="ph ph-x text-lg shrink-0"></i> Không có huy hiệu uy tín</li>
            </ul>
            <button onClick={() => openRegisterModal('Registered')} className="w-full py-4 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all">Đăng Ký Miễn Phí</button>
          </div>

          {/* 2. GÓI VIP (Chiến lược FOMO - Chim sớm) */}
          <div className="bg-gradient-to-b from-[#002D62] to-slate-900 text-white rounded-3xl p-1 p-12 text-center shadow-2xl shadow-blue-900/30 ring-2 ring-[#D4AF37] transform lg:-translate-y-4 relative z-20">
            {/* Tag Nổi bật */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-slate-900 text-xs font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">Ưu đãi sáng lập</div>
            
            <h4 className="font-bold text-lg text-[#D4AF37] uppercase tracking-widest mb-4">Official Member</h4>
            
            {/* Khối Giá Khuyến Mãi */}
            <div className="flex flex-col items-center justify-center mb-6">
              <span className="text-white/50 line-through text-lg font-medium decoration-rose-500 decoration-2 mb-1">2.400.000đ / Năm</span>
              <div className="text-5xl font-black text-white mb-3">0<span className="text-2xl ml-1">VNĐ</span></div>
              <p className="text-xs text-slate-900 font-black bg-[#D4AF37] py-1.5 px-4 rounded-full shadow-md">
                🎉 Miễn phí 1 năm đầu tiên
              </p>
            </div>

            <ul className="space-y-4 text-sm text-slate-200 text-left mb-8 min-h-[160px]">
              <li className="flex items-center gap-3"><i className="ph-fill ph-check-circle text-[#D4AF37] text-xl shrink-0"></i> <strong className="text-white">Xem Full Contact đối tác</strong></li>
              <li className="flex items-center gap-3"><i className="ph-fill ph-check-circle text-[#D4AF37] text-xl shrink-0"></i> <strong className="text-white">Networking Private hàng tháng</strong></li>
              <li className="flex items-center gap-3"><i className="ph-fill ph-check-circle text-[#D4AF37] text-xl shrink-0"></i> Đăng tin B2B lên Group kín</li>
              <li className="flex items-center gap-3"><i className="ph-fill ph-check-circle text-[#D4AF37] text-xl shrink-0"></i> Huy hiệu "Official Member"</li>
            </ul>
            
            <button onClick={() => openRegisterModal('Official')} className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-slate-900 font-black text-lg rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-[#D4AF37]/30">Nhận Đặc Quyền VIP Ngay</button>
            <p className="text-[10px] text-white/40 mt-4">* Chỉ áp dụng cho 100 doanh nghiệp đăng ký sớm nhất.</p>
          </div>

          {/* 3. GÓI ĐỐI TÁC CHIẾN LƯỢC (Neo giá) */}
          <div className="bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/30 rounded-3xl p-10 text-center shadow-lg hover:shadow-xl transition-shadow relative">
            <h4 className="font-bold text-lg text-[#D4AF37] uppercase tracking-widest mb-2">Strategic Partner</h4>
            <div className="text-4xl font-black text-slate-900 mb-2">10<span className="text-2xl">Tr</span></div>
            <p className="text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200">/ Năm (Số lượng giới hạn)</p>
            
            <ul className="space-y-4 text-sm text-slate-600 text-left mb-10 min-h-[160px]">
              <li className="flex items-center gap-3"><i className="ph-fill ph-star text-[#D4AF37] text-lg shrink-0"></i> <strong className="text-slate-900">Quyền lợi Nhà Tài Trợ (Logo)</strong></li>
              <li className="flex items-center gap-3"><i className="ph-fill ph-star text-[#D4AF37] text-lg shrink-0"></i> <strong className="text-slate-900">Tiếp cận Sàn thầu kín</strong></li>
              <li className="flex items-center gap-3"><i className="ph-fill ph-star text-[#D4AF37] text-lg shrink-0"></i> Ưu tiên Matching 1:1 C-Level</li>
              <li className="flex items-center gap-3"><i className="ph-fill ph-star text-[#D4AF37] text-lg shrink-0"></i> Tham vấn chiến lược cùng BĐH</li>
            </ul>
            <button onClick={() => openRegisterModal('Strategic')} className="w-full py-4 bg-slate-900 text-[#D4AF37] font-bold rounded-xl hover:bg-slate-800 transition-all">Liên hệ Hợp tác VIP</button>
          </div>
          
        </div>
      </div>
    </section>
  );
}