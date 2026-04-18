'use client';

import Link from 'next/link';

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-black text-[#002D62] tracking-tight mb-4">
            Hướng Dẫn Sử Dụng <br className="md:hidden" /> NKBA Portal
          </h1>
          <p className="text-lg text-slate-500">
            Khám phá cách tối ưu hóa hồ sơ và tận dụng tối đa hệ sinh thái kết nối doanh nghiệp của chúng tôi.
          </p>
        </div>

        {/* NỘI DUNG HƯỚNG DẪN */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-sm space-y-12">
          
          {/* PHẦN 1 */}
          <section>
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg">1</span>
              Khởi tạo Hồ sơ Năng lực (E-Profile)
            </h2>
            <div className="text-slate-600 space-y-4 leading-relaxed pl-14">
              <p>Hồ sơ cá nhân/doanh nghiệp là "tấm danh thiếp số" của bạn trên NKBA. Một hồ sơ đầy đủ sẽ giúp hệ thống đề xuất các cơ hội kết nối (Matching) chính xác nhất.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Truy cập vào mục <strong className="text-slate-800">Tài khoản & Hồ sơ</strong> (Góc trên cùng bên phải màn hình Portal).</li>
                <li>Cập nhật các thông tin cơ bản: Tên, Chức vụ, Email liên hệ.</li>
                <li>Thêm các thông tin chuyên sâu: Kinh nghiệm làm việc, Kỹ năng chuyên môn, Học vấn và Chứng chỉ.</li>
                <li>Nhấn <strong className="text-blue-600 bg-blue-50 px-2 py-1 rounded">Lưu thay đổi</strong> để hệ thống cập nhật thẻ Hội viên của bạn.</li>
              </ul>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* PHẦN 2 */}
          <section>
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-lg">2</span>
              Khám phá Sàn Biz-Link (Kết nối B2B)
            </h2>
            <div className="text-slate-600 space-y-4 leading-relaxed pl-14">
              <p>Đây là khu vực lõi dành cho việc giao thương và mở rộng quan hệ đối tác chiến lược.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Đăng dự án/Nhu cầu:</strong> Bạn có thể chia sẻ các dự án đang tìm kiếm nhà thầu, đối tác hoặc nhà đầu tư.</li>
                <li><strong>Xem liên hệ đối tác:</strong> <em className="text-rose-500 text-sm">*Đặc quyền dành riêng cho Hội viên Official & Strategic.</em> Bạn sẽ được xem thông tin liên hệ trực tiếp của các doanh nghiệp khác để tiến hành giao thương.</li>
              </ul>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* PHẦN 3 */}
          <section>
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg">3</span>
              Tuyển dụng & Nhân tài (Talent Hub)
            </h2>
            <div className="text-slate-600 space-y-4 leading-relaxed pl-14">
              <p>Mạng lưới NKBA cung cấp bảng tin tuyển dụng nội bộ, giúp bạn tiếp cận nguồn nhân sự chất lượng cao được kiểm chứng.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Tại thanh Menu bên trái, chọn <strong className="text-slate-800">Tuyển dụng</strong>.</li>
                <li>Bạn có thể xem các tin tuyển dụng đang mở hoặc đăng tải nhu cầu tìm người của doanh nghiệp mình.</li>
              </ul>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* PHẦN 4 */}
          <section>
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg">4</span>
              Nâng cấp Đặc quyền Hội viên
            </h2>
            <div className="text-slate-600 space-y-4 leading-relaxed pl-14">
              <p>Để mở khóa toàn bộ tính năng của hệ sinh thái (như xem Full Contact, tham gia Sàn thầu kín, Networking Private), bạn cần nâng cấp hạng thẻ.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Truy cập trang <Link href="/upgrade" className="text-blue-600 hover:underline font-bold">Quyền lợi Hội viên</Link>.</li>
                <li>Lựa chọn gói <strong>Official Member</strong> hoặc <strong>Strategic Partner</strong>.</li>
                <li>Ban thư ký NKBA sẽ liên hệ trực tiếp để kích hoạt tài khoản VIP cho bạn trong vòng 24h.</li>
              </ul>
            </div>
          </section>

        </div>

        {/* CALL TO ACTION TRỢ GIÚP */}
        <div className="mt-12 text-center bg-[#002D62] rounded-3xl p-10 text-white shadow-xl">
          <h3 className="text-2xl font-black mb-4">Bạn cần hỗ trợ thêm?</h3>
          <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
            Đội ngũ CSKH và Ban thư ký của NKBA luôn sẵn sàng hỗ trợ bạn giải quyết mọi vấn đề trong quá trình sử dụng nền tảng.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/lien-he" className="bg-amber-500 text-[#002D62] px-8 py-3 rounded-xl font-bold hover:bg-amber-400 transition-colors">
              Liên hệ Ban thư ký
            </Link>
            <a href="mailto:support@nkba.vn" className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/20 border border-white/20 transition-colors">
              support@nkba.vn
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}