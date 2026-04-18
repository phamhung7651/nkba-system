'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function CorporatesPage() {
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'verify' | 'approve'>('list');

  const [corporates, setCorporates] = useState<any[]>([]);
  const [domains, setDomains] = useState<any[]>([]);
  const [tiers, setTiers] = useState<any[]>([]);

  // State Form Đăng ký/Sửa
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ tax_code: '', name: '', domain_id: '', tier_id: '', expiration_date: '' });

  // ==========================================
  // STATE MỚI: DÀNH CHO MODAL PHÊ DUYỆT (SOP 3 LỚP)
  // ==========================================
  const [reviewingCorp, setReviewingCorp] = useState<any>(null);
  const [reviewMode, setReviewMode] = useState<'VERIFY' | 'APPROVE' | null>(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchData = async () => {
    setLoading(true);
    // 1. Lấy thông tin User & Role
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: emp } = await supabase.from('employees').select('id, name, role').eq('email', user.email).single();
      setCurrentUser(emp);
    }

    // 2. Fetch Data
    const [corpRes, domRes, tierRes] = await Promise.all([
      supabase.from('corporates')
        .select('*, corporate_domains(name), corporate_tiers(name, code), verifier:verified_by(name), approver:approved_by(name)')
        .order('created_at', { ascending: false }),
      supabase.from('corporate_domains').select('*').order('name', { ascending: true }),
      supabase.from('corporate_tiers').select('*')
    ]);
    
    if (corpRes.data) setCorporates(corpRes.data);
    if (domRes.data) setDomains(domRes.data);
    if (tierRes.data) setTiers(tierRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const isCEO = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'CEO';

  // Lọc dữ liệu theo Tab
  const activeCorps = corporates.filter(c => c.status === 'ACTIVE');
  const verifyCorps = corporates.filter(c => ['PENDING_VERIFICATION', 'REJECTED'].includes(c.status)); // NV sẽ thấy cả hồ sơ mới và hồ sơ bị TGĐ trả về
  const approveCorps = corporates.filter(c => ['PENDING_APPROVAL', 'PENDING_DELETION'].includes(c.status));

  // ==========================================
  // XỬ LÝ FORM THÊM / SỬA / XÓA CƠ BẢN
  // ==========================================
  const handleSaveCorp = async () => {
    if (!formData.tax_code || !formData.name || !formData.tier_id) return alert('Nhập đủ thông tin!');
    const payload = { 
      tax_code: formData.tax_code,
      name: formData.name,
      domain_id: formData.domain_id || null,
      tier_id: formData.tier_id || null,
      expiration_date: formData.expiration_date || null, // Lưu ngày hết hạn
      ...(editingId ? {} : { status: 'PENDING_VERIFICATION' }) // Ép cứng trạng thái để không bị tàng hình khi tạo mới
    };

    if (editingId) {
      await supabase.from('corporates').update(payload).eq('id', editingId);
      alert('✅ Cập nhật thành công!');
    } else {
      await supabase.from('corporates').insert([payload]);
      alert('✅ Đăng ký thành công! Hồ sơ đã đưa vào hàng đợi Xác minh.');
    }
    setShowForm(false); setEditingId(null); setFormData({ tax_code: '', name: '', domain_id: '', tier_id: '', expiration_date: '' });
    fetchData();
  };

  const handleRequestDelete = async (corp: any) => {
    const reason = window.prompt(`Lý do muốn xóa pháp nhân "${corp.name}"?`);
    if (!reason) return;
    await supabase.from('corporates').update({ 
      status: 'PENDING_DELETION', 
      rejection_reason: reason, 
      verified_by: currentUser.id 
    }).eq('id', corp.id);
    alert('🚀 Đã gửi yêu cầu XÓA lên Tổng Giám đốc.');
    fetchData();
  };

  // ==========================================
  // XỬ LÝ MODAL PHÊ DUYỆT CHI TIẾT
  // ==========================================
  const openReviewModal = (corp: any, mode: 'VERIFY' | 'APPROVE') => {
    setReviewingCorp(corp);
    setReviewMode(mode);
    setIsRejecting(false);
    setRejectReason(corp.rejection_reason || ''); // Load lại lý do từ chối cũ nếu có
    
    // Đề xuất ngày hết hạn là +1 năm từ hôm nay
    if (mode === 'VERIFY') {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setExpiryDate(corp.expiration_date || nextYear.toISOString().split('T')[0]);
    }
  };

  const closeReviewModal = () => {
    setReviewingCorp(null);
    setReviewMode(null);
  };

  const executeAction = async (action: 'SUBMIT_TO_CEO' | 'FINAL_APPROVE' | 'REJECT' | 'ARCHIVE') => {
    if (!reviewingCorp) return;

    try {
      if (action === 'REJECT') {
        if (!rejectReason.trim()) return alert('Vui lòng nhập lý do từ chối (Bút phê)!');
        await supabase.from('corporates').update({ 
          status: 'REJECTED', 
          rejection_reason: rejectReason,
          verified_by: reviewMode === 'APPROVE' ? null : currentUser.id // Nếu CEO reject, xóa verified_by để NV làm lại
        }).eq('id', reviewingCorp.id);
        alert('❌ Đã trả hồ sơ kèm bút phê!');
      } 
      
      else if (action === 'SUBMIT_TO_CEO') {
        if (!expiryDate) return alert('Vui lòng thiết lập Hạn sử dụng!');
        await supabase.from('corporates').update({ 
          status: 'PENDING_APPROVAL', 
          expiration_date: expiryDate,
          verified_by: currentUser.id,
          verified_at: new Date().toISOString(),
          rejection_reason: null // Clear lỗi
        }).eq('id', reviewingCorp.id);
        alert('✅ Xác minh thành công. Đã trình TGĐ!');
      }

      else if (action === 'FINAL_APPROVE') {
        await supabase.from('corporates').update({ 
          status: 'ACTIVE', 
          approved_by: currentUser.id,
          join_date: new Date().toISOString(),
          rejection_reason: null
        }).eq('id', reviewingCorp.id);
        alert('🎉 KÝ DUYỆT THÀNH CÔNG! Doanh nghiệp chính thức hoạt động.');
      }

      else if (action === 'ARCHIVE') {
        await supabase.from('corporates').update({ 
          status: 'ARCHIVED', 
          approved_by: currentUser.id 
        }).eq('id', reviewingCorp.id);
        alert('🗑️ ĐÃ DUYỆT XÓA: Hồ sơ đã được lưu trữ.');
      }

      closeReviewModal();
      fetchData();
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse font-bold text-slate-400">ĐANG NẠP HỆ THỐNG...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      
      {/* HEADER & TABS NAVIGATION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase">Quản lý Pháp nhân</h2>
            <p className="text-sm text-slate-500 font-medium">Quy trình cấp phép và quản lý hồ sơ Doanh nghiệp</p>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="px-6 py-2.5 bg-[#002D62] text-white font-bold rounded-xl hover:bg-blue-900 shadow-sm">
              + ĐĂNG KÝ MỚI
            </button>
          )}
        </div>

        <div className="flex gap-2 mt-6 border-b border-slate-100 pb-2 overflow-x-auto">
          <button onClick={() => setActiveTab('list')} className={`shrink-0 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'list' ? 'bg-slate-100 text-[#002D62]' : 'text-slate-500 hover:bg-slate-50'}`}>Danh sách Chính thức</button>
          <button onClick={() => setActiveTab('verify')} className={`shrink-0 px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'verify' ? 'bg-amber-50 text-amber-700' : 'text-slate-500 hover:bg-slate-50'}`}>Trạm Xác minh NV <span className="bg-amber-500 text-white px-1.5 py-0.5 rounded text-[10px]">{verifyCorps.length}</span></button>
          {isCEO && (
            <button onClick={() => setActiveTab('approve')} className={`shrink-0 px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'approve' ? 'bg-rose-50 text-rose-700' : 'text-slate-500 hover:bg-slate-50'}`}>Bàn làm việc TGĐ <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded text-[10px]">{approveCorps.length}</span></button>
          )}
        </div>
      </div>

      {/* FORM THÊM/SỬA */}
      {showForm && (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <i className={`ph-bold ${editingId ? 'ph-pencil-simple text-amber-600' : 'ph-plus-circle text-[#002D62]'} text-xl`}></i>
            {editingId ? 'Cập nhật Hồ sơ' : 'Đăng ký Pháp nhân mới'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end">
            <div><label className="text-[10px] font-black text-slate-400 uppercase">MST (*)</label><input type="text" value={formData.tax_code} onChange={e => setFormData({...formData, tax_code: e.target.value})} className="w-full h-11 border border-slate-200 rounded-xl px-3 mt-1 focus:border-blue-400 outline-none transition-colors" /></div>
            <div><label className="text-[10px] font-black text-slate-400 uppercase">Tên Doanh nghiệp (*)</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-11 border border-slate-200 rounded-xl px-3 mt-1 focus:border-blue-400 outline-none transition-colors font-bold text-slate-800" /></div>
            <div><label className="text-[10px] font-black text-slate-400 uppercase">Lĩnh vực</label><select value={formData.domain_id} onChange={e => setFormData({...formData, domain_id: e.target.value})} className="w-full h-11 border border-slate-200 rounded-xl px-3 mt-1 focus:border-blue-400 outline-none transition-colors bg-white"><option value="">-- Chọn --</option>{domains.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
            <div><label className="text-[10px] font-black text-slate-400 uppercase">Gói Cước (*)</label><select value={formData.tier_id} onChange={e => setFormData({...formData, tier_id: e.target.value})} className="w-full h-11 border border-slate-200 rounded-xl px-3 mt-1 focus:border-blue-400 outline-none transition-colors bg-white"><option value="">-- Chọn --</option>{tiers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
            
            {/* THÊM TRƯỜNG NGÀY HẾT HẠN CHO PHÉP ADMIN CẬP NHẬT KHI GIA HẠN THẺ */}
            <div><label className="text-[10px] font-black text-slate-400 uppercase">Ngày hết hạn</label><input type="date" value={formData.expiration_date} onChange={e => setFormData({...formData, expiration_date: e.target.value})} className="w-full h-11 border border-slate-200 rounded-xl px-3 mt-1 focus:border-blue-400 outline-none transition-colors bg-white font-bold text-slate-700" /></div>

            <div className="flex gap-2">
              <button onClick={() => {setShowForm(false); setEditingId(null)}} className="px-4 h-11 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">HỦY</button>
              <button onClick={handleSaveCorp} className="flex-1 h-11 bg-[#002D62] text-white font-bold rounded-xl shadow-md hover:bg-blue-900 transition-colors">LƯU</button>
            </div>
          </div>
        </div>
      )}

      {/* DANH SÁCH BẢNG (Đã fix lỗi đường kẻ đứt nét) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <tr><th className="p-4 pl-6">Doanh nghiệp</th><th className="p-4">Trạng thái</th><th className="p-4">Ngày tham gia</th><th className="p-4 text-right pr-6">Thao tác</th></tr>
            </thead>
            {/* Đã xóa class divide-y ở thẻ tbody để đường kẻ mượt mà */}
            <tbody>
              {(activeTab === 'list' ? activeCorps : activeTab === 'verify' ? verifyCorps : approveCorps).map(corp => (
                <tr key={corp.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-slate-900 text-base">{corp.name}</div>
                    <div className="text-xs text-slate-500 mt-1 font-mono">MST: {corp.tax_code} | Gói: <span className="font-bold text-blue-600">{corp.corporate_tiers?.name}</span></div>
                    {corp.status === 'REJECTED' && <div className="text-xs text-rose-700 font-medium mt-2 bg-rose-50 p-2.5 rounded-lg border border-rose-100"><i className="ph-fill ph-warning-circle text-rose-500"></i> Bút phê: "{corp.rejection_reason}"</div>}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${corp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : corp.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : corp.status === 'PENDING_DELETION' ? 'bg-slate-800 text-white' : 'bg-amber-100 text-amber-700'}`}>
                      {corp.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-600">{corp.join_date ? new Date(corp.join_date).toLocaleDateString('vi-VN') : '---'}</td>
                  <td className="p-4 text-right space-x-2 pr-6">
                    {activeTab === 'list' && (
                      <>
                        <button onClick={() => {setEditingId(corp.id); setFormData({tax_code: corp.tax_code, name: corp.name, domain_id: corp.domain_id || '', tier_id: corp.tier_id, expiration_date: corp.expiration_date ? corp.expiration_date.split('T')[0] : ''}); setShowForm(true);}} className="px-3 py-1.5 bg-slate-100 text-blue-600 font-bold text-xs rounded-lg hover:bg-blue-50 transition-colors">Sửa</button>
                        <button onClick={() => handleRequestDelete(corp)} className="px-3 py-1.5 bg-slate-100 text-rose-600 font-bold text-xs rounded-lg hover:bg-rose-50 transition-colors">Xin Xóa</button>
                      </>
                    )}
                    {activeTab === 'verify' && <button onClick={() => openReviewModal(corp, 'VERIFY')} className="px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-lg hover:bg-amber-600 shadow-sm transition-transform hover:-translate-y-0.5">XEM & XÁC MINH</button>}
                    {activeTab === 'approve' && <button onClick={() => openReviewModal(corp, 'APPROVE')} className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-lg hover:bg-rose-700 shadow-sm transition-transform hover:-translate-y-0.5">XEM & KÝ DUYỆT</button>}
                  </td>
                </tr>
              ))}
              {(activeTab === 'list' ? activeCorps : activeTab === 'verify' ? verifyCorps : approveCorps).length === 0 && (
                <tr><td colSpan={4} className="p-10 text-center text-slate-400 font-medium">Không có dữ liệu trong danh sách này.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL REVIEW HỒ SƠ & RA QUYẾT ĐỊNH (SOP) */}
      {/* ========================================== */}
      {reviewingCorp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            <div className={`p-6 flex justify-between items-center text-white ${reviewMode === 'VERIFY' ? 'bg-amber-500' : 'bg-[#002D62]'}`}>
              <h3 className="font-black text-lg tracking-wide flex items-center gap-2">
                <i className={`ph-bold ${reviewMode === 'VERIFY' ? 'ph-magnifying-glass' : 'ph-check-circle'} text-2xl`}></i>
                {reviewMode === 'VERIFY' ? 'NHÂN VIÊN RÀ SOÁT HỒ SƠ' : 'TỔNG GIÁM ĐỐC KÝ DUYỆT'}
              </h3>
              <button onClick={closeReviewModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors"><i className="ph-bold ph-x text-lg"></i></button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-6">
              {/* Thông tin cốt lõi */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="col-span-2"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tên Doanh nghiệp</p><p className="font-black text-slate-800 text-lg">{reviewingCorp.name}</p></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mã số thuế</p><p className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-fit border border-blue-100">{reviewingCorp.tax_code}</p></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gói đăng ký</p><p className="font-bold text-amber-600">{reviewingCorp.corporate_tiers?.name}</p></div>
                <div className="col-span-2"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lĩnh vực hoạt động</p><p className="font-medium text-slate-700">{reviewingCorp.corporate_domains?.name}</p></div>
              </div>

              {/* Dành riêng cho TGĐ xem: Ai là người duyệt */}
              {reviewMode === 'APPROVE' && (
                <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black"><i className="ph-fill ph-user-check text-xl"></i></div>
                    <div>
                      <p className="text-xs font-bold text-blue-900">NV Xác minh: {reviewingCorp.verifier?.name}</p>
                      <p className="text-[10px] font-medium text-blue-600 mt-0.5">Vào lúc: {new Date(reviewingCorp.verified_at).toLocaleString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Thời hạn cấp</p>
                    <p className="font-black text-slate-800 text-lg bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">{new Date(reviewingCorp.expiration_date).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              )}

              {/* Dành cho NV: Thiết lập hạn mức */}
              {reviewMode === 'VERIFY' && !isRejecting && (
                <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100">
                  <label className="text-xs font-bold text-slate-800 block mb-2 uppercase tracking-widest flex items-center gap-2"><i className="ph-fill ph-calendar-blank text-amber-500 text-lg"></i> Đề xuất Ngày hết hạn thẻ</label>
                  <p className="text-[10px] text-slate-500 mb-3 font-medium">Hệ thống mặc định đề xuất cộng thêm 1 năm kể từ ngày xác minh. Nhân viên có thể điều chỉnh nếu cần.</p>
                  <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="w-full h-12 border-2 border-amber-200 rounded-xl px-4 font-bold text-amber-900 outline-none focus:border-amber-500 bg-white shadow-inner" />
                </div>
              )}

              {/* Khung gõ Comment từ chối */}
              {isRejecting && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="text-xs font-black text-rose-600 uppercase tracking-widest mb-2 flex items-center gap-2"><i className="ph-fill ph-warning-circle text-lg"></i> Ghi chú lý do trả hồ sơ (Bút phê)</label>
                  <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Nhập lý do sai sót (VD: Sai MST, Không khớp tên công ty...) để người trước biết đường sửa." className="w-full h-28 border-2 border-rose-200 rounded-xl p-4 text-sm font-medium outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 bg-rose-50 placeholder:text-rose-300 text-rose-900" />
                </div>
              )}
            </div>

            {/* Vùng Nút Bấm */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-3">
              {isRejecting ? (
                <>
                  <button onClick={() => setIsRejecting(false)} className="px-6 h-12 bg-white border border-slate-300 font-bold text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">HỦY BỎ</button>
                  <button onClick={() => executeAction('REJECT')} className="px-6 h-12 bg-rose-600 text-white font-black rounded-xl shadow-md hover:bg-rose-700 transition-colors">XÁC NHẬN TRẢ HỒ SƠ</button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsRejecting(true)} className="px-6 h-12 bg-white border-2 border-rose-100 text-rose-600 font-bold rounded-xl hover:bg-rose-50 transition-colors">TỪ CHỐI (GHI BÚT PHÊ)</button>
                  
                  {reviewMode === 'VERIFY' ? (
                    <button onClick={() => executeAction('SUBMIT_TO_CEO')} className="px-8 h-12 bg-amber-500 text-[#002D62] font-black rounded-xl shadow-md shadow-amber-500/20 hover:bg-amber-400 hover:-translate-y-0.5 transition-all">TRÌNH TỔNG GIÁM ĐỐC</button>
                  ) : reviewingCorp.status === 'PENDING_DELETION' ? (
                    <button onClick={() => executeAction('ARCHIVE')} className="px-8 h-12 bg-slate-800 text-white font-black rounded-xl shadow-md hover:bg-black hover:-translate-y-0.5 transition-all">ĐỒNG Ý XÓA (LƯU TRỮ)</button>
                  ) : (
                    <button onClick={() => executeAction('FINAL_APPROVE')} className="px-8 h-12 bg-[#002D62] text-white font-black rounded-xl shadow-md shadow-[#002D62]/20 hover:bg-blue-900 hover:-translate-y-0.5 transition-all">KÝ DUYỆT (ACTIVE)</button>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}