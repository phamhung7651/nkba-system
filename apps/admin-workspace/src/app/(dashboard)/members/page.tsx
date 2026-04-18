'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function MembersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  
  // Trạng thái Form & Bộ lọc
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    company_name: '', tax_code: '', representative: '',
    phone: '', email: '', address: '',
    tier: 'STANDARD', status: 'ACTIVE'
  });

  const fetchMembers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false });
    if (!error && data) setMembers(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleSave = async () => {
    if (!formData.company_name || !formData.representative) {
      return alert('Vui lòng nhập Tên doanh nghiệp và Người đại diện!');
    }
    setIsSaving(true);
    if (editingId) {
      const { error } = await supabase.from('members').update(formData).eq('id', editingId);
      if (error) alert('Lỗi cập nhật: ' + error.message);
      else { closeForm(); fetchMembers(); }
    } else {
      const { error } = await supabase.from('members').insert([formData]);
      if (error) alert('Lỗi thêm mới (Có thể trùng MST): ' + error.message);
      else { closeForm(); fetchMembers(); }
    }
    setIsSaving(false);
  };

  const openEdit = (m: any) => {
    setEditingId(m.id);
    setFormData({
      company_name: m.company_name, tax_code: m.tax_code || '', representative: m.representative,
      phone: m.phone || '', email: m.email || '', address: m.address || '',
      tier: m.tier, status: m.status
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ company_name: '', tax_code: '', representative: '', phone: '', email: '', address: '', tier: 'STANDARD', status: 'ACTIVE' });
  };

  // Logic Lọc (Frontend Filter cho nhanh mượt)
  const filteredMembers = members.filter(m => {
    const matchSearch = m.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (m.tax_code && m.tax_code.includes(searchTerm));
    const matchTier = filterTier ? m.tier === filterTier : true;
    const matchStatus = filterStatus ? m.status === filterStatus : true;
    return matchSearch && matchTier && matchStatus;
  });

  // Helpers Hiển thị Huy hiệu
  const getTierBadge = (tier: string) => {
    switch(tier) {
      case 'VIP': return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/20';
      case 'PREMIUM': return 'bg-purple-100 text-purple-700 border border-purple-200';
      default: return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'PENDING': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'SUSPENDED': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  if (isLoading) return <div className="p-20 text-center text-sm font-semibold text-slate-400 animate-pulse tracking-widest uppercase">Đang tải danh sách hội viên...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      
      {/* 1. HEADER & THỐNG KÊ NHANH */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-[#002D62] p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden flex flex-col justify-center">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
           <div className="relative z-10">
             <p className="text-blue-200/80 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
               <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-88a8,8,0,0,1-8,8H136v24a8,8,0,0,1-16,0V136H96a8,8,0,0,1,0-16h24V96a8,8,0,0,1,16,0v24h24A8,8,0,0,1,168,128Z"></path></svg> 
               CRM HỆ SINH THÁI
             </p>
             <h2 className="text-3xl font-black tracking-tight leading-tight">Quản lý Hội viên</h2>
           </div>
        </div>
        
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-center">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><svg width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M224,96l-32-40H64L32,96l96,128Z" opacity="0.2"></path><path d="M229.41,91.8l-32-40A8.13,8.13,0,0,0,191.25,48h-126.5A8.13,8.13,0,0,0,58.59,51.8l-32,40a8,8,0,0,0,1.15,11l96,128a8,8,0,0,0,12.6,0l96-128A8,8,0,0,0,229.41,91.8ZM196,104H144V64h38.36ZM128,64v40H60ZM65.88,120H112v82.72ZM128,214.54V120h62.12ZM51.64,64H112v40H40Zm164.36,40H144V64h60.36Z"></path></svg></div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hội viên VIP</p>
           </div>
           <p className="text-3xl font-black text-slate-800">{members.filter(m => m.tier === 'VIP').length}</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-center">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><svg width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path></svg></div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang Active</p>
           </div>
           <p className="text-3xl font-black text-slate-800">{members.filter(m => m.status === 'ACTIVE').length}</p>
        </div>
      </div>

      {/* 2. KHU VỰC FORM THÊM/SỬA (Hiển thị mượt mà khi bấm nút) */}
      {showForm && (
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2rem] shadow-inner relative overflow-hidden animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span> {editingId ? 'Cập nhật Thông tin Hội viên' : 'Đăng ký Hội viên mới'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tên Doanh nghiệp (*)</label><input type="text" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" /></div>
            <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mã số thuế</label><input type="text" value={formData.tax_code} onChange={e => setFormData({...formData, tax_code: e.target.value})} className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-400 transition-all" /></div>
            <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Người đại diện (*)</label><input type="text" value={formData.representative} onChange={e => setFormData({...formData, representative: e.target.value})} className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-400 transition-all" /></div>
            <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Điện thoại</label><input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-400 transition-all" /></div>
            <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email liên hệ</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-400 transition-all" /></div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Xếp hạng</label>
                <select value={formData.tier} onChange={e => setFormData({...formData, tier: e.target.value})} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-400 transition-all cursor-pointer">
                  <option value="STANDARD">STANDARD</option>
                  <option value="PREMIUM">PREMIUM</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trạng thái</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-400 transition-all cursor-pointer">
                  <option value="PENDING">Chờ duyệt</option>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="SUSPENDED">Đình chỉ</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3 justify-end border-t border-slate-200/60 pt-6">
            <button onClick={closeForm} className="h-11 px-6 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all">HỦY</button>
            <button onClick={handleSave} disabled={isSaving} className="h-11 px-8 bg-[#002D62] text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-900 transition-all disabled:opacity-70">
              {isSaving ? 'ĐANG LƯU...' : 'LƯU HỒ SƠ'}
            </button>
          </div>
        </div>
      )}

      {/* 3. BỘ LỌC & THANH CÔNG CỤ TÌM KIẾM */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
         <div className="flex flex-1 w-full gap-3">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><svg width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg></div>
              <input type="text" placeholder="Tìm tên doanh nghiệp, MST..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <select value={filterTier} onChange={e => setFilterTier(e.target.value)} className="hidden md:block h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none cursor-pointer">
              <option value="">Tất cả hạng</option><option value="VIP">VIP</option><option value="PREMIUM">Premium</option><option value="STANDARD">Standard</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="hidden md:block h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none cursor-pointer">
              <option value="">Mọi trạng thái</option><option value="ACTIVE">Đang hoạt động</option><option value="PENDING">Chờ duyệt</option>
            </select>
         </div>
         
         {!showForm && (
           <button onClick={() => { closeForm(); setShowForm(true); }} className="w-full md:w-auto h-11 px-6 bg-amber-500 text-[#002D62] rounded-xl text-sm font-black shadow-md hover:bg-amber-400 transition-all flex items-center justify-center gap-2">
             <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path></svg>
             THÊM HỘI VIÊN
           </button>
         )}
      </div>

      {/* 4. BẢNG DANH SÁCH (Data Table thiết kế Premium) */}
      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-[11px] font-black uppercase tracking-widest">
                <th className="p-5 pl-8">Doanh nghiệp</th>
                <th className="p-5">Liên hệ</th>
                <th className="p-5">Hạng (Tier)</th>
                <th className="p-5">Trạng thái</th>
                <th className="p-5 text-right pr-8">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-400 font-medium italic">Không tìm thấy hội viên nào phù hợp.</td></tr>
              ) : (
                filteredMembers.map(member => (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-5 pl-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-lg shadow-inner group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                          {member.company_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-base">{member.company_name}</p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">MST: {member.tax_code || '---'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="text-sm font-bold text-slate-800">{member.representative}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        {member.phone && <span><svg className="inline mr-1" width="12" height="12" fill="currentColor" viewBox="0 0 256 256"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.43-10.37-31.43-24.28-44.45-37.31S63.48,93.81,53.11,78.38l20.68-24.31a8.12,8.12,0,0,0,.56-.75,16,16,0,0,0,1.4-15.17l-.06-.13L54.58,30.91A16,16,0,0,0,38.22,20.06l-14.4,4A16,16,0,0,0,12.06,38.31C14.74,96.65,39.63,149.2,79.52,189.1s92.45,64.78,150.79,67.45a16,16,0,0,0,14.25-11.76l4-14.4A16,16,0,0,0,237.63,165.2ZM216.71,240c-54.8-2.52-104.34-26.31-142-64S13.43,88.45,10.91,33.66l14.4-4,21.11,47.12L25.75,101.07a8,8,0,0,0-.49,10.38c11,16.48,27.5,31.42,41.42,45.34s28.86,30.43,45.34,41.42a8,8,0,0,0,10.38-.49l24.31-20.68,47.12,21.11-4,14.4Z"></path></svg>{member.phone}</span>}
                        {member.email && <span><svg className="inline mr-1" width="12" height="12" fill="currentColor" viewBox="0 0 256 256"><path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"></path></svg>{member.email}</span>}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg tracking-wider ${getTierBadge(member.tier)}`}>
                        {member.tier} {member.tier === 'VIP' && '👑'}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-wider ${getStatusBadge(member.status)}`}>
                        {member.status === 'PENDING' ? 'CHỜ DUYỆT' : member.status}
                      </span>
                    </td>
                    <td className="p-5 text-right pr-8">
                      <button onClick={() => openEdit(member)} className="h-9 px-4 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-200 hover:text-[#002D62] transition-colors">
                        SỬA
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}