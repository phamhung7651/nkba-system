'use client';

import { useEffect, useState } from 'react';
import { supabase } from 'supabase/client';

export default function InsightsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reports' | 'requests'>('reports');
  
  // States cho Báo cáo (Reports)
  const [reports, setReports] = useState<any[]>([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [isSavingReport, setIsSavingReport] = useState(false);
  const [reportForm, setReportForm] = useState({ title: '', description: '', category: 'MARKET_RESEARCH', access_tier: 'STANDARD', file_url: '' });

  // States cho Yêu cầu (Requests)
  const [requests, setRequests] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isSavingReq, setIsSavingReq] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const [repRes, reqRes, memRes] = await Promise.all([
      supabase.from('reports').select('*').order('created_at', { ascending: false }),
      supabase.from('data_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('members').select('id, company_name, tier')
    ]);
    
    if (repRes.data) setReports(repRes.data);
    if (reqRes.data) setRequests(reqRes.data);
    if (memRes.data) setMembers(memRes.data);
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // --- LOGIC XỬ LÝ BÁO CÁO (REPORTS) ---
  const handleSaveReport = async () => {
    if (!reportForm.title) return alert('Vui lòng nhập tên báo cáo!');
    setIsSavingReport(true);
    
    const { error } = await supabase.from('reports').insert([reportForm]);
    if (error) alert('Lỗi: ' + error.message);
    else {
      setShowReportForm(false);
      setReportForm({ title: '', description: '', category: 'MARKET_RESEARCH', access_tier: 'STANDARD', file_url: '' });
      fetchData();
    }
    setIsSavingReport(false);
  };

  // --- LOGIC XỬ LÝ YÊU CẦU TỪ VIP (REQUESTS) ---
  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;
    setIsSavingReq(true);
    
    const { error } = await supabase.from('data_requests').update({
      status: selectedRequest.status,
      result_file_url: selectedRequest.result_file_url,
      admin_note: selectedRequest.admin_note,
      updated_at: new Date().toISOString()
    }).eq('id', selectedRequest.id);

    if (error) alert('Lỗi cập nhật: ' + error.message);
    else fetchData();
    setIsSavingReq(false);
  };

  // Helpers
  const getTierBadge = (tier: string) => {
    switch(tier) {
      case 'PUBLIC': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'VIP': return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md border-transparent';
      case 'PREMIUM': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getReqStatusConfig = (status: string) => {
    switch(status) {
      case 'COMPLETED': return { color: 'text-emerald-700', bg: 'bg-emerald-100', label: 'ĐÃ TRẢ KẾT QUẢ' };
      case 'PROCESSING': return { color: 'text-blue-700', bg: 'bg-blue-100', label: 'ĐANG XỬ LÝ' };
      case 'REJECTED': return { color: 'text-rose-700', bg: 'bg-rose-100', label: 'TỪ CHỐI' };
      default: return { color: 'text-amber-700', bg: 'bg-amber-100', label: 'CHỜ TIẾP NHẬN' };
    }
  };

  const getMemberInfo = (id: string) => members.find(m => m.id === id) || { company_name: 'Ẩn danh', tier: 'STANDARD' };

  if (isLoading) return <div className="p-20 text-center text-sm font-semibold text-slate-400 animate-pulse tracking-widest uppercase">Đang đồng bộ trung tâm dữ liệu...</div>;

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-20 relative h-[calc(100vh-100px)] flex flex-col">
      
      {/* HEADER & TABS */}
      <div className="shrink-0 bg-white p-6 md:px-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-6">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-inner">
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 256 256"><path d="M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H40a8,8,0,0,0-8,8v64H24a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h48V200H160ZM104,96h40V200H104ZM48,144H88v56H48Z"></path></svg>
            </div>
            <div>
              <p className="text-teal-600 font-bold text-xs uppercase tracking-[0.2em] mb-1">QUYỀN LỰC DỮ LIỆU</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">Insights & Báo cáo</h2>
            </div>
         </div>
         
         <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button onClick={() => setActiveTab('reports')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'reports' ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
              <i className="ph ph-books mr-1"></i> Kho Phát Hành ({reports.length})
            </button>
            <button onClick={() => setActiveTab('requests')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'requests' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
              <i className="ph ph-ticket mr-1"></i> Yêu Cầu Dữ Liệu
              {pendingCount > 0 && <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-md">{pendingCount}</span>}
            </button>
         </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        
        {/* ========================================================= */}
        {/* TAB 1: KHO BÁO CÁO (PUBLISHING DESK) */}
        {/* ========================================================= */}
        {activeTab === 'reports' && (
          <div className="flex-1 overflow-y-auto scroll-smooth flex flex-col gap-6">
            
            {/* Thanh công cụ báo cáo */}
            <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-2xl shrink-0">
              <p className="text-sm font-bold text-slate-500">Nơi đăng tải và phân phối dữ liệu đa kênh.</p>
              <button onClick={() => setShowReportForm(!showReportForm)} className="h-10 px-5 bg-[#002D62] text-white rounded-xl text-sm font-black shadow-md hover:bg-blue-900 transition-colors flex items-center gap-2">
                <i className={`ph ${showReportForm ? 'ph-x' : 'ph-plus'} text-lg`}></i> {showReportForm ? 'ĐÓNG FORM' : 'TẠO BÁO CÁO MỚI'}
              </button>
            </div>

            {/* Form tạo mới Báo cáo */}
            {showReportForm && (
              <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm shrink-0 animate-in slide-in-from-top-4">
                <h3 className="text-lg font-black text-slate-900 mb-6 border-b border-slate-100 pb-4">Đăng tải Báo cáo / Dữ liệu mới</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="col-span-2 space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tên báo cáo (*)</label><input type="text" value={reportForm.title} onChange={e => setReportForm({...reportForm, title: e.target.value})} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10" placeholder="VD: Báo cáo thị trường Vật Liệu XD Q1/2026..." /></div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phân loại</label>
                    <select value={reportForm.category} onChange={e => setReportForm({...reportForm, category: e.target.value})} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none cursor-pointer"><option value="MARKET_RESEARCH">Nghiên cứu thị trường</option><option value="PRICE_INDEX">Đơn giá Vật tư / Nhân công</option><option value="MACRO">Báo cáo Vĩ mô</option></select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-1"><i className="ph ph-lock-key"></i> Quyền truy cập</label>
                    <select value={reportForm.access_tier} onChange={e => setReportForm({...reportForm, access_tier: e.target.value})} className="w-full h-11 px-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-sm font-black outline-none cursor-pointer"><option value="PUBLIC">PUBLIC (Đại chúng / Mồi SEO)</option><option value="STANDARD">STANDARD (Mọi hội viên)</option><option value="PREMIUM">PREMIUM (Trả phí)</option><option value="VIP">VIP (Bảo mật cao)</option></select>
                  </div>
                  <div className="col-span-2 space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tóm tắt (Teaser cho người không có quyền)</label><textarea value={reportForm.description} onChange={e => setReportForm({...reportForm, description: e.target.value})} className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none resize-none" placeholder="Nhập đoạn tóm tắt hấp dẫn để câu khách..." /></div>
                  <div className="col-span-2 space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1"><i className="ph ph-link text-blue-500"></i> Link File (PDF/Excel)</label><input type="text" value={reportForm.file_url} onChange={e => setReportForm({...reportForm, file_url: e.target.value})} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-400 text-blue-600" placeholder="https://drive.google.com/..." /></div>
                </div>
                <div className="flex justify-end"><button onClick={handleSaveReport} disabled={isSavingReport} className="h-11 px-8 bg-teal-600 text-white rounded-xl text-sm font-black shadow-lg shadow-teal-500/30 hover:bg-teal-500 transition-colors">{isSavingReport ? 'ĐANG PHÁT HÀNH...' : 'PHÁT HÀNH BÁO CÁO'}</button></div>
              </div>
            )}

            {/* Lưới hiển thị Báo cáo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
              {reports.length === 0 ? <div className="col-span-full p-10 text-center text-slate-400 italic">Kho báo cáo trống. Hãy phát hành bản tin đầu tiên!</div> : 
                reports.map(report => (
                  <div key={report.id} className="bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden hover:shadow-lg hover:border-teal-300 transition-all group">
                    <div className="h-32 bg-slate-100 flex items-center justify-center border-b border-slate-100 relative">
                       <i className="ph ph-chart-line-up text-5xl text-slate-300 group-hover:scale-110 transition-transform"></i>
                       <div className="absolute top-3 right-3">
                         <span className={`text-[9px] font-black px-2.5 py-1 rounded border uppercase tracking-widest ${getTierBadge(report.access_tier)}`}>{report.access_tier} {report.access_tier==='VIP' && '👑'}</span>
                       </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{report.category}</p>
                      <h4 className="text-base font-black text-slate-900 leading-snug line-clamp-2" title={report.title}>{report.title}</h4>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{report.description || 'Không có tóm tắt'}</p>
                      
                      <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1"><i className="ph ph-download-simple"></i> {report.downloads} lượt tải</span>
                        <span className="text-blue-500 hover:underline cursor-pointer">Sửa</span>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: TRẠM XỬ LÝ YÊU CẦU DATA (TICKETING DESK) */}
        {/* ========================================================= */}
        {activeTab === 'requests' && (
          <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
            
            {/* CỘT TRÁI: DANH SÁCH YÊU CẦU (MASTER) */}
            <div className="w-full lg:w-1/3 bg-white border border-slate-200 shadow-sm rounded-[2rem] flex flex-col overflow-hidden shrink-0">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-black text-slate-800 flex items-center gap-2"><i className="ph ph-ticket text-blue-500"></i> Hộp thư Đặt hàng ({requests.length})</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Click vào một ticket để xử lý trả data.</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 scroll-smooth">
                {requests.length === 0 ? <div className="p-8 text-center text-sm text-slate-400 italic">Tuyệt vời, không có yêu cầu nào đang chờ!</div> : 
                  requests.map(req => {
                    const memInfo = getMemberInfo(req.member_id);
                    const isSelected = selectedRequest?.id === req.id;
                    const conf = getReqStatusConfig(req.status);
                    
                    return (
                      <div key={req.id} onClick={() => setSelectedRequest(req)} className={`p-4 rounded-2xl border cursor-pointer transition-all ${isSelected ? 'bg-[#002D62] border-[#002D62] shadow-md transform scale-[1.02]' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h4 className={`text-sm font-bold line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-800'}`}>{req.title}</h4>
                          <span className={`shrink-0 text-[9px] font-black px-2 py-0.5 rounded tracking-widest ${isSelected ? 'bg-white/20 text-white' : `${conf.bg} ${conf.color}`}`}>{conf.label}</span>
                        </div>
                        <p className={`text-[11px] font-medium flex items-center gap-1 ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                          <i className="ph ph-buildings"></i> {memInfo.company_name} {memInfo.tier === 'VIP' && '👑'}
                        </p>
                      </div>
                    )
                  })
                }
              </div>
            </div>

            {/* CỘT PHẢI: KHUNG XỬ LÝ (DETAIL) */}
            <div className="w-full lg:w-2/3 bg-white border border-slate-200 shadow-sm rounded-[2rem] flex flex-col relative overflow-hidden">
              {!selectedRequest ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center"><i className="ph ph-hand-pointing text-6xl mb-4 opacity-20"></i><p className="font-medium">Chọn một yêu cầu bên trái để xem nội dung và trả kết quả.</p></div>
              ) : (
                <>
                  <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start gap-4">
                    <div>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider uppercase ${getReqStatusConfig(selectedRequest.status).bg} ${getReqStatusConfig(selectedRequest.status).color}`}>
                        {getReqStatusConfig(selectedRequest.status).label}
                      </span>
                      <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-3 leading-snug">{selectedRequest.title}</h2>
                      <p className="text-sm font-bold text-slate-600 mt-1 flex items-center gap-2"><i className="ph ph-buildings text-amber-500"></i> Từ: {getMemberInfo(selectedRequest.member_id).company_name} ({getMemberInfo(selectedRequest.member_id).tier})</p>
                    </div>
                    <button onClick={handleUpdateRequest} disabled={isSavingReq} className="shrink-0 h-11 px-6 bg-amber-500 hover:bg-amber-400 text-[#002D62] rounded-xl text-sm font-black shadow-lg shadow-amber-500/20 transition-all disabled:opacity-70">
                      {isSavingReq ? 'ĐANG LƯU...' : 'LƯU XỬ LÝ'}
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth flex flex-col gap-8">
                    {/* Khu vực Nội dung KH yêu cầu */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><i className="ph ph-chat-text text-lg"></i> Nội dung yêu cầu</h3>
                      <div className="bg-amber-50 border border-amber-100 text-amber-900 p-5 rounded-2xl text-sm font-medium whitespace-pre-line leading-relaxed shadow-inner">
                        {selectedRequest.content}
                      </div>
                    </div>

                    {/* Khu vực Admin Xử lý & Trả file */}
                    <div className="border-t border-slate-200 pt-8 space-y-6">
                      <h3 className="text-sm font-black text-[#002D62] uppercase tracking-widest flex items-center gap-2"><i className="ph ph-wrench text-xl"></i> Khu vực Trả Kết Quả</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trạng thái xử lý</label>
                          <select value={selectedRequest.status} onChange={e => setSelectedRequest({...selectedRequest, status: e.target.value})} className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-400 cursor-pointer">
                            <option value="PENDING">Chờ tiếp nhận</option>
                            <option value="PROCESSING">Đang xử lý thu thập</option>
                            <option value="COMPLETED">Đã trả kết quả (Hoàn thành)</option>
                            <option value="REJECTED">Từ chối (Ngoài phạm vi)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest text-emerald-600 flex items-center gap-1"><i className="ph ph-link"></i> Link File Kết Quả Trả Khách</label>
                          <input type="text" value={selectedRequest.result_file_url || ''} onChange={e => setSelectedRequest({...selectedRequest, result_file_url: e.target.value})} className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-blue-600 outline-none focus:border-emerald-400 placeholder:text-slate-300" placeholder="Dán link Drive/File data tại đây..." />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lời nhắn gửi kèm (Admin Note)</label>
                        <textarea value={selectedRequest.admin_note || ''} onChange={e => setSelectedRequest({...selectedRequest, admin_note: e.target.value})} className="w-full h-24 p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-blue-400 resize-none" placeholder="VD: Gửi anh chị báo giá chi tiết như yêu cầu. Cần thêm gì cứ nhắn em nhé..." />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}