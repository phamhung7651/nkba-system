import Link from 'next/link';

export default function LegalDiscoverPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      
      {/* HERO SECTION */}
      <div className="bg-rose-900 pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-luminosity"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 font-bold text-xs uppercase tracking-widest mb-6">
            <i className="ph-fill ph-scales text-lg"></i> Hỗ Trợ Pháp Lý & Tư Vấn
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6">
            Triệt Tiêu Rủi Ro <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-rose-500">Hợp Đồng Chéo</span>
          </h1>
          <p className="text-lg md:text-xl text-rose-100/80 font-medium leading-relaxed max-w-3xl mx-auto">
            Hàng tỷ đồng có thể "bốc hơi" chỉ vì một điều khoản lỏng lẻo. Bảo vệ biên lợi nhuận của bạn bằng hệ thống biểu mẫu hợp đồng chuẩn Nhật và dịch vụ cố vấn pháp lý chuyên sâu từ NKBA.
          </p>
        </div>
      </div>

      {/* SNEAK PEEK (TÀI LIỆU BỊ KHÓA) */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 p-8 md:p-12">
          <div className="flex justify-between items-end border-b border-slate-100 pb-6 mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900"><i className="ph-fill ph-folder-lock text-amber-500"></i> Kho Biểu mẫu & Tài liệu VIP</h2>
              <p className="text-slate-500 font-medium mt-1">Được soạn thảo và bảo chứng bởi các văn phòng luật sư hàng đầu Việt - Nhật.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Doc 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-shadow relative overflow-hidden group flex flex-col">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center text-2xl mb-4">
                <i className="ph-fill ph-file-text"></i>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Hợp đồng Giao thầu phụ (Tiêu chuẩn Nhật - Việt)</h3>
              <p className="text-sm text-slate-500 font-medium mb-6 flex-1">Ràng buộc chặt chẽ về an toàn lao động, tiến độ và thanh toán theo quy chuẩn khắt khe nhất của JICA.</p>
              
              <div className="relative pt-4 border-t border-slate-100">
                <div className="blur-sm opacity-50 select-none flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-slate-400">PDF / Word (15 trang)</span>
                  <i className="ph-bold ph-download-simple"></i>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                  <Link href="/upgrade" className="px-4 py-1.5 bg-slate-900 text-white text-[10px] uppercase tracking-widest font-black rounded-lg shadow-md hover:bg-rose-600 transition-colors">
                    Mở khóa tải về
                  </Link>
                </div>
              </div>
            </div>

            {/* Doc 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-shadow relative overflow-hidden group flex flex-col">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-4">
                <i className="ph-fill ph-list-checks"></i>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Checklist: Thủ tục Cấp phép Đầu tư KCN</h3>
              <p className="text-sm text-slate-500 font-medium mb-6 flex-1">Quy trình 15 bước từ A-Z để xin giấy phép xây dựng nhà máy cho doanh nghiệp FDI tại Việt Nam.</p>
              
              <div className="relative pt-4 border-t border-slate-100">
                <div className="blur-sm opacity-50 select-none flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-slate-400">Excel / PDF</span>
                  <i className="ph-bold ph-download-simple"></i>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                  <Link href="/upgrade" className="px-4 py-1.5 bg-slate-900 text-white text-[10px] uppercase tracking-widest font-black rounded-lg shadow-md hover:bg-rose-600 transition-colors">
                    Mở khóa tải về
                  </Link>
                </div>
              </div>
            </div>

            {/* Doc 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-shadow relative overflow-hidden group flex flex-col">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-2xl mb-4">
                <i className="ph-fill ph-users-three"></i>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Liên hệ Tổ Tư vấn Pháp lý NKBA</h3>
              <p className="text-sm text-slate-500 font-medium mb-6 flex-1">Book lịch họp 1-1 trực tiếp với các Luật sư chuyên ngành Xây dựng / BĐS trong hệ sinh thái.</p>
              
              <div className="relative pt-4 border-t border-slate-100">
                <div className="blur-[2px] opacity-50 select-none flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-slate-400">Booking Calendar</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                  <Link href="/upgrade" className="px-4 py-1.5 bg-rose-600 text-white text-[10px] uppercase tracking-widest font-black rounded-lg shadow-md hover:bg-rose-700 transition-colors">
                    Đặc quyền Gold/Titanium
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-24 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Pháp lý vững vàng - Hợp tác an tâm</h2>
        <p className="text-slate-600 font-medium mb-8">Chỉ một rủi ro nhỏ cũng có thể quét sạch lợi nhuận dự án. Nâng cấp hạng thẻ để trang bị cho doanh nghiệp tấm khiên bảo vệ pháp lý vững chắc nhất.</p>
        <Link href="/upgrade" className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-black rounded-xl shadow-lg hover:bg-black transition-colors">
          THAM GIA ĐỂ NHẬN ĐẶC QUYỀN <i className="ph-bold ph-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
}