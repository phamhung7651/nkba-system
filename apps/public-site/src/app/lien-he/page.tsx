'use client';

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* CỘT THÔNG TIN */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-[#002D62] mb-6 uppercase tracking-tight">Kết Nối Với Chúng Tôi</h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10">Ban Thư ký NKBA luôn sẵn sàng giải đáp mọi thắc mắc của Quý Doanh nghiệp và Chuyên gia về quy chế hội viên, hợp tác chiến lược.</p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shrink-0">
                  <i className="ph-fill ph-map-pin"></i>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg">Trụ sở chính</h4>
                  <p className="text-slate-600 font-medium mt-1">Tầng 15, Tòa nhà Bitexco Financial Tower<br/> Số 2 Hải Triều, Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shrink-0">
                  <i className="ph-fill ph-phone-call"></i>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg">Hotline (CSKH)</h4>
                  <p className="text-slate-600 font-medium mt-1">1900 1234 (Phím 1: Tiếng Việt, Phím 2: Tiếng Nhật)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-2xl shrink-0">
                  <i className="ph-fill ph-envelope"></i>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg">Email</h4>
                  <p className="text-slate-600 font-medium mt-1">contact@nkba.vn<br/>partnership@nkba.vn</p>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT FORM */}
          <div className="bg-slate-50 p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 mb-8">Gửi tin nhắn trực tuyến</h3>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn! Lời nhắn đã được gửi tới Ban Thư ký.'); }}>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Họ tên / Doanh nghiệp (*)</label>
                <input type="text" required className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-[#002D62]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Số điện thoại (*)</label>
                  <input type="tel" required className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-[#002D62]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email liên hệ (*)</label>
                  <input type="email" required className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-[#002D62]" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nội dung cần hỗ trợ</label>
                <textarea required className="w-full h-32 p-4 rounded-xl border border-slate-200 outline-none resize-none focus:border-[#002D62]"></textarea>
              </div>
              <button type="submit" className="w-full h-14 bg-[#002D62] text-white font-black rounded-xl shadow-lg hover:bg-blue-900 transition-colors flex justify-center items-center gap-2">
                <i className="ph-bold ph-paper-plane-tilt text-xl"></i> GỬI TIN NHẮN
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}