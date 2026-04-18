'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ExecutionPage() {
  const supabase = createClient();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  
  const [selectedTask, setSelectedTask] = useState<any>(null);
  
  // ================= STATES MỚI CHO TÍNH NĂNG THẢO LUẬN =================
  const [detailTab, setDetailTab] = useState<'info' | 'chat'>('info');
  const [chatChannel, setChatChannel] = useState<'PRIVATE' | 'TEAM'>('PRIVATE');
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  // Giả lập User đang đăng nhập (Thực tế lấy từ Supabase Auth)
  const currentUser = { name: 'Ban Lãnh Đạo', role: 'CEO' }; 

  const fetchData = async () => {
    setIsLoading(true);
    const [deptRes, empRes] = await Promise.all([
      supabase.from('departments').select('*'),
      supabase.from('employees').select('*')
    ]);
    if (deptRes.data) setDepartments(deptRes.data);
    if (empRes.data) setEmployees(empRes.data);

    const { data: plan } = await supabase.from('strategic_plans').select('id').eq('year', parseInt(selectedYear)).maybeSingle();
    if (plan) {
      const { data: ints } = await supabase.from('initiatives').select('*').eq('plan_id', plan.id).order('created_at', { ascending: false });
      setInitiatives(ints || []);
      if (ints && ints.length > 0 && !selectedTask) {
        setSelectedTask(ints[0]);
        fetchComments(ints[0].id); // Tự động load comment của task đầu tiên
      }
    } else {
      setInitiatives([]);
      setSelectedTask(null);
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, [selectedYear]);

  // Load tin nhắn mỗi khi đổi Task
  const fetchComments = async (taskId: string) => {
    const { data } = await supabase.from('initiative_comments').select('*').eq('initiative_id', taskId).order('created_at', { ascending: true });
    setComments(data || []);
  };

  // Hàm Click chọn Task bên cột trái
  const handleSelectTask = (task: any) => {
    setSelectedTask(task);
    fetchComments(task.id);
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    setIsSaving(true);
    const { error } = await supabase.from('initiatives').update({
      department_id: selectedTask.department_id || null, lead_id: selectedTask.lead_id || null,
      start_date: selectedTask.start_date || null, end_date: selectedTask.end_date || null,
      status: selectedTask.status, progress: selectedTask.progress || 0
    }).eq('id', selectedTask.id);
    if (error) alert('Lỗi cập nhật: ' + error.message);
    else fetchData();
    setIsSaving(false);
  };

  // Hàm Gửi tin nhắn
  const handleSendComment = async () => {
    if (!newComment.trim() || !selectedTask) return;
    const payload = {
      initiative_id: selectedTask.id,
      sender_name: currentUser.name,
      sender_role: currentUser.role,
      content: newComment,
      channel: chatChannel // 'PRIVATE' hoặc 'TEAM'
    };
    
    // Gửi xuống DB
    await supabase.from('initiative_comments').insert([payload]);
    
    // Update UI ngay lập tức cho mượt
    setComments([...comments, { ...payload, id: Math.random().toString(), created_at: new Date().toISOString() }]);
    setNewComment('');
  };

  // Helpers hiển thị
  const getDeptName = (id: string) => departments.find(d => d.id === id)?.name || 'Chưa giao';
  const getLeadName = (id: string) => employees.find(e => e.id === id)?.name || 'Chưa có PIC';
  
  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'ON_TRACK': return { color: 'text-emerald-700', bg: 'bg-emerald-100', bar: 'bg-emerald-500', label: 'ON TRACK' };
      case 'AT_RISK': return { color: 'text-rose-700', bg: 'bg-rose-100', bar: 'bg-rose-500', label: 'AT RISK' };
      case 'COMPLETED': return { color: 'text-blue-700', bg: 'bg-blue-100', bar: 'bg-blue-600', label: 'COMPLETED' };
      default: return { color: 'text-slate-600', bg: 'bg-slate-100', bar: 'bg-slate-400', label: 'PLANNING' };
    }
  };

  if (isLoading) return <div className="p-20 text-center text-sm font-semibold text-slate-400 animate-pulse tracking-widest uppercase">Đang đồng bộ dữ liệu thực thi...</div>;

  // Lọc comment theo Kênh đang xem
  const currentComments = comments.filter(c => c.channel === chatChannel);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-20 relative h-[calc(100vh-100px)] flex flex-col">
      
      {/* HEADER */}
      <div className="shrink-0 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><i className="ph ph-kanban text-2xl font-bold"></i></div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Trung tâm Theo dõi Thực thi</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Phân bổ nguồn lực & Đốc thúc OKRs</p>
            </div>
         </div>
         <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-[#002D62] outline-none focus:border-[#002D62] transition-all cursor-pointer">
            <option value="2026">Mục tiêu Năm 2026</option><option value="2027">Mục tiêu Năm 2027</option>
         </select>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* CỘT TRÁI: DANH SÁCH (Giữ nguyên) */}
        <div className="w-full lg:w-5/12 xl:w-1/3 bg-white border border-slate-200 shadow-sm rounded-[2rem] flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-black text-slate-800">Danh sách Sáng kiến ({initiatives.length})</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Click vào một mục để xem và phân việc</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scroll-smooth">
            {initiatives.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400 italic">Chưa có sáng kiến nào.</div>
            ) : (
              initiatives.map(task => {
                const conf = getStatusConfig(task.status);
                const isSelected = selectedTask?.id === task.id;
                return (
                  <div key={task.id} onClick={() => handleSelectTask(task)} className={`p-4 rounded-2xl border cursor-pointer transition-all ${isSelected ? 'bg-[#002D62] border-[#002D62] shadow-md transform scale-[1.02]' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <h4 className={`text-sm font-bold line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-800'}`}>{task.title}</h4>
                      <span className={`shrink-0 text-[9px] font-black px-2 py-1 rounded-md tracking-wider ${isSelected ? 'bg-white/20 text-white' : `${conf.bg} ${conf.color}`}`}>{conf.label}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shadow-inner ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>{getLeadName(task.lead_id).charAt(0)}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>{getDeptName(task.department_id)}</span>
                          <span className={`text-[10px] font-black ${isSelected ? 'text-white' : 'text-slate-700'}`}>{task.progress || 0}%</span>
                        </div>
                        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isSelected ? 'bg-white/10' : 'bg-slate-100'}`}>
                           <div className={`h-full rounded-full ${isSelected ? 'bg-amber-400' : conf.bar}`} style={{ width: `${task.progress || 0}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT & GIAO TIẾP MA TRẬN */}
        <div className="w-full lg:w-7/12 xl:w-2/3 bg-white border border-slate-200 shadow-sm rounded-[2rem] flex flex-col relative overflow-hidden">
          {!selectedTask ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center"><i className="ph ph-hand-pointing text-6xl mb-4 opacity-20"></i><p className="font-medium">Vui lòng chọn một sáng kiến bên trái để xử lý.</p></div>
          ) : (
            <>
              {/* Header của Detail (Có TABS) */}
              <div className="px-6 pt-6 md:px-8 md:pt-8 bg-slate-50/50 flex flex-col gap-5">
                 <div className="flex justify-between items-start gap-4">
                   <div>
                     <span className={`text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider ${getStatusConfig(selectedTask.status).bg} ${getStatusConfig(selectedTask.status).color}`}>
                       {getStatusConfig(selectedTask.status).label}
                     </span>
                     <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-3 leading-snug">{selectedTask.title}</h2>
                   </div>
                   <button onClick={handleUpdateTask} disabled={isSaving || detailTab === 'chat'} className={`shrink-0 h-11 px-6 rounded-xl text-sm font-black transition-all ${detailTab === 'chat' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 text-[#002D62] shadow-lg shadow-amber-500/20'}`}>
                     {isSaving ? 'ĐANG LƯU...' : 'LƯU CẬP NHẬT'}
                   </button>
                 </div>

                 {/* TABS SELECTOR */}
                 <div className="flex gap-6 border-b border-slate-200">
                    <button onClick={() => setDetailTab('info')} className={`pb-3 font-bold text-sm border-b-2 transition-colors ${detailTab === 'info' ? 'border-[#002D62] text-[#002D62]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}>
                      <i className="ph ph-info mr-1"></i> Thông tin Phân bổ
                    </button>
                    <button onClick={() => setDetailTab('chat')} className={`pb-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${detailTab === 'chat' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-700'}`}>
                      <i className="ph ph-chats-circle mr-1"></i> 
                      Chỉ đạo & Thảo luận 
                      <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{comments.length}</span>
                    </button>
                 </div>
              </div>

              {/* NỘI DUNG TABS */}
              <div className="flex-1 overflow-y-auto bg-white scroll-smooth relative flex flex-col">
                
                {/* TAB 1: THÔNG TIN PHÂN BỔ (Form cũ) */}
                {detailTab === 'info' && (
                  <div className="p-6 md:p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><i className="ph ph-buildings text-lg text-blue-600"></i> Phòng ban chủ quản</label><select value={selectedTask.department_id || ''} onChange={e => setSelectedTask({...selectedTask, department_id: e.target.value})} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"><option value="">-- Chọn Đơn vị thực thi --</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                      <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><i className="ph ph-user-circle-gear text-lg text-amber-600"></i> Trưởng nhóm / PIC</label><select value={selectedTask.lead_id || ''} onChange={e => setSelectedTask({...selectedTask, lead_id: e.target.value})} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all cursor-pointer"><option value="">-- Chọn Người chịu trách nhiệm --</option>{employees.map(e => <option key={e.id} value={e.id}>{e.name} - {e.role}</option>)}</select></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày bắt đầu</label><input type="date" value={selectedTask.start_date || ''} onChange={e => setSelectedTask({...selectedTask, start_date: e.target.value})} className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-400 transition-all" /></div>
                      <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest text-rose-600">Hạn chót (Deadline)</label><input type="date" value={selectedTask.end_date || ''} onChange={e => setSelectedTask({...selectedTask, end_date: e.target.value})} className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-rose-400 transition-all" /></div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <label className="text-sm font-black text-slate-800 uppercase tracking-widest">Tình trạng thực thi</label>
                        <select value={selectedTask.status} onChange={e => setSelectedTask({...selectedTask, status: e.target.value})} className={`h-11 px-4 border rounded-xl text-xs font-black outline-none cursor-pointer transition-all ${getStatusConfig(selectedTask.status).bg} ${getStatusConfig(selectedTask.status).color} border-transparent focus:ring-4 focus:ring-slate-500/10`}><option value="PLANNING">ĐANG LÊN KẾ HOẠCH</option><option value="ON_TRACK">ĐANG TIẾN HÀNH (ON TRACK)</option><option value="AT_RISK">CÓ RỦI RO (AT RISK)</option><option value="COMPLETED">ĐÃ HOÀN THÀNH</option></select>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-end"><label className="text-sm font-black text-slate-800 uppercase tracking-widest">Tiến độ hoàn thành</label><span className="text-3xl font-black text-[#002D62]">{selectedTask.progress || 0}%</span></div>
                        <input type="range" min="0" max="100" step="5" value={selectedTask.progress || 0} onChange={e => setSelectedTask({...selectedTask, progress: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#002D62]" />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: CHỈ ĐẠO & THẢO LUẬN MA TRẬN */}
                {detailTab === 'chat' && (
                  <div className="flex-1 flex flex-col h-full bg-slate-50/30">
                    
                    {/* BỘ LỌC KÊNH */}
                    <div className="p-4 flex gap-2 border-b border-slate-100 bg-white shrink-0">
                      <button onClick={() => setChatChannel('PRIVATE')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${chatChannel === 'PRIVATE' ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                        <i className="ph ph-lock-key"></i> Kênh Mật (Sếp & PIC)
                      </button>
                      <button onClick={() => setChatChannel('TEAM')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${chatChannel === 'TEAM' ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                        <i className="ph ph-users-three"></i> Kênh Team Nội Bộ
                      </button>
                    </div>

                    {/* KHUNG HIỂN THỊ CHAT */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-6">
                       {/* Cảnh báo an ninh */}
                       {chatChannel === 'PRIVATE' && (
                         <div className="text-center p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600">
                            🔒 Kênh nội bộ cấp cao. Nhân viên cấp dưới không thể xem tin nhắn này.
                         </div>
                       )}

                       {currentComments.length === 0 ? (
                         <div className="text-center text-slate-400 text-sm mt-10 italic">Chưa có trao đổi nào trong luồng này. Bắt đầu ngay!</div>
                       ) : (
                         currentComments.map((msg, idx) => (
                           <div key={idx} className={`flex gap-3 ${msg.sender_name === currentUser.name ? 'flex-row-reverse' : ''}`}>
                             <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-black shrink-0">{msg.sender_name.charAt(0)}</div>
                             <div className={`max-w-[75%] flex flex-col ${msg.sender_name === currentUser.name ? 'items-end' : 'items-start'}`}>
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="text-xs font-bold text-slate-700">{msg.sender_name}</span>
                                 <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase">{msg.sender_role}</span>
                               </div>
                               <div className={`p-3 text-sm font-medium rounded-2xl ${msg.sender_name === currentUser.name ? 'bg-[#002D62] text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'}`}>
                                 {msg.content}
                               </div>
                               <span className="text-[10px] text-slate-400 mt-1 font-medium">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                             </div>
                           </div>
                         ))
                       )}
                    </div>

                    {/* Ô NHẬP LIỆU (Input) */}
                    <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                        <input 
                          type="text" 
                          value={newComment} 
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                          placeholder={`Nhập ${chatChannel === 'PRIVATE' ? 'chỉ đạo mật...' : 'trao đổi với team...'}`} 
                          className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-medium text-slate-800" 
                        />
                        <button onClick={handleSendComment} disabled={!newComment.trim()} className="w-10 h-10 rounded-xl bg-amber-500 text-[#002D62] flex items-center justify-center hover:bg-amber-400 disabled:bg-slate-200 disabled:text-slate-400 transition-colors shadow-sm">
                          <i className="ph ph-paper-plane-right font-black"></i>
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}