import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* HERO SECTION */}
      <div className="bg-[#002D62] text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-luminosity"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight uppercase">Về NKBA Alliance</h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto font-medium leading-relaxed">
            Nichietsu Kensetsu Business Alliance là cầu nối chiến lược, kiến tạo hệ sinh thái bền vững cho các doanh nghiệp Xây dựng và Bất động sản Việt Nam - Nhật Bản.
          </p>
        </div>
      </div>

      {/* NỘI DUNG CHÍNH */}
      <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-6 border-l-4 border-amber-500 pl-4">Sứ Mệnh Của Chúng Tôi</h2>
          <p className="text-slate-600 leading-relaxed mb-6 font-medium text-lg">
            Trong bối cảnh toàn cầu hóa, việc kết nối đúng đối tác và nắm bắt đúng cơ hội là chìa khóa sống còn. NKBA ra đời không chỉ để tạo ra một "sàn giao dịch", mà để xây dựng một <strong>Cộng đồng tinh hoa</strong>.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3"><i className="ph-fill ph-check-circle text-emerald-500 text-xl mt-1"></i> <span className="text-slate-700 font-medium">Bảo chứng niềm tin và năng lực giữa các nhà thầu.</span></li>
            <li className="flex items-start gap-3"><i className="ph-fill ph-check-circle text-emerald-500 text-xl mt-1"></i> <span className="text-slate-700 font-medium">Chuyển giao công nghệ và tiêu chuẩn thi công từ Nhật Bản.</span></li>
            <li className="flex items-start gap-3"><i className="ph-fill ph-check-circle text-emerald-500 text-xl mt-1"></i> <span className="text-slate-700 font-medium">Hỗ trợ pháp lý, ngôn ngữ và văn hóa doanh nghiệp.</span></li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
            <i className="ph-fill ph-buildings text-5xl text-[#002D62] mb-4"></i>
            <p className="text-4xl font-black text-slate-900">150+</p>
            <p className="text-sm font-bold text-slate-400 uppercase mt-2">Doanh nghiệp</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center translate-y-8">
            <i className="ph-fill ph-handshake text-5xl text-amber-500 mb-4"></i>
            <p className="text-4xl font-black text-slate-900">$50M+</p>
            <p className="text-sm font-bold text-slate-400 uppercase mt-2">Giao dịch B2B</p>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 mt-32 text-center bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl">
        <h3 className="text-2xl font-black text-slate-900 mb-4">Bạn đã sẵn sàng đồng hành?</h3>
        <p className="text-slate-500 mb-8 font-medium">Gia nhập liên minh ngay hôm nay để không bỏ lỡ các đặc quyền kết nối.</p>
        <Link href="/dang-ky" className="inline-block px-10 py-4 bg-[#002D62] text-white font-black rounded-xl shadow-lg hover:bg-blue-900 transition-colors">
          ĐĂNG KÝ HỘI VIÊN <i className="ph-bold ph-arrow-right ml-2"></i>
        </Link>
      </div>
    </div>
  );
}