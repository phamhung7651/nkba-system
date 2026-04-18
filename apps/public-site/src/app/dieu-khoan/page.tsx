'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-[#002D62] tracking-tight mb-4">
            Điều Khoản Sử Dụng
          </h1>
          <p className="text-lg text-slate-500">
            Cập nhật lần cuối: Tháng 4/2026
          </p>
        </div>

        {/* NỘI DUNG */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-sm space-y-10 text-slate-600 leading-relaxed">
          
          <section>
            <p className="mb-4">
              Chào mừng bạn đến với <strong>Nền tảng Kết nối Doanh nghiệp NKBA</strong>. Bằng việc truy cập, đăng ký tài khoản và sử dụng các dịch vụ tại website <a href="https://www.nkba.vn" className="text-blue-600 hover:underline">nkba.vn</a>, bạn đồng ý tuân thủ và chịu sự ràng buộc bởi các Điều khoản sử dụng dưới đây. Vui lòng đọc kỹ trước khi tham gia hệ sinh thái của chúng tôi.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">1. Tài khoản và Thông tin Doanh nghiệp</h2>
            <ul className="list-disc pl-5 space-y-3">
              <li>Bạn cam kết cung cấp thông tin cá nhân và pháp nhân chính xác, trung thực khi khởi tạo Hồ sơ Năng lực (E-Profile).</li>
              <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động diễn ra dưới tài khoản của mình.</li>
              <li>NKBA có quyền tạm ngưng hoặc khóa vĩnh viễn các tài khoản cung cấp thông tin giả mạo, hoặc có hành vi lừa đảo làm ảnh hưởng đến uy tín của Liên minh.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">2. Quy định trên Sàn giao thương (Biz-Link) & Talent Hub</h2>
            <ul className="list-disc pl-5 space-y-3">
              <li>Các dự án, gói thầu và tin tuyển dụng được đăng tải phải là thông tin có thật, thuộc quyền sở hữu/quản lý của doanh nghiệp bạn.</li>
              <li>Nghiêm cấm đăng tải các nội dung vi phạm pháp luật Việt Nam, hàng hóa/dịch vụ cấm kinh doanh, hoặc thông tin mang tính chất spam, quấy rối các hội viên khác.</li>
              <li>NKBA đóng vai trò là nền tảng trung gian kết nối (Matching). Chúng tôi không chịu trách nhiệm pháp lý về chất lượng giao dịch, hợp đồng hay sự tranh chấp giữa các doanh nghiệp sau khi đã kết nối thành công.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">3. Cấp độ Hội viên & Quyền lợi</h2>
            <ul className="list-disc pl-5 space-y-3">
              <li>Quyền lợi truy cập thông tin (như Xem Full Contact, Sàn thầu kín) sẽ phụ thuộc vào cấp độ Hội viên (Registered, Official Member, Strategic Partner) mà doanh nghiệp đang sở hữu.</li>
              <li>Hội phí (nếu có) không được hoàn lại trong mọi trường hợp sau khi tài khoản đã được kích hoạt quyền lợi VIP, trừ khi có thỏa thuận khác bằng văn bản từ Ban thư ký NKBA.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">4. Sở hữu trí tuệ</h2>
            <p>
              Tất cả cấu trúc, thiết kế, đồ họa, tính năng nền tảng và bộ nhận diện thương hiệu NKBA thuộc sở hữu độc quyền của chúng tôi. Bạn không được phép sao chép, chỉnh sửa hoặc sử dụng cho mục đích thương mại ngoài phạm vi được cho phép trên nền tảng.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">5. Thay đổi điều khoản</h2>
            <p>
              NKBA có quyền sửa đổi, bổ sung các điều khoản này bất cứ lúc nào để phù hợp với sự phát triển của hệ sinh thái. Những thay đổi sẽ được thông báo trực tiếp trên nền tảng hoặc qua email. Việc bạn tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận các điều khoản mới.
            </p>
          </section>

        </div>

        <div className="mt-8 text-center">
          <Link href="/bao-mat" className="text-blue-600 font-bold hover:underline">
            Xem thêm: Chính sách Bảo mật của chúng tôi &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}