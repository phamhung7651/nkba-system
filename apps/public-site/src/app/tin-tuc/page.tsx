import Link from 'next/link';

export default function NewsPage() {
  const news = [
    { id: 1, tag: 'Sự kiện', title: 'Lễ ra mắt nền tảng kết nối số NKBA Portal 2026', date: '15/04/2026', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop' },
    { id: 2, tag: 'Thị trường', title: 'Xu hướng chuyển dịch chuỗi cung ứng vật liệu xây dựng Nhật Bản', date: '10/04/2026', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop' },
    { id: 3, tag: 'Thông báo', title: 'Chào mừng 15 hội viên mới gia nhập liên minh tháng 4', date: '05/04/2026', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-black text-[#002D62] mb-2 uppercase">Tin tức & Thông cáo</h1>
        <p className="text-slate-500 font-medium mb-12">Cập nhật những chuyển động mới nhất từ NKBA và thị trường.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map(n => (
            <article key={n.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="h-48 overflow-hidden relative">
                <img src={n.image} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#002D62] uppercase tracking-wider">
                  {n.tag}
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold text-slate-400 mb-3">{n.date}</p>
                <h3 className="text-xl font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{n.title}</h3>
                <div className="mt-6 flex items-center text-sm font-bold text-blue-600 gap-1">
                  Đọc tiếp <i className="ph-bold ph-arrow-right"></i>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="px-8 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors">Tải thêm tin tức</button>
        </div>
      </div>
    </div>
  );
}