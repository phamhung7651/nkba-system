'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-[#002D62] tracking-tight mb-4">
            Chính Sách Bảo Mật
          </h1>
          <p className="text-lg text-slate-500">
            Cam kết bảo vệ dữ liệu doanh nghiệp và quyền riêng tư của bạn.
          </p>
        </div>

        {/* NỘI DUNG */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-sm space-y-10 text-slate-600 leading-relaxed">
          
          <section>
            <p className="mb-4">
              Tại <strong>NKBA</strong>, chúng tôi hiểu rằng dữ liệu kinh doanh và thông tin liên hệ là tài sản quý giá nhất của mỗi doanh nghiệp. Chính sách này phác thảo cách chúng tôi thu thập, sử dụng, bảo vệ và chia sẻ thông tin của bạn trong hệ sinh thái NKBA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">1. Dữ liệu chúng tôi thu thập</h2>
            <p className="mb-2">Chúng tôi chỉ thu thập các thông tin cần thiết để phục vụ cho việc kết nối B2B, bao gồm:</p>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Thông tin hồ sơ:</strong> Tên, chức vụ, email, số điện thoại, kinh nghiệm, kỹ năng.</li>
              <li><strong>Thông tin doanh nghiệp:</strong> Tên công ty, mã số thuế, lĩnh vực hoạt động, quy mô, hồ sơ năng lực.</li>
              <li><strong>Dữ liệu hoạt động:</strong> Lịch sử đăng tin trên Biz-Link, Talent Hub và các tương tác Matching trên hệ thống.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">2. Cách chúng tôi sử dụng dữ liệu</h2>
            <ul className="list-disc pl-5 space-y-3">
              <li>Đề xuất các đối tác, dự án thầu hoặc ứng viên phù hợp nhất với nhu cầu doanh nghiệp của bạn thông qua thuật toán hệ thống.</li>
              <li>Cung cấp thông tin liên hệ cho các hoạt động giao thương (chỉ áp dụng theo phân quyền cấp độ thẻ).</li>
              <li>Gửi các thông báo quan trọng về tài khoản, sự kiện Networking Private hoặc các thay đổi về dịch vụ.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">3. Chia sẻ thông tin với bên thứ ba</h2>
            <p className="mb-3">Chúng tôi <strong>TUYỆT ĐỐI KHÔNG</strong> bán, trao đổi hoặc cho thuê danh sách liên hệ của hội viên cho các bên thứ ba vì mục đích tiếp thị bên ngoài.</p>
            <p>Thông tin của bạn (đặc biệt là thông tin liên hệ trực tiếp) chỉ được hiển thị nội bộ trên nền tảng cho những Hội viên có đặc quyền (Official Member / Strategic Partner) nhằm phục vụ mục đích kết nối giao thương an toàn.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">4. Bảo mật dữ liệu</h2>
            <p>
              NKBA áp dụng các biện pháp bảo mật điện toán đám mây tiên tiến nhất để bảo vệ thông tin của bạn khỏi việc truy cập trái phép, thay đổi, tiết lộ hoặc phá hủy dữ liệu. Dữ liệu mật khẩu của bạn được mã hóa hoàn toàn và hệ thống áp dụng giao thức SSL bảo mật trong mọi kết nối.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">5. Quyền kiểm soát của bạn</h2>
            <p>
              Bạn có toàn quyền truy cập, chỉnh sửa hoặc xóa bỏ thông tin Hồ sơ năng lực của mình bất cứ lúc nào thông qua giao diện Quản lý tài khoản (Portal). Trong trường hợp muốn chấm dứt hoàn toàn việc tham gia nền tảng, bạn có thể yêu cầu Ban thư ký xóa bỏ toàn bộ dữ liệu của bạn khỏi hệ thống.
            </p>
          </section>

          <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mt-8">
            <h3 className="font-bold text-blue-800 mb-2">Thông tin liên hệ</h3>
            <p className="text-sm text-blue-700">
              Nếu bạn có bất kỳ câu hỏi nào về Chính sách Bảo mật này hoặc cách chúng tôi xử lý dữ liệu, vui lòng liên hệ Ban thư ký NKBA qua email: <strong className="font-black">support@nkba.vn</strong>
            </p>
          </section>

        </div>

        <div className="mt-8 text-center">
          <Link href="/dieu-khoan" className="text-slate-400 font-bold hover:text-slate-600 transition-colors">
            &larr; Trở về trang Điều khoản sử dụng
          </Link>
        </div>

      </div>
    </div>
  );
}