'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function MemberTalentHubPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'talent-pool' | 'my-jobs'>('talent-pool');
  
  const [talents, setTalents] = useState<any[]>([]);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  
  // States cho Form đăng tin
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobForm, setJobForm] = useState({ title: '', requirements: '', salary_range: '' });

  useEffect(() => {
    const fetchUserAndData = async () => {
      // 1. Lấy User hiện tại
      const { data: user } = await supabase.from('members').select('*').eq('status', 'ACTIVE').limit(1).single();
      if (user) {
        setCurrentUser(user);
        
        // 2. Lấy danh sách Chuyên gia ĐÃ ĐƯỢC ADMIN DUYỆT (VERIFIED)
        const { data: tals } = await supabase.from('talents').select('*').eq('status', 'VERIFIED').order('created_at', { ascending: false });
        if (tals) setTalents(tals);

        // 3. Lấy tin tuyển dụng CỦA CÔNG TY NÀY
        const { data: jobs } = await supabase.from('jobs').select('*').eq('member_id', user.id).order('created_at', { ascending: false });
        if (jobs) setMyJobs(jobs);
      }
    };
    fetchUserAndData();
  }, []);

  const handleSubmitJob = async () => {
    if (!jobForm.title || !jobForm.requirements) return alert('Vui lòng nhập Tên vị trí và Yêu cầu!');
    setIsSubmitting(true);
    
    const payload = {
      member_id: currentUser.id,
      title: jobForm.title,
      requirements: jobForm.requirements,
      salary_range: jobForm.salary_range,
      status: 'PENDING' // Chờ Admin duyệt tin tuyển dụng
    };

    const { error } = await supabase.from('jobs').insert([payload]);
    if (error) alert('Lỗi: ' + error.message);
    else {
      alert('✅ Đã gửi Yêu cầu đăng tuyển! Tin sẽ hiển thị sau khi Admin duyệt.');
      setShowForm(false);
      setJobForm({ title: '', requirements: '', salary_range: '' });
      // Reload danh sách jobs
      const { data } = await supabase.from('jobs').select('*').eq('member_id', currentUser.id).order('created_at', { ascending: false });
      if (data) setMyJobs(data);
    }
    setIsSubmitting(false);
  };

  // Logic Upsell: Chỉ Premium và VIP mới được xem info liên hệ của Talents
  const canViewContact = (tier: string) => tier === 'PREMIUM' || tier === 'VIP';

  if (!currentUser) return <div className="p-20 text-center text-slate-400 font-bold animate-pulse">Đang tải Trung tâm Nhân sự...</div>;

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Talent Hub</h1>
          <p className="text-sm font-medium text-slate-500 mt-2">Tuyển dụng cấp cao & Trạm Săn Đầu Người Nội Bộ.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button onClick={() => setActiveTab('talent-pool')} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'talent-pool' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'}`}>Hồ Cá Chuyên Gia</button>
          <button onClick={() => setActiveTab('my-jobs')} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'my-jobs' ? 'bg-[#002D62] text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Tin Tuyển Dụng Của Tôi</button>
        </div>
      </div>

      {/* TAB 1: TALENT POOL (SĂN ĐẦU NGƯỜI) */}
      {activeTab === 'talent-pool' && (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-indigo-900 font-black text-lg">Mạng lưới Nhân tài Tinh hoa</h3>
              <p className="text-indigo-700 text-sm mt-1">Các hồ sơ dưới đây đều đã được Admin NKBA kiểm chứng năng lực, phỏng vấn và cấp Tick Xanh.</p>
            </div>
            {!canViewContact(currentUser.tier) && (
              <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-rose-600 text-xs font-black shadow-sm border border-rose-100">
                <i className="ph ph-lock-key text-base"></i> TÍNH NĂNG BỊ GIỚI HẠN
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {talents.length === 0 ? <div className="col-span-full p-10 text-center text-slate-400 italic">Hiện chưa có chuyên gia nào trên sàn.</div> :
              talents.map(talent => (
                <div key={talent.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col hover:border-indigo-300 transition-all relative overflow-hidden">
                  
                  {/* Watermark Logo NKBA */}
                  <i className="ph ph-seal-check absolute top-4 right-4 text-5xl text-blue-50 opacity-50 pointer-events-none"></i>

                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-lg font-black shadow-inner border border-slate-200 shrink-0">
                      {talent.full_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 flex items-center gap-1">{talent.full_name} <svg width="14" height="14" fill="currentColor" className="text-blue-500" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg></h4>
                      <p className="text-xs font-bold text-indigo-600">{talent.title}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-slate-600 flex items-center gap-2"><i className="ph ph-briefcase text-slate-400"></i> Kinh nghiệm: <span className="font-bold">{talent.experience_years} năm</span></p>
                    <p className="text-sm text-slate-600 flex items-center gap-2"><i className="ph ph-money text-emerald-500"></i> Mong muốn: <span className="font-bold text-slate-800">{talent.expected_salary || 'Thỏa thuận'}</span></p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {talent.skills ? talent.skills.split(',').slice(0, 3).map((skill: string, idx: number) => (
                        <span key={idx} className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2 py-1 rounded border border-slate-200 uppercase">{skill.trim()}</span>
                      )) : <span className="text-xs italic text-slate-400">Nhiều kỹ năng chuyên sâu</span>}
                    </div>
                  </div>

                  {/* LOGIC UPSELL Ở ĐÂY */}
                  {canViewContact(currentUser.tier) ? (
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Thông tin liên hệ</p>
                      <p className="text-sm font-medium text-slate-800 flex items-center gap-2"><i className="ph ph-envelope-simple text-blue-500"></i> {talent.email || 'Chưa cập nhật'}</p>
                      <p className="text-sm font-medium text-slate-800 flex items-center gap-2 mt-1"><i className="ph ph-phone text-emerald-500"></i> {talent.phone || 'Chưa cập nhật'}</p>
                    </div>
                  ) : (
                    <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col items-center text-center">
                      <i className="ph ph-lock-key text-2xl text-slate-300 mb-1"></i>
                      <p className="text-xs font-bold text-slate-500">SĐT và Email đã bị ẩn.</p>
                      <button className="mt-2 text-xs font-black text-amber-600 hover:underline uppercase tracking-widest">Nâng cấp VIP để mở khóa</button>
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* TAB 2: QUẢN LÝ TIN TUYỂN DỤNG CỦA DOANH NGHIỆP */}
      {activeTab === 'my-jobs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-blue-50 border border-blue-100 p-5 rounded-2xl shadow-inner">
            <p className="text-sm font-bold text-blue-800">Đăng tuyển vị trí quản lý, kỹ sư trưởng hoặc chuyên gia?</p>
            <button onClick={() => setShowForm(!showForm)} className="h-11 px-6 bg-blue-600 text-white rounded-xl text-sm font-black shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2">
              <i className={`ph ${showForm ? 'ph-x' : 'ph-plus'} text-lg`}></i> {showForm ? 'HỦY' : 'ĐĂNG TIN MỚI'}
            </button>
          </div>

          {showForm && (
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-md animate-in slide-in-from-top-4">
              <h3 className="text-xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4">Tạo Yêu cầu Tuyển dụng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Chức danh / Vị trí (*)</label><input type="text" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-blue-400" placeholder="VD: Giám đốc Dự án ME..." /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Mức lương dự kiến</label><input type="text" value={jobForm.salary_range} onChange={e => setJobForm({...jobForm, salary_range: e.target.value})} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-blue-400" placeholder="VD: 30tr - 50tr hoặc Thỏa thuận" /></div>
                <div className="col-span-2 space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Mô tả & Yêu cầu công việc</label><textarea value={jobForm.requirements} onChange={e => setJobForm({...jobForm, requirements: e.target.value})} className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none resize-none focus:bg-white focus:border-blue-400" placeholder="Yêu cầu số năm kinh nghiệm, bằng cấp, kỹ năng mềm..." /></div>
              </div>
              <div className="mt-8 flex justify-end"><button onClick={handleSubmitJob} disabled={isSubmitting} className="h-12 px-8 bg-[#002D62] text-white rounded-xl text-sm font-black shadow-lg hover:bg-blue-900 transition-colors disabled:opacity-50">{isSubmitting ? 'ĐANG GỬI...' : 'GỬI ADMIN DUYỆT'}</button></div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {myJobs.length === 0 ? <div className="col-span-full p-10 text-center text-slate-400 italic">Bạn chưa đăng tin tuyển dụng nào.</div> :
              myJobs.map(job => (
                <div key={job.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest ${job.status === 'PENDING' ? 'bg-rose-50 text-rose-600' : job.status === 'OPEN' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                      {job.status === 'PENDING' ? 'CHỜ DUYỆT' : job.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{new Date(job.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 leading-snug mb-2">{job.title}</h4>
                  <p className="text-sm font-medium text-slate-500 mb-6 line-clamp-2">{job.requirements}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mức lương</p>
                      <p className="text-sm font-black text-emerald-600">{job.salary_range || 'Thỏa thuận'}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-widest">
                      Xem CV (0)
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