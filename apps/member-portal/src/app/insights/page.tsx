'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function MemberInsightsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'library' | 'requests'>('library');
  
  // States
  const [reports, setReports] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reqForm, setReqForm] = useState({ title: '', content: '' });

  useEffect(() => {
    const fetchUserAndData = async () => {
      // 1. Giả lập lấy User hiện tại
      const { data: user } = await supabase.from('members').select('*').eq('status', 'ACTIVE').limit(1).single();
      if (user) {
        setCurrentUser(user);
        
        // 2. Tải toàn bộ Báo cáo đang Active
        const { data: reps } = await supabase.from('reports').select('*').eq('is_active', true).order('created_at', { ascending: false });
        if (reps) setReports(reps);

        // 3. Tải các Yêu cầu dữ liệu CỦA RIÊNG USER NÀY
        const { data: reqs } = await supabase.from('data_requests').select('*').eq('member_id', user.id).order('created_at', { ascending: false });
        if (reqs) setMyRequests(reqs);
      }
    };
    fetchUserAndData();
  }, []);

  const handleSubmitRequest = async () => {
    if (!reqForm.title || !reqForm.content) return alert('Vui lòng nhập đủ thông tin yêu cầu!');
    setIsSubmitting(true);
    
    const payload = {
      member_id: currentUser.id,
      title: reqForm.title,
      content: reqForm.content,
      status: 'PENDING'
    };

    const { error } = await supabase.from('data_requests').insert([payload]);
    if (error) alert('Lỗi: ' + error.message);
    else {
      alert('✅ Yêu cầu đã được gửi đến Ban quản trị NKBA!');
      setShowForm(false);
      setReqForm({ title: '', content: '' });
      // Reload lại danh sách requests
      const { data } = await supabase.from('data_requests').select('*').eq('member_id', currentUser.id).order('created_at', { ascending: false });
      if (data) setMyRequests(data);
    }
    setIsSubmitting(false);
  };

  // Logic kiểm tra Quyền xem (Ai được xem báo cáo nào)
  const canAccess = (reportTier: string, userTier: string) => {
    const tiers = { 'PUBLIC': 1, 'STANDARD': 2, 'PREMIUM': 3, 'VIP': 4 };
    const repLvl = tiers[reportTier as keyof typeof tiers] || 1;
    const usrLvl = tiers[userTier as keyof typeof tiers] || 2;
    return usrLvl >= repLvl;
  };

  if (!currentUser) return <div className="p-20 text-center text-slate-400 font-bold animate-pulse">Đang tải Trung tâm Dữ liệu...</div>;

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Insights & Dữ Liệu</h1>
          <p className="text-sm font-medium text-slate-500 mt-2">Đặc quyền thông tin chiến lược dành riêng cho Hội viên NKBA.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button onClick={() => setActiveTab('library')} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'library' ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'}`}>Thư viện Báo cáo</button>
          <button onClick={() => setActiveTab('requests')} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'requests' ? 'bg-[#002D62] text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Đặt hàng Dữ liệu</button>
        </div>
      </div>

      {/* THƯ VIỆN BÁO CÁO */}
      {activeTab === 'library' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
          {reports.length === 0 ? <div className="col-span-full p-10 text-center text-slate-400 italic">Chưa có báo cáo nào được phát hành.</div> :
            reports.map(rep => {
              const hasAccess = canAccess(rep.access_tier, currentUser.tier);
              return (
                <div key={rep.id} className="bg-white border border-slate-200 rounded-[2rem] flex flex-col overflow-hidden hover:shadow-lg transition-all group relative">
                  
                  {/* Nếu không có quyền -> Phủ lớp sương mờ (Upsell) */}
                  {!hasAccess && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-3"><i className="ph ph-lock-key text-xl"></i></div>
                      <h4 className="font-black text-slate-900 mb-1">Độc quyền {rep.access_tier}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Nâng cấp thẻ để mở khóa</p>
                    </div>
                  )}

                  <div className={`h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative ${!hasAccess ? 'grayscale opacity-50' : ''}`}>
                    <i className="ph ph-chart-polar text-6xl text-slate-300 group-hover:scale-110 transition-transform duration-500"></i>
                    <div className="absolute top-4 left-4">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest ${rep.access_tier === 'VIP' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-white text-slate-600 border-slate-200'}`}>
                        {rep.access_tier} {rep.access_tier === 'VIP' && '👑'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-2">{rep.category}</p>
                    <h4 className="text-base font-black text-slate-900 leading-snug line-clamp-2">{rep.title}</h4>
                    <p className="text-sm font-medium text-slate-500 mt-2 line-clamp-2">{rep.description}</p>
                    
                    <div className="mt-auto pt-6">
                      <button disabled={!hasAccess} className="w-full h-11 bg-slate-50 border border-slate-200 text-[#002D62] rounded-xl text-sm font-black hover:bg-slate-100 transition-colors disabled:opacity-0 flex items-center justify-center gap-2">
                        <i className="ph ph-download-simple text-lg"></i> TẢI XUỐNG
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      )}

      {/* ĐẶT HÀNG DỮ LIỆU CÁ NHÂN HÓA */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#002D62] to-blue-900 rounded-[2rem] p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
             <div className="relative z-10 max-w-2xl">
               <h3 className="text-2xl font-black mb-2">Trạm Yêu cầu Dữ liệu Riêng</h3>
               <p className="text-blue-200 font-medium leading-relaxed">Ban nghiên cứu NKBA luôn sẵn sàng đi thu thập báo giá, khảo sát thị trường hoặc tìm kiếm tệp khách hàng theo đúng yêu cầu đặc thù của riêng doanh nghiệp bạn.</p>
             </div>
             <button onClick={() => setShowForm(!showForm)} className="relative z-10 shrink-0 h-12 px-8 bg-amber-500 text-[#002D62] rounded-xl text-sm font-black shadow-lg hover:bg-amber-400 transition-colors">
               {showForm ? 'ĐÓNG FORM' : 'GỬI YÊU CẦU MỚI'}
             </button>
          </div>

          {showForm && (
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm animate-in slide-in-from-top-4">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Tiêu đề yêu cầu</label><input type="text" value={reqForm.title} onChange={e => setReqForm({...reqForm, title: e.target.value})} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-blue-400" placeholder="VD: Xin báo giá thi công Cọc khoan nhồi tại Đà Nẵng..." /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Mô tả chi tiết những gì bạn cần</label><textarea value={reqForm.content} onChange={e => setReqForm({...reqForm, content: e.target.value})} className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none resize-none focus:bg-white focus:border-blue-400" placeholder="Quy cách vật tư, địa điểm, thời gian..." /></div>
              </div>
              <div className="mt-6 flex justify-end"><button onClick={handleSubmitRequest} disabled={isSubmitting} className="h-12 px-8 bg-[#002D62] text-white rounded-xl text-sm font-black shadow-md hover:bg-blue-900 transition-colors disabled:opacity-50">{isSubmitting ? 'ĐANG GỬI...' : 'GỬI ĐẾN BAN QUẢN TRỊ'}</button></div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {myRequests.length === 0 ? <div className="col-span-full p-10 text-center text-slate-400 italic">Bạn chưa gửi yêu cầu nào.</div> :
              myRequests.map(req => (
                <div key={req.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col group hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest ${req.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : req.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                      {req.status === 'COMPLETED' ? 'ĐÃ CÓ KẾT QUẢ' : req.status === 'PROCESSING' ? 'ĐANG XỬ LÝ' : 'CHỜ TIẾP NHẬN'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{new Date(req.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <h4 className="text-base font-black text-slate-900 leading-snug mb-2">{req.title}</h4>
                  <p className="text-sm font-medium text-slate-500 mb-6 line-clamp-2">{req.content}</p>
                  
                  {/* Trả kết quả */}
                  {req.status === 'COMPLETED' && req.result_file_url ? (
                    <div className="mt-auto p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Phản hồi từ Admin:</p>
                      <p className="text-sm text-emerald-900 mb-3 font-medium">"{req.admin_note || 'Gửi anh/chị file kết quả như yêu cầu đính kèm.'}"</p>
                      <a href={req.result_file_url} target="_blank" className="inline-flex items-center gap-2 h-10 px-4 bg-white text-emerald-700 border border-emerald-200 rounded-lg text-xs font-black hover:bg-emerald-500 hover:text-white transition-colors">
                        <i className="ph ph-link text-base"></i> MỞ FILE KẾT QUẢ
                      </a>
                    </div>
                  ) : (
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-400 italic">Hệ thống sẽ cập nhật file kết quả tại đây sau khi Ban quản trị xử lý xong.</p>
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      )}

    </div>
  );
}