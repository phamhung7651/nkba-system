'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function MemberBizLinkPage() {
  const [supabase] = useState(() => createClient()); // Fix lỗi đa nhân cách
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'market' | 'my-projects'>('my-projects');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'CONSTRUCTION', budget_max: '', location: '' });
  
  const [myProjects, setMyProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserAndProjects = async () => {
      // 1. Lấy mã Auth của người đang đăng nhập
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 2. Truy xuất đúng Profile thật từ bảng individuals
      const { data: profile } = await supabase
        .from('individuals')
        .select('id, full_name, individual_tiers!individuals_tier_id_fkey(name, code)')
        .eq('user_auth_id', user.id)
        .single();

      if (profile) {
        setCurrentUser(profile);
        
        // 3. Lấy dự án khớp với ID thật của user
        const { data: projs } = await supabase
          .from('projects')
          .select('*')
          .eq('member_id', profile.id)
          .order('created_at', { ascending: false });
          
        if (projs) setMyProjects(projs);
      }
    };
    fetchUserAndProjects();
  }, [supabase]);

  const handleSubmitProject = async () => {
    if (!formData.title || !formData.budget_max) return alert('Vui lòng nhập Tên dự án và Ngân sách dự kiến!');
    if (!currentUser) return alert('Lỗi xác thực người dùng!');
    
    setIsSubmitting(true);
    const payload = {
      member_id: currentUser.id, // Dùng đúng ID từ bảng individuals
      title: formData.title, 
      description: formData.description,
      category: formData.category, 
      budget_max: parseFloat(formData.budget_max), 
      location: formData.location,
      status: 'PENDING'
    };

    const { error } = await supabase.from('projects').insert([payload]);
    if (error) alert('Lỗi đăng bài: ' + error.message);
    else {
      alert('✅ Đăng dự án thành công! Đang chờ Admin Liên minh phê duyệt.');
      setShowForm(false);
      setFormData({ title: '', description: '', category: 'CONSTRUCTION', budget_max: '', location: '' });
      
      const { data } = await supabase.from('projects').select('*').eq('member_id', currentUser.id).order('created_at', { ascending: false });
      if (data) setMyProjects(data);
    }
    setIsSubmitting(false);
  };

  const formatMoney = (amount: number) => amount ? amount.toLocaleString('vi-VN') + ' VNĐ' : 'Thỏa thuận';

  if (!currentUser) return <div className="p-20 text-center text-slate-400 font-bold animate-pulse">Đang tải Sàn Giao Dịch...</div>;

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sàn Giao Dịch B2B</h1>
          <p className="text-sm font-medium text-slate-500 mt-2">Nơi khởi nguồn của những hợp đồng triệu đô.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button onClick={() => setActiveTab('market')} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'market' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'}`}>Chợ Dự Án Mở</button>
          <button onClick={() => setActiveTab('my-projects')} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'my-projects' ? 'bg-[#002D62] text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Dự Án Của Tôi</button>
        </div>
      </div>

      {activeTab === 'market' && (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-20 text-center flex flex-col items-center shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
            <i className="ph ph-lock-key text-5xl text-slate-300"></i>
          </div>
          <h3 className="text-xl font-black text-slate-800">Khu vực dành riêng cho Hội viên VIP</h3>
          <p className="text-sm text-slate-500 mt-3 max-w-md leading-relaxed">Nâng cấp hạng thẻ của bạn để xem chi tiết các gói thầu béo bở từ các Chủ đầu tư lớn và tham gia chào giá.</p>
          <button className="mt-8 px-8 py-3 bg-amber-500 text-[#002D62] rounded-xl font-black shadow-lg hover:bg-amber-400 transition-colors">
            NÂNG CẤP HẠNG THẺ NGAY
          </button>
        </div>
      )}

      {activeTab === 'my-projects' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center bg-blue-50 border border-blue-100 p-5 rounded-2xl shadow-inner">
            <p className="text-sm font-bold text-blue-800">Bạn đang cần tìm Nhà thầu phụ hoặc Nhà cung cấp vật tư?</p>
            <button onClick={() => setShowForm(!showForm)} className="h-11 px-6 bg-blue-600 text-white rounded-xl text-sm font-black shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2">
              <i className={`ph ${showForm ? 'ph-x' : 'ph-plus'} text-lg`}></i> {showForm ? 'HỦY' : 'ĐĂNG DỰ ÁN MỚI'}
            </button>
          </div>

          {showForm && (
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-md animate-in slide-in-from-top-4">
              <h3 className="text-xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4">Tạo Yêu cầu Báo giá / Tìm Đối tác</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Tên Dự án (*)</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10" placeholder="VD: Tìm thầu phụ thi công Điện nước..." /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Lĩnh vực</label><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none cursor-pointer"><option value="CONSTRUCTION">Thi công (Construction)</option><option value="DESIGN">Thiết kế (Design)</option><option value="MATERIAL">Cung cấp vật tư (Material)</option></select></div>
                <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Ngân sách dự kiến (VNĐ)</label><input type="number" value={formData.budget_max} onChange={e => setFormData({...formData, budget_max: e.target.value})} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-blue-400" placeholder="VD: 5000000000" /></div>
                <div className="col-span-2 space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Mô tả Yêu cầu</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none resize-none focus:bg-white focus:border-blue-400" placeholder="Yêu cầu chi tiết về năng lực, tiến độ..." /></div>
              </div>
              <div className="mt-8 flex justify-end"><button onClick={handleSubmitProject} disabled={isSubmitting} className="h-12 px-8 bg-[#002D62] text-white rounded-xl text-sm font-black shadow-lg hover:bg-blue-900 transition-colors disabled:opacity-50">{isSubmitting ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU LÊN SÀN'}</button></div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {myProjects.length === 0 ? <div className="col-span-full p-10 text-center text-slate-400 italic">Bạn chưa đăng dự án nào.</div> :
              myProjects.map(p => (
                <div key={p.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${p.status === 'PENDING' ? 'bg-rose-50 text-rose-600 border border-rose-200' : p.status === 'OPEN' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                      {p.status === 'PENDING' ? 'CHỜ DUYỆT' : p.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">{p.category}</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">{p.title}</h4>
                  <p className="text-sm font-medium text-slate-500 mb-6 line-clamp-2">{p.description || 'Không có mô tả'}</p>
                  
                  <div className="mt-auto pt-5 border-t border-slate-100 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ngân sách</p>
                      <p className="text-sm font-black text-emerald-600">{formatMoney(p.budget_max)}</p>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                      <i className="ph ph-arrow-right font-bold"></i>
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}