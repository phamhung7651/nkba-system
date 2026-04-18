'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function StrategyVisionPage() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [period, setPeriod] = useState({
    id: '', name: 'Kỳ Chiến lược Định vị Liên minh',
    start_year: 2026, end_year: 2030,
    vision: '', mission: '', long_term_goals: '', mid_term_goals: '', short_term_goals: ''
  });

  const fetchActivePeriod = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('strategic_periods').select('*').eq('is_active', true).maybeSingle();
    if (data) setPeriod(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchActivePeriod(); }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const { id, ...restPeriod } = period; // Tách riêng cái 'id' ra
    const payload = { ...restPeriod, is_active: true }; // Chỉ gom những phần còn lại vào payload

    let res;
    if (period.id) res = await supabase.from('strategic_periods').update(payload).eq('id', period.id).select().single();
    else res = await supabase.from('strategic_periods').insert([payload]).select().single();

    if (res.error) alert('Lỗi: ' + res.error.message);
    else { alert('✅ Đã lưu Tầm nhìn & Chiến lược thành công!'); setPeriod(res.data); setIsEditing(false); }
    setIsSaving(false);
  };

  if (isLoading) return <div className="p-20 text-center text-sm font-semibold text-slate-400 animate-pulse tracking-widest uppercase">Đang tải cấu trúc chiến lược...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 relative">
      
      {/* 1. HEADER - ĐÃ GỠ BỎ NAM CHÂM STICKY VÀ ĐƯA VỀ RELATIVE Z-10 */}
      <div className="relative z-10 bg-[#002D62] p-6 md:px-8 rounded-[2rem] shadow-2xl shadow-blue-900/20 text-white border border-blue-800/50 backdrop-blur-xl transition-all">
         <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-white/10 to-transparent pointer-events-none rounded-r-[2rem]"></div>
         <div className="relative z-10 flex flex-col gap-3">
            <p className="text-blue-200/90 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center gap-2">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM100.24,155.76a8,8,0,0,1-11.32-11.32l24-24a8,8,0,0,1,11.32,11.32Zm66.83-66.83L120.4,135.6a8,8,0,0,1-11.32-11.32l46.67-46.67a8,8,0,0,1,11.32,11.32Z"></path></svg>
              KẾ HOẠCH TỔNG THỂ
            </p>
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 w-full">
               {isEditing ? (
                 <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full">
                   <input type="text" value={period.name} onChange={e => setPeriod({...period, name: e.target.value})} className="flex-1 min-w-[200px] h-12 bg-black/20 border border-white/10 text-white px-4 rounded-xl text-lg font-bold outline-none focus:bg-black/30 focus:border-white/30 transition-all placeholder:text-white/40 shadow-inner" placeholder="Tên kỳ chiến lược..." />
                   <div className="flex items-center gap-2 shrink-0">
                     <input type="number" value={period.start_year} onChange={e => setPeriod({...period, start_year: parseInt(e.target.value) || 0})} className="w-20 h-12 bg-black/20 border border-white/10 text-white px-2 rounded-xl text-base md:text-lg font-bold outline-none text-center focus:bg-black/30 transition-all shadow-inner" />
                     <span className="text-white/50 font-bold">-</span>
                     <input type="number" value={period.end_year} onChange={e => setPeriod({...period, end_year: parseInt(e.target.value) || 0})} className="w-20 h-12 bg-black/20 border border-white/10 text-white px-2 rounded-xl text-base md:text-lg font-bold outline-none text-center focus:bg-black/30 transition-all shadow-inner" />
                   </div>
                 </div>
               ) : (
                 <h2 className="text-2xl md:text-3xl font-bold tracking-tight drop-shadow-sm leading-tight">
                   {period.name} <span className="text-amber-400 font-semibold text-xl md:text-2xl">({period.start_year} - {period.end_year})</span>
                 </h2>
               )}
               <div className="flex items-center gap-2 md:gap-3 shrink-0 mt-2 xl:mt-0">
                 {isEditing ? (
                   <>
                     <button onClick={() => setIsEditing(false)} className="h-12 px-5 bg-transparent hover:bg-white/10 text-white border border-white/20 rounded-xl text-sm font-bold transition-all w-full sm:w-auto">HỦY BỎ</button>
                     <button onClick={handleSave} disabled={isSaving} className="h-12 px-6 bg-amber-500 hover:bg-amber-400 text-[#002D62] rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 transition-all disabled:opacity-70 w-full sm:w-auto flex items-center justify-center">
                       {isSaving ? 'ĐANG LƯU...' : 'LƯU CHIẾN LƯỢC'}
                     </button>
                   </>
                 ) : (
                   <button onClick={() => setIsEditing(true)} className="h-12 px-6 bg-white text-[#002D62] hover:bg-slate-50 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                     <svg width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path></svg>
                     HIỆU CHỈNH
                   </button>
                 )}
               </div>
            </div>
         </div>
      </div>

      {/* 2. TẦM NHÌN & SỨ MỆNH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative flex flex-col group hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-blue-600"></span> TẦM NHÌN (VISION)</h3>
          {isEditing ? (
            <textarea value={period.vision || ''} onChange={e => setPeriod({...period, vision: e.target.value})} placeholder="Doanh nghiệp sẽ trở thành..." className="w-full h-36 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-base font-medium text-slate-800 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none leading-relaxed" />
          ) : (
            <p className="text-lg font-semibold text-slate-800 leading-relaxed flex-1">{period.vision || <span className="text-slate-300 italic font-medium">Chưa thiết lập tầm nhìn...</span>}</p>
          )}
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative flex flex-col group hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-rose-600"></span> SỨ MỆNH (MISSION)</h3>
          {isEditing ? (
            <textarea value={period.mission || ''} onChange={e => setPeriod({...period, mission: e.target.value})} placeholder="Sứ mệnh cốt lõi là..." className="w-full h-36 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-base font-medium text-slate-800 outline-none focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all resize-none leading-relaxed" />
          ) : (
            <p className="text-lg font-semibold text-slate-800 leading-relaxed flex-1">{period.mission || <span className="text-slate-300 italic font-medium">Chưa thiết lập sứ mệnh...</span>}</p>
          )}
        </div>
      </div>

      {/* 3. CHIẾN LƯỢC THEO GIAI ĐOẠN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* DÀI HẠN */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col border-t-[6px] border-t-purple-500 hover:shadow-md transition-shadow min-h-[400px]">
          <div className="flex items-center gap-4 mb-6 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center"><svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M240,104a8,8,0,0,1-8,8H152v96a8,8,0,0,1-16,0V112H24a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8H232a8,8,0,0,1,8,8ZM136,48H32V96H136ZM224,48H152V96h72Z"></path></svg></div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Chiến lược Dài hạn</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">3 - 5 năm</p>
            </div>
          </div>
          {isEditing ? (
            <textarea value={period.long_term_goals || ''} onChange={e => setPeriod({...period, long_term_goals: e.target.value})} placeholder="Nhập mục tiêu dài hạn..." className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none leading-relaxed" />
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 text-sm font-medium text-slate-700 whitespace-pre-line leading-loose bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                {period.long_term_goals || <span className="text-slate-400 italic">Chưa có nội dung...</span>}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 shrink-0">
                <Link href="/strategy/vision/details?tab=long" className="text-purple-600 font-bold text-sm hover:text-purple-800 flex items-center gap-1 transition-colors w-fit">
                  Xem & Soạn thảo chi tiết <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path></svg>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* TRUNG HẠN */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col border-t-[6px] border-t-amber-500 hover:shadow-md transition-shadow min-h-[400px]">
          <div className="flex items-center gap-4 mb-6 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center"><svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M236.24,75.75l-43.9-44a16,16,0,0,0-22.68,0L135.21,66.19l-4.22-4.22a16,16,0,0,0-22.63,0L32,138.34A15.86,15.86,0,0,0,27.31,149.66l-11,62.53A8,8,0,0,0,24,220a8,8,0,0,0,7.37,8,8.23,8.23,0,0,0,1.38-.12l62.53-11A15.86,15.86,0,0,0,106.66,212l76.38-76.38a16,16,0,0,0,0-22.63l-4.22-4.22,34.45-34.44A16,16,0,0,0,236.24,75.75Z"></path></svg></div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Chiến lược Trung hạn</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">1 - 3 năm</p>
            </div>
          </div>
          {isEditing ? (
            <textarea value={period.mid_term_goals || ''} onChange={e => setPeriod({...period, mid_term_goals: e.target.value})} placeholder="Nhập mục tiêu trung hạn..." className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all resize-none leading-relaxed" />
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 text-sm font-medium text-slate-700 whitespace-pre-line leading-loose bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                {period.mid_term_goals || <span className="text-slate-400 italic">Chưa có nội dung...</span>}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 shrink-0">
                <Link href="/strategy/vision/details?tab=mid" className="text-amber-600 font-bold text-sm hover:text-amber-800 flex items-center gap-1 transition-colors w-fit">
                  Xem & Soạn thảo chi tiết <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path></svg>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* NGẮN HẠN */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col border-t-[6px] border-t-blue-500 hover:shadow-md transition-shadow min-h-[400px]">
          <div className="flex items-center gap-4 mb-6 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l21.46-75.1A8,8,0,0,0,166.86,4.56l-120,40a8,8,0,0,0-2.65,13.27l61.26,61.27L84,194.2a8,8,0,0,0,7.78,10.22l120-40A8,8,0,0,0,215.79,118.17Z"></path></svg></div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Chiến lược Ngắn hạn</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">&lt; 1 năm (Thực thi)</p>
            </div>
          </div>
          {isEditing ? (
            <textarea value={period.short_term_goals || ''} onChange={e => setPeriod({...period, short_term_goals: e.target.value})} placeholder="Nhập mục tiêu ngắn hạn..." className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none leading-relaxed" />
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 text-sm font-medium text-slate-700 whitespace-pre-line leading-loose bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                {period.short_term_goals || <span className="text-slate-400 italic">Chưa có nội dung...</span>}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 shrink-0">
                <Link href="/strategy/vision/details?tab=short" className="text-blue-600 font-bold text-sm hover:text-blue-800 flex items-center gap-1 transition-colors w-fit">
                  Xem & Soạn thảo chi tiết <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path></svg>
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}