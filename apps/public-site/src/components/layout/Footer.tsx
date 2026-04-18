'use client'

interface FooterProps {
  openRegisterModal: (tier: string) => void;
}

export default function Footer({ openRegisterModal }: FooterProps) {
  return (
    <footer id="contact" className="bg-slate-950 text-white pt-20 pb-10 border-t-4 border-[#002D62]">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <div className="bg-[#002D62] inline-block p-2 rounded mb-6 text-xl font-black">NKBA</div>
            <h2 className="font-heading font-black text-4xl mb-6">Tham gia cùng chúng tôi.</h2>
            <p className="text-slate-400 mb-8 text-lg font-light max-w-md">Đừng bỏ lỡ cơ hội kết nối với mạng lưới doanh nghiệp xây dựng uy tín nhất Việt Nam - Nhật Bản.</p>
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><i className="ph ph-phone text-2xl text-[#D4AF37]"></i></div>
                <div><p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Hotline (Ban Thư Ký)</p><p className="font-bold text-lg">09xx xxx xxx</p></div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><i className="ph ph-envelope text-2xl text-[#D4AF37]"></i></div>
                <div><p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Email</p><p className="font-bold text-lg">contact@nkba.vn</p></div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">
            <div className="text-center mb-8">
              <h3 className="font-bold text-2xl mb-2 text-white">Cần Tư Vấn Thêm?</h3>
              <p className="text-slate-400">Để lại thông tin, chúng tôi sẽ liên hệ trong 24h.</p>
            </div>
            <button onClick={() => openRegisterModal('Consultation')} className="w-full py-5 bg-[#BE0027] text-white font-black rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-900/50">
              Mở Form Đăng Ký
            </button>
          </div>
        </div>
        
        <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600">
          <p>&copy; 2024 NKBA - CÔNG TY CP LIÊN MINH KINH DOANH XÂY DỰNG NHẬT VIỆT.</p>
          <p className="mt-4 md:mt-0 uppercase tracking-widest font-bold text-slate-500">Connecting <span className="text-[#D4AF37]">Trust</span> - Building <span className="text-[#BE0027]">Value</span></p>
        </div>
      </div>
    </footer>
  );
}