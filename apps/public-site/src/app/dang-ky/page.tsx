'use client';

import { useState } from 'react';
import { supabase } from 'supabase/client'; 
import Link from 'next/link';

export default function JoinAlliancePage() {
  const BANK_ID = "MB"; 
  const ACCOUNT_NO = "123456789"; 
  const ACCOUNT_NAME = "HIEP HOI NKBA";

  // LOẠI HỘI VIÊN: Doanh nghiệp hoặc Cá nhân
  const [memberType, setMemberType] = useState<'CORPORATE' | 'INDIVIDUAL'>('CORPORATE');

  // State quản lý form và các bước
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    fullName: '', phone: '', email: '', password: '', // Thông tin cá nhân
    companyName: '', taxCode: '', country: 'VN' // Thông tin doanh nghiệp (chỉ dùng nếu là CORPORATE)
  });
  const [selectedTier, setSelectedTier] = useState('Official Member (2.4tr/năm)'); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State dành cho kết quả
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFreeTier, setIsFreeTier] = useState(false);
  const [qrContent, setQrContent] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const freeTierSelected = selectedTier.includes('Miễn phí');
      setIsFreeTier(freeTierSelected);
      const initialStatus = freeTierSelected ? 'ACTIVE' : 'PENDING_VERIFICATION'; 

      let finalIndividualId = '';
      let webhookRefId = ''; // Mã để webhook nhận diện (Dùng ID công ty hoặc ID cá nhân)

      // KỊCH BẢN 1: ĐĂNG KÝ CHO DOANH NGHIỆP
      if (memberType === 'CORPORATE') {
        if (!formData.companyName || !formData.taxCode) throw new Error('Vui lòng điền đầy đủ thông tin Doanh nghiệp.');

        // 1. Tạo pháp nhân
        const { data: corpData, error: corpError } = await supabase
          .from('corporates')
          .insert([{
            name: formData.companyName, tax_code: formData.taxCode, 
            status: initialStatus, join_date: freeTierSelected ? new Date().toISOString() : null
          }])
          .select().single();

        if (corpError) throw new Error('Lỗi tạo hồ sơ doanh nghiệp (Có thể trùng MST): ' + corpError.message);

        // 2. Tạo đại diện
        const { data: indData, error: indError } = await supabase
          .from('individuals')
          .insert([{
            full_name: formData.fullName, email: formData.email, phone: formData.phone,
            corporate_id: corpData.id, is_corporate_sponsored: true, 
            tier_id: selectedTier.includes('Cần tư vấn') || freeTierSelected ? 'ID-CỦA-GÓI-FREE-TRONG-DB' : 'ID-CỦA-GÓI-OFFICIAL-TRONG-DB', 
            status: initialStatus, join_date: freeTierSelected ? new Date().toISOString() : null
          }])
          .select().single();

        if (indError) throw new Error('Lỗi tạo hồ sơ đại diện: ' + indError.message);
        
        finalIndividualId = indData.id;
        webhookRefId = corpData.id.split('-')[0]; // Lấy đầu ID công ty làm mã QR
      } 
      // KỊCH BẢN 2: ĐĂNG KÝ CHO CÁ NHÂN ĐỘC LẬP
      else {
        // 1. Tạo cá nhân luôn, không cần pháp nhân
        const { data: indData, error: indError } = await supabase
          .from('individuals')
          .insert([{
            full_name: formData.fullName, email: formData.email, phone: formData.phone,
            corporate_id: null, is_corporate_sponsored: false, 
            tier_id: selectedTier.includes('Cần tư vấn') || freeTierSelected ? 'ID-CỦA-GÓI-FREE-TRONG-DB' : 'ID-CỦA-GÓI-OFFICIAL-TRONG-DB', 
            status: initialStatus, join_date: freeTierSelected ? new Date().toISOString() : null
          }])
          .select().single();

        if (indError) throw new Error('Lỗi tạo hồ sơ cá nhân: ' + indError.message);

        finalIndividualId = indData.id;
        webhookRefId = indData.id.split('-')[0]; // Lấy đầu ID cá nhân làm mã QR
      }

      // TẠO TÀI KHOẢN SUPABASE AUTH (Chung cho cả 2 loại)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName, phone: formData.phone,
            individual_id: finalIndividualId, requested_tier: selectedTier
          }
        }
      });

      if (authError) throw new Error('Lỗi tạo tài khoản bảo mật: ' + authError.message);
      
      // Tạo cú pháp chuyển khoản
      if (!freeTierSelected && !selectedTier.includes('Cần tư vấn')) {
        setQrContent(`NKBA JOIN ${webhookRefId}`);
      }

      // Chuyển sang trang kết quả
      setIsSuccess(true);
      setStep(2);
      
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12 space-y-3">
          <div className="inline-block bg-[#002D62] text-amber-400 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg">Gia nhập Liên minh</div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight font-heading">Nâng Tầm Kết Nối Cùng NKBA</h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">Mở rộng cơ hội giao thương Việt - Nhật dù bạn là Doanh nghiệp hay Chuyên gia độc lập.</p>
        </div>

        {step === 1 && (
          <div className="bg-white p-8 sm:p-12 rounded-[2rem] border border-slate-200 shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-500">
            
            {/* TAB CHỌN LOẠI HỘI VIÊN */}
            <div className="flex justify-center mb-10">
              <div className="bg-slate-100 p-1.5 rounded-2xl inline-flex flex-col sm:flex-row shadow-inner">
                <button 
                  type="button" 
                  onClick={() => setMemberType('CORPORATE')} 
                  className={`px-8 py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${memberType === 'CORPORATE' ? 'bg-white text-[#002D62] shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <i className="ph-fill ph-buildings text-lg"></i> Đại diện Doanh nghiệp
                </button>
                <button 
                  type="button" 
                  onClick={() => setMemberType('INDIVIDUAL')} 
                  className={`px-8 py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${memberType === 'INDIVIDUAL' ? 'bg-white text-[#002D62] shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <i className="ph-fill ph-user text-lg"></i> Chuyên gia độc lập
                </button>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-10">
              
              <div className={`grid grid-cols-1 ${memberType === 'CORPORATE' ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'} gap-x-12 gap-y-10`}>
                
                {/* THÔNG TIN CÁ NHÂN (Dùng chung cho cả 2 luồng) */}
                <div className={memberType === 'INDIVIDUAL' ? 'w-full' : ''}>
                  <h3 className="font-black text-2xl text-slate-900 border-b-2 border-slate-100 pb-4 mb-6 flex items-center gap-3">
                    <i className="ph-fill ph-user-circle text-[#002D62]"></i> 
                    {memberType === 'CORPORATE' ? 'Tài khoản Đại diện' : 'Thông tin Cá nhân'}
                  </h3>
                  <div className="space-y-5">
                    <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Họ và Tên (*)</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 h-12 border border-slate-200 rounded-xl transition bg-slate-50 font-bold outline-none focus:border-indigo-400" /></div>
                    <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Số điện thoại (*)</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 h-12 border border-slate-200 rounded-xl transition bg-slate-50 font-mono outline-none focus:border-indigo-400" /></div>
                    <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email đăng nhập Portal (*)</label><input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 h-12 border border-slate-200 rounded-xl transition bg-slate-50 font-bold outline-none focus:border-indigo-400" /></div>
                    <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mật khẩu (*)</label><input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} className="w-full px-4 h-12 border border-slate-200 rounded-xl transition bg-slate-50 font-mono outline-none focus:border-indigo-400" placeholder="••••••••" /></div>
                  </div>
                </div>

                {/* THÔNG TIN DOANH NGHIỆP (Chỉ hiện khi chọn CORPORATE) */}
                {memberType === 'CORPORATE' && (
                  <div className="animate-in fade-in slide-in-from-right-4">
                    <h3 className="font-black text-2xl text-slate-900 border-b-2 border-slate-100 pb-4 mb-6 flex items-center gap-3">
                      <i className="ph-fill ph-buildings text-[#002D62]"></i> Hồ sơ Pháp nhân
                    </h3>
                    <div className="space-y-5">
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tên Doanh Nghiệp (*)</label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required={memberType === 'CORPORATE'} className="w-full px-4 h-12 border border-slate-200 rounded-xl transition bg-slate-50 font-bold outline-none focus:border-indigo-400" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mã số Thuế (*)</label><input type="text" name="taxCode" value={formData.taxCode} onChange={handleChange} required={memberType === 'CORPORATE'} className="w-full px-4 h-12 border border-slate-200 rounded-xl transition bg-slate-50 font-mono outline-none focus:border-indigo-400" /></div>
                        <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quốc gia</label><select name="country" value={formData.country} onChange={handleChange} className="w-full px-4 h-12 border border-slate-200 rounded-xl bg-slate-50 font-bold appearance-none outline-none focus:border-indigo-400"><option value="VN">Việt Nam</option><option value="JP">Nhật Bản</option></select></div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-2">
                        <p className="text-xs text-blue-800 font-medium italic"><i className="ph-fill ph-info"></i> Bằng việc đăng ký tài khoản Doanh nghiệp, bạn mặc định sẽ đóng vai trò là Người đại diện (Company Admin) quản lý hồ sơ pháp nhân này trên hệ thống.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CHỌN GÓI THẺ */}
              <div className={`bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-100 ${memberType === 'INDIVIDUAL' ? 'max-w-2xl mx-auto' : ''}`}>
                <label className="text-sm font-black text-[#002D62] uppercase tracking-widest mb-3 block flex items-center gap-2"><i className="ph-fill ph-crown text-xl text-amber-500"></i> Hạng thẻ đăng ký tham gia</label>
                <p className="text-xs text-slate-500 mb-4 font-medium italic">* Nếu chọn các gói có phí, bạn sẽ nhận được thông tin chuyển khoản ở bước tiếp theo để kích hoạt hồ sơ.</p>
                <select 
                  className="w-full px-5 h-14 border-2 border-blue-200 bg-white rounded-xl focus:border-[#002D62] outline-none transition font-bold text-blue-900 text-lg cursor-pointer shadow-sm"
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                >
                  <option value="Registered (Miễn phí)">Gói Khởi đầu (Miễn phí - Vào ngay)</option>
                  <option value="Official Member (2.4tr/năm)">Official Member (2.400.000 VNĐ/năm)</option>
                  <option value="Strategic Partner (10tr/năm)">Strategic Partner (10.000.000 VNĐ/năm)</option>
                  <option value="Cần tư vấn thêm">Khác (Liên hệ tư vấn trực tiếp)</option>
                </select>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-6">
                <Link href="/" className="px-8 h-12 bg-white text-slate-600 font-bold text-sm rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">HỦY BỎ</Link>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`px-12 h-14 text-white font-black rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#002D62] hover:bg-blue-900 shadow-blue-900/20 hover:-translate-y-0.5'}`}
                >
                  {isSubmitting ? <><i className="ph-bold ph-spinner animate-spin text-xl"></i> ĐANG GỬI DỮ LIỆU...</> : <><i className="ph-bold ph-paper-plane-right text-xl"></i> GỬI HỒ SƠ ĐĂNG KÝ</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: KẾT QUẢ & THÔNG TIN CHUYỂN KHOẢN (Giữ nguyên như cũ) */}
        {step === 2 && (
          <div className="bg-white p-12 rounded-[2rem] border-4 border-emerald-200 shadow-2xl animate-in zoom-in-95 text-center max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <i className="ph-fill ph-check-circle text-6xl"></i>
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">ĐÃ NHẬN HỒ SƠ THÀNH CÔNG!</h2>
            <p className="text-lg text-slate-600 font-medium mt-3">Chào mừng <strong className="text-blue-700">{formData.fullName}</strong> đến với Nichietsu Kensetsu Business Alliance.</p>
            
            {isFreeTier ? (
              <div className="mt-10 bg-emerald-50 p-6 rounded-2xl border border-emerald-100 leading-relaxed text-emerald-900 font-medium space-y-4">
                <p>Vì bạn đăng ký <strong>Gói Khởi đầu (Miễn phí)</strong>, hệ thống đã tự động kích hoạt tài khoản của bạn ngay lập tức.</p>
                <p>Bạn đã có thể sử dụng Email và Mật khẩu vừa tạo để đăng nhập vào Member Portal để bắt đầu kết nối.</p>
                <a href="http://localhost:3001/login" className="inline-flex h-12 px-8 mt-4 bg-emerald-600 text-white font-bold rounded-xl items-center gap-2 shadow-md hover:bg-emerald-700 transition-colors">VÀO PORTAL THÀNH VIÊN <i className="ph-bold ph-arrow-right"></i></a>
              </div>
            ) : selectedTier.includes('Cần tư vấn') ? (
               <div className="mt-10 bg-slate-50 p-6 rounded-2xl border space-y-3 font-medium text-slate-700 leading-relaxed border-slate-100">
                <p>Vì bạn cần tư vấn thêm, Ban Thư ký NKBA sẽ liên hệ qua Số điện thoại <strong className="text-slate-900">{formData.phone}</strong> trong vòng 24h làm việc để hướng dẫn chi tiết.</p>
                <p>Tài khoản Portal của bạn đã được tạo nhưng đang ở trạng thái <strong>Chờ kích hoạt</strong>.</p>
                <Link href="/" className="inline-flex h-12 px-8 mt-4 bg-[#002D62] text-white font-bold rounded-xl items-center gap-2 shadow-md hover:bg-blue-900 transition-colors"><i className="ph-bold ph-arrow-left"></i> QUAY VỀ TRANG CHỦ</Link>
               </div>
            ) : (
              <div className="mt-10 pt-10 border-t-2 border-slate-100 space-y-6 text-left">
                <p className="font-bold text-slate-800 text-lg border-l-4 border-amber-400 pl-4">Bước tiếp theo: Kích hoạt Thẻ <strong className="text-amber-600">{selectedTier}</strong> của bạn</p>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Để hoàn tất quy trình và kích hoạt tài khoản chính thức, quý khách vui lòng thanh toán phí thường niên bằng cách chuyển khoản theo thông tin dưới đây. Hệ thống sẽ <strong className="text-blue-600">tự động duyệt</strong> ngay khi nhận được tiền.</p>
                
                <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                  <div className="shrink-0 bg-white p-3 rounded-2xl shadow-xl border border-slate-100">
                    <img src={`https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.jpg?amount=${selectedTier.includes('2.4tr') ? '2400000' : '10000000'}&addInfo=${qrContent}&accountName=${ACCOUNT_NAME}`} alt="VietQR" className="w-48 h-48 object-contain" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-black text-slate-900">Thông tin chuyển khoản</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm bg-white p-4 rounded-xl shadow-sm border border-slate-100 font-medium">
                      <p className="text-slate-400">Ngân hàng:</p><p className="font-bold text-slate-800">MB Bank</p>
                      <p className="text-slate-400">Số tài khoản:</p><p className="font-mono font-bold text-slate-800">{ACCOUNT_NO}</p>
                      <p className="text-slate-400">Số tiền:</p><p className="font-black text-2xl text-amber-600">{selectedTier.includes('2.4tr') ? '2.400.000đ' : '10.000.000đ'}</p>
                      <p className="text-slate-400">Nội dung (Bắt buộc):</p><p className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1.5 rounded">{qrContent}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100 leading-relaxed text-blue-900 font-medium flex items-start gap-3">
                  <i className="ph-fill ph-info text-2xl text-blue-500 mt-0.5 shrink-0"></i>
                  <span>Sau khi chuyển khoản, bạn có thể Đăng nhập ngay vào Portal để nộp ảnh chụp Biên lai (Nếu hệ thống chưa duyệt tự động). Nhân viên NKBA sẽ đối soát nhanh nhất để ACTIVE thẻ của bạn.</span>
                </div>
                <div className="flex justify-center pt-4">
                  <a href="http://localhost:3001/login" className="inline-flex h-12 px-8 bg-[#002D62] text-white font-bold rounded-xl items-center gap-2 shadow-md hover:bg-blue-900 transition-colors">VÀO PORTAL ĐỂ NỘP BIÊN LAI <i className="ph-bold ph-arrow-right"></i></a>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}