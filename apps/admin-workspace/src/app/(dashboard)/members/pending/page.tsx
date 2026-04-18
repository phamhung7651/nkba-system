'use client';

import { useEffect, useState } from 'react';
import { supabase } from 'supabase/client';
import Link from 'next/link';

export default function KYCApprovalPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [pendingMembers, setPendingMembers] = useState<any[]>([]);

  // Lấy danh sách Hội viên đang CHỜ DUYỆT (PENDING)
  const fetchPendingKYC = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false });
      
    if (!error && data) setPendingMembers(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchPendingKYC(); }, []);

  // Hàm xử lý Duyệt (Chuyển thành ACTIVE)
  const handleApprove = async (id: string, companyName: string) => {
    if (!confirm(`Xác nhận duyệt hồ sơ cho doanh nghiệp: ${companyName}?`)) return;
    
    setProcessingId(id);
    const { error } = await supabase.from('members').update({ status: 'ACTIVE' }).eq('id', id);
    
    if (error) alert('Lỗi khi duyệt: ' + error.message);
    else fetchPendingKYC(); // Load lại danh sách, người này sẽ biến mất khỏi hàng đợi
    
    setProcessingId(null);
  };

  // Hàm xử lý Từ chối (Chuyển thành SUSPENDED / Bị khóa)
  const handleReject = async (id: string, companyName: string) => {
    const reason = prompt(`Nhập lý do TỪ CHỐI doanh nghiệp ${companyName} (Sẽ gửi email thông báo):`);
    if (reason === null) return; // Nhấn Cancel
    
    setProcessingId(id);
    // Trong thực tế sẽ lưu reason vào một bảng log, ở đây ta đổi status thành SUSPENDED
    const { error } = await supabase.from('members').update({ status: 'SUSPENDED' }).eq('id', id);
    
    if (error) alert('Lỗi khi từ chối: ' + error.message);
    else fetchPendingKYC();
    
    setProcessingId(null);
  };

  if (isLoading) return <div className="p-20 text-center text-sm font-semibold text-slate-400 animate-pulse tracking-widest uppercase">Đang tải danh sách chờ duyệt...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      
      {/* 1. HEADER: KHU VỰC CẢNH BÁO */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-8 md:p-10 rounded-[2rem] shadow-xl shadow-amber-500/20 text-slate-900 relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-6">
         {/* Hiệu ứng background */}
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-10 rounded-full blur-[80px] transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 p-6 opacity-[0.05] pointer-events-none transform -translate-x-1/4 translate-y-1/4">
            <svg width="200" height="200" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"></path><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z" fill="white"></path></svg>
         </div>
         
         <div className="relative z-10">
            <p className="text-[#002D62] font-black text-xs uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              TRUNG TÂM KIỂM DUYỆT (KYC)
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight drop-shadow-sm leading-tight text-white">
              Hồ sơ chờ duyệt
            </h2>
         </div>

         <div className="relative z-10 flex items-center gap-4 bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30">
            <div className="text-center">
               <p className="text-4xl font-black text-white">{pendingMembers.length}</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-[#002D62] mt-1">Yêu cầu</p>
            </div>
         </div>
      </div>

      {/* 2. KHU VỰC DANH SÁCH (GRID CARDS) */}
      {pendingMembers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
             <svg width="48" height="48" fill="currentColor" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Tuyệt vời! Hàng đợi đã trống.</h3>
          <p className="text-sm font-medium text-slate-500 max-w-sm">Tất cả hồ sơ đăng ký tham gia hệ sinh thái NKBA đều đã được xử lý xong.</p>
          <Link href="/members" className="mt-8 h-12 px-6 bg-slate-100 text-[#002D62] font-bold rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors">
             Quay lại Quản lý Hội viên
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingMembers.map(member => (
            <div key={member.id} className="bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group">
              
              {/* Card Header */}
              <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start gap-4 relative">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black text-xl shadow-inner border border-amber-200">
                    {member.company_name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-amber-100 text-amber-700 tracking-wider uppercase">NEW REQUEST</span>
                    <h3 className="text-lg md:text-xl font-black text-slate-900 mt-2 leading-tight">{member.company_name}</h3>
                  </div>
                </div>
              </div>

              {/* Card Body (Chi tiết KYC) */}
              <div className="p-6 md:p-8 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Mã số thuế</p>
                  <p className="text-sm font-black text-[#002D62] font-mono bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 w-fit">
                    {member.tax_code || 'Chưa cung cấp'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Người đại diện (PL)</p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <svg width="16" height="16" fill="currentColor" className="text-slate-400" viewBox="0 0 256 256"><path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path></svg>
                    {member.representative}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Điện thoại</p>
                  <p className="text-sm font-bold text-slate-800">{member.phone || '---'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                  <p className="text-sm font-bold text-slate-800 truncate" title={member.email}>{member.email || '---'}</p>
                </div>
                
                {/* Giả lập File đính kèm */}
                <div className="sm:col-span-2 mt-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hồ sơ đính kèm (Giả lập)</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-700 cursor-pointer transition-colors">
                      <i className="ph ph-file-pdf text-rose-500 text-lg"></i> Giay_Phep_Kinh_Doanh.pdf
                    </div>
                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-700 cursor-pointer transition-colors">
                      <i className="ph ph-image text-blue-500 text-lg"></i> CCCD_Nguoi_Dai_Dien.jpg
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer (Actions) */}
              <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => handleReject(member.id, member.company_name)}
                  disabled={processingId === member.id}
                  className="flex-1 h-12 bg-white text-rose-600 border border-rose-200 rounded-xl text-sm font-black hover:bg-rose-50 hover:border-rose-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <i className="ph ph-x-circle text-lg"></i> TỪ CHỐI
                </button>
                <button 
                  onClick={() => handleApprove(member.id, member.company_name)}
                  disabled={processingId === member.id}
                  className="flex-[2] h-12 bg-emerald-500 text-white rounded-xl text-sm font-black shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                >
                  <i className="ph ph-check-circle text-lg"></i> DUYỆT HỒ SƠ
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}