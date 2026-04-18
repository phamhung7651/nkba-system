export default function Vision() {
  return (
    <section id="vision" className="py-32 bg-slate-50 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20" data-aos="fade-up">
          <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs">Kim Chỉ Nam</span>
          <h2 className="font-heading font-black text-4xl text-slate-900 mt-2 tracking-tight">ĐỊNH HƯỚNG CHIẾN LƯỢC</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Mission Card */}
          <div className="bg-gradient-to-br from-[#002D62] to-slate-900 rounded-3xl p-10 md:p-14 shadow-2xl text-center relative z-20" data-aos="fade-up">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-4xl text-[#D4AF37] mx-auto mb-6 backdrop-blur-md rotate-3"><i className="ph ph-target"></i></div>
            <h3 className="font-heading font-black text-3xl mb-6 text-white uppercase tracking-widest">Sứ Mệnh</h3>
            <p className="text-slate-300 text-lg leading-relaxed font-light md:px-10">
              &quot;Tận dụng sự thấu hiểu sâu sắc song phương về văn hóa và kỹ thuật để <strong className="text-white font-bold">kết nối đối tác tin cậy</strong>, tháo gỡ rào cản thương mại, và kiến tạo cơ hội kinh doanh thực chiến.&quot;
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-3xl p-10 md:p-14 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] text-center relative z-10 -mt-10 pt-20 border border-slate-100" data-aos="fade-up" data-aos-delay="100">
            <div className="w-16 h-16 bg-red-50 text-[#BE0027] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 -rotate-3"><i className="ph ph-eye"></i></div>
            <h3 className="font-heading font-black text-2xl mb-6 text-slate-900 uppercase tracking-widest">Tầm Nhìn</h3>
            <p className="text-slate-600 text-lg leading-relaxed md:px-10">
              Trở thành cổng kết nối <strong className="text-[#BE0027]">uy tín và hiệu quả nhất</strong> cho ngành xây dựng Việt - Nhật, xóa bỏ mọi rào cản ngôn ngữ và văn hóa để mang lại giá trị kinh tế thực tiễn bền vững.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}