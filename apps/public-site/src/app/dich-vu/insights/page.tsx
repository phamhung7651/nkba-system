import Link from 'next/link';

export default function InsightsDiscoverPage() {
  return (
    <div className="bg-white min-h-screen pb-24">
      
      {/* HERO SECTION */}
      <div className="bg-slate-50 pt-24 pb-16 px-6 border-b border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-widest">
              <i className="ph-fill ph-chart-polar text-lg"></i> Dữ liệu Cấp cao
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              Kinh Doanh Bằng Dữ Liệu, <br/> Không Phải Bằng Cảm Tính.
            </h1>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Trang bị cho Ban Giám đốc những bản báo cáo tình báo thị trường độc quyền: Phân tích dòng vốn FDI từ Nhật Bản, Dự báo giá vật liệu xây dựng và Bản đồ quy hoạch KCN mới nhất.
            </p>
            <div className="pt-4 flex gap-4">
              <Link href="/upgrade" className="px-8 py-4 bg-indigo-600 text-white font-black rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors">
                MỞ KHÓA KHO DỮ LIỆU
              </Link>
            </div>
          </div>
          
          {/* HÌNH ẢNH MOCKUP BÁO CÁO (Trực quan hóa) */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl transform rotate-3 scale-105 opacity-20 blur-xl"></div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xl relative z-10">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="w-24 h-4 bg-slate-200 rounded-full"></div>
                <div className="w-10 h-4 bg-emerald-200 rounded-full"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-indigo-50 rounded-xl border border-indigo-100 flex items-end justify-around p-4">
                  {/* Cột biểu đồ giả */}
                  <div className="w-8 bg-indigo-300 rounded-t-sm" style={{ height: '40%' }}></div>
                  <div className="w-8 bg-indigo-400 rounded-t-sm" style={{ height: '70%' }}></div>
                  <div className="w-8 bg-indigo-500 rounded-t-sm" style={{ height: '50%' }}></div>
                  <div className="w-8 bg-indigo-600 rounded-t-sm" style={{ height: '90%' }}></div>
                  <div className="w-8 bg-rose-500 rounded-t-sm relative" style={{ height: '100%' }}>
                    <div className="absolute -top-8 -left-4 bg-slate-900 text-white text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap blur-[2px] select-none">Mật!</div>
                  </div>
                </div>
                <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded-full w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DANH MỤC BÁO CÁO (SNEAK PEEK) */}
      <div className="max-w-6xl mx-auto px-6 mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900">Bên trong Insights VIP có gì?</h2>
          <p className="text-slate-500 font-medium mt-2">Cập nhật định kỳ hàng tháng từ Hội đồng Cố vấn chuyên gia NKBA.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Báo cáo 1 */}
          <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-black uppercase px-4 py-1 rounded-bl-xl">Bản tin Tháng 4</div>
            <i className="ph-fill ph-factory text-4xl text-indigo-600 mb-4"></i>
            <h3 className="text-xl font-black text-slate-900 mb-2">Bản đồ quy hoạch 5 KCN mới tại Bắc Giang & Hải Phòng</h3>
            <p className="text-sm text-slate-600 font-medium mb-6">Tọa độ chính xác, quy mô diện tích và danh sách 12 Tập đoàn Nhật Bản chuẩn bị rót vốn đầu tư nhà máy sản xuất linh kiện...</p>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 backdrop-blur-sm relative">
              <div className="blur-[4px] select-none opacity-60">
                <p className="text-xs font-bold font-mono">Tọa độ: Lô đất C4, KCN Tràng Duệ 3</p>
                <p className="text-xs font-bold font-mono">Chủ đầu tư: XYZ Holdings (Nhật Bản)</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-slate-900/90 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-md flex items-center gap-1"><i className="ph-fill ph-lock"></i> Chỉ dành cho Hội viên Titanium</span>
              </div>
            </div>
          </div>

          {/* Báo cáo 2 */}
          <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-shadow relative overflow-hidden group">
            <i className="ph-fill ph-trend-up text-4xl text-emerald-600 mb-4"></i>
            <h3 className="text-xl font-black text-slate-900 mb-2">Dự báo giá vật liệu Thép & Xi măng Quý 3/2026</h3>
            <p className="text-sm text-slate-600 font-medium mb-6">Phân tích chuỗi cung ứng toàn cầu, tác động của tỷ giá Yên/VNĐ đến chi phí nhập khẩu máy móc thiết bị MEP...</p>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 backdrop-blur-sm relative">
              <div className="blur-[4px] select-none opacity-60">
                <p className="text-xs font-bold font-mono">Dự báo Thép CB240: Tăng 8%</p>
                <p className="text-xs font-bold font-mono">Khuyến nghị: Chốt hợp đồng trước tháng 6</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-slate-900/90 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-md flex items-center gap-1"><i className="ph-fill ph-lock"></i> Dành cho Hội viên Gold trở lên</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* LỜI KÊU GỌI */}
      <div className="max-w-4xl mx-auto px-6 mt-24 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Bạn là nhà thầu hay nhà đầu tư chiến lược?</h2>
        <p className="text-slate-600 font-medium mb-8">Một quyết định dựa trên thông tin nội bộ có thể tiết kiệm cho doanh nghiệp của bạn hàng tỷ đồng chi phí phát sinh hoặc nắm bắt ngay dự án ngon. Đừng để mù thông tin.</p>
        <Link href="/upgrade" className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-black rounded-xl shadow-lg hover:bg-black transition-colors">
          NÂNG CẤP ĐỂ ĐỌC FULL BÁO CÁO <i className="ph-bold ph-arrow-right"></i>
        </Link>
      </div>

    </div>
  );
}