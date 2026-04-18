'use client';

import { useEffect, useState } from 'react';
import { supabase } from 'supabase/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Cấu trúc chuẩn của một Bản Chiến Lược (Canvas)
interface StrategyCanvas {
  context: string;
  pillars: string;
  metrics: string;
  risks: string;
}

const defaultCanvas: StrategyCanvas = { context: '', pillars: '', metrics: '', risks: '' };

export default function StrategyDetailsPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'long';

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'long' | 'mid' | 'short'>(initialTab as any);
  const [period, setPeriod] = useState<any>(null);

  // Dữ liệu Canvas hiện tại đang được hiển thị/chỉnh sửa
  const [canvasData, setCanvasData] = useState<StrategyCanvas>(defaultCanvas);

  // Hàm "Giải mã" dữ liệu TEXT từ Database thành JSON Canvas
  const parseCanvasData = (rawText: string | null): StrategyCanvas => {
    if (!rawText) return { ...defaultCanvas };
    try {
      return JSON.parse(rawText);
    } catch (e) {
      // BẮT LỖI THÔNG MINH: Nếu Database đang chứa Text thuần túy (chữ cũ), 
      // ta tự động nhét nó vào ô Bối cảnh để không bị mất dữ liệu của sếp!
      return { ...defaultCanvas, context: rawText };
    }
  };

  const fetchActivePeriod = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('strategic_periods').select('*').eq('is_active', true).single();
    if (data) {
      setPeriod(data);
      const rawText = activeTab === 'long' ? data.long_term_goals : activeTab === 'mid' ? data.mid_term_goals : data.short_term_goals;
      setCanvasData(parseCanvasData(rawText));
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchActivePeriod(); }, []);

  // Cập nhật lại Canvas mỗi khi chuyển Tab
  useEffect(() => {
    if (period) {
      const rawText = activeTab === 'long' ? period.long_term_goals : activeTab === 'mid' ? period.mid_term_goals : period.short_term_goals;
      setCanvasData(parseCanvasData(rawText));
      setIsEditing(false); // Chuyển tab thì tự động tắt chế độ sửa
    }
  }, [activeTab, period]);

  const handleSave = async () => {
    if (!period) return;
    setIsSaving(true);
    
    const updateColumn = activeTab === 'long' ? 'long_term_goals' : activeTab === 'mid' ? 'mid_term_goals' : 'short_term_goals';
    
    // Nén cục JSON lại thành chữ (String) để lưu xuống Database
    const stringifiedData = JSON.stringify(canvasData);

    const { error, data } = await supabase.from('strategic_periods')
      .update({ [updateColumn]: stringifiedData })
      .eq('id', period.id)
      .select()
      .single();

    if (error) alert('Lỗi khi lưu: ' + error.message);
    else {
      setPeriod(data);
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  if (isLoading) return <div className="p-20 text-center text-sm font-semibold text-slate-400 animate-pulse tracking-widest uppercase">Đang tải tài liệu chiến lược...</div>;
  if (!period) return <div className="p-20 text-center text-slate-500">Chưa có kỳ chiến lược nào được thiết lập.</div>;

  const tabColor = activeTab === 'long' ? 'purple' : activeTab === 'mid' ? 'amber' : 'blue';

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-6">
      
      {/* 1. BREADCRUMB & HEADER QUAY LẠI */}
      <div className="flex items-center justify-between bg-transparent pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <Link href="/strategy/vision" className="w-11 h-11 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 hover:text-[#002D62] hover:border-blue-300 hover:shadow-md transition-all">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
          </Link>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{period.name}</p>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">Strategy Canvas (Bản đồ Chiến lược)</h1>
          </div>
        </div>
      </div>

      {/* 2. TABS ĐIỀU HƯỚNG */}
      <div className="flex p-1.5 bg-slate-200/60 rounded-[1.25rem] w-fit border border-slate-200 shadow-inner">
        <button onClick={() => setActiveTab('long')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'long' ? 'bg-white text-purple-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}>Dài hạn (3-5 năm)</button>
        <button onClick={() => setActiveTab('mid')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'mid' ? 'bg-white text-amber-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}>Trung hạn (1-3 năm)</button>
        <button onClick={() => setActiveTab('short')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'short' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}>Ngắn hạn (&lt; 1 năm)</button>
      </div>

      {/* 3. KHU VỰC CANVAS */}
      <div className={`bg-white rounded-[2rem] border-t-[8px] border-t-${tabColor}-500 border border-slate-200 shadow-xl p-6 md:p-10 relative flex flex-col`}>
        
        {/* Nút Chỉnh sửa / Lưu */}
        <div className="absolute top-6 right-8 flex gap-2 z-10">
          {isEditing ? (
            <>
              <button onClick={() => { setIsEditing(false); setCanvasData(parseCanvasData(period[activeTab === 'long' ? 'long_term_goals' : activeTab === 'mid' ? 'mid_term_goals' : 'short_term_goals'])); }} className="h-10 px-5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">HỦY</button>
              <button onClick={handleSave} disabled={isSaving} className="h-10 px-6 bg-[#002D62] text-white rounded-xl text-sm font-black shadow-md hover:bg-blue-900 transition-colors">{isSaving ? 'ĐANG LƯU...' : 'LƯU CANVAS'}</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="h-10 px-6 bg-slate-50 border border-slate-200 text-[#002D62] rounded-xl text-sm font-bold shadow-sm hover:bg-slate-100 transition-colors flex items-center gap-2">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path></svg> 
              BIÊN SOẠN
            </button>
          )}
        </div>

        <h2 className={`text-2xl font-black tracking-tight mb-8 text-${tabColor}-900 pr-40`}>
          Mô hình Chiến lược {activeTab === 'long' ? 'Dài hạn' : activeTab === 'mid' ? 'Trung hạn' : 'Ngắn hạn'}
        </h2>

        {/* BỐ CỤC LƯỚI 4 Ô CANVAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Ô 1: BỐI CẢNH (Full width) */}
          <div className="md:col-span-2 bg-slate-50/80 rounded-2xl p-6 border border-slate-200 relative overflow-hidden group">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><i className="ph ph-binoculars text-lg"></i></div> 1. Bối cảnh & Nhận định (Context & SWOT)
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">Tại sao lại cần chiến lược này? Cơ hội và Thách thức cốt lõi là gì?</p>
            {isEditing ? (
              <textarea value={canvasData.context} onChange={e => setCanvasData({...canvasData, context: e.target.value})} className="w-full min-h-[120px] bg-white border border-blue-200 rounded-xl p-4 text-sm font-medium text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-y leading-relaxed" placeholder="- Điểm mạnh: ...&#10;- Cơ hội thị trường: ..." />
            ) : (
              <div className="text-sm text-slate-700 whitespace-pre-line leading-loose">{canvasData.context || <span className="italic text-slate-400">Chưa có dữ liệu...</span>}</div>
            )}
          </div>

          {/* Ô 2: TRỤ CỘT CHIẾN LƯỢC (Half width) */}
          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 relative overflow-hidden group">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center"><i className="ph ph-columns text-lg"></i></div> 2. Trụ cột Chiến lược (Pillars)
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">Định nghĩa 3-4 hướng đi cốt lõi bắt buộc phải làm.</p>
            {isEditing ? (
              <textarea value={canvasData.pillars} onChange={e => setCanvasData({...canvasData, pillars: e.target.value})} className="w-full min-h-[150px] bg-white border border-purple-200 rounded-xl p-4 text-sm font-medium text-slate-800 outline-none focus:ring-4 focus:ring-purple-500/10 transition-all resize-y leading-relaxed" placeholder="- Trụ cột 1: Số hóa hệ thống...&#10;- Trụ cột 2: Phủ sóng toàn quốc..." />
            ) : (
              <div className="text-sm text-slate-700 whitespace-pre-line leading-loose">{canvasData.pillars || <span className="italic text-slate-400">Chưa có dữ liệu...</span>}</div>
            )}
          </div>

          {/* Ô 3: MỤC TIÊU ĐỊNH LƯỢNG (Half width) */}
          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 relative overflow-hidden group">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center"><i className="ph ph-target text-lg"></i></div> 3. Mục tiêu Định lượng (OKRs / Metrics)
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">Đo lường sự thành công bằng các con số cụ thể.</p>
            {isEditing ? (
              <textarea value={canvasData.metrics} onChange={e => setCanvasData({...canvasData, metrics: e.target.value})} className="w-full min-h-[150px] bg-white border border-emerald-200 rounded-xl p-4 text-sm font-medium text-slate-800 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all resize-y leading-relaxed" placeholder="- GMV đạt 500 Tỷ.&#10;- Thu hút 1000 Hội viên..." />
            ) : (
              <div className="text-sm text-slate-700 whitespace-pre-line leading-loose">{canvasData.metrics || <span className="italic text-slate-400">Chưa có dữ liệu...</span>}</div>
            )}
          </div>

          {/* Ô 4: RỦI RO & DỰ PHÒNG (Full width) */}
          <div className="md:col-span-2 bg-slate-50/80 rounded-2xl p-6 border border-slate-200 relative overflow-hidden group">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center"><i className="ph ph-warning-octagon text-lg"></i></div> 4. Rủi ro & Kế hoạch Dự phòng (Risks)
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">Nhận diện các rủi ro có thể cản trở và cách xử lý.</p>
            {isEditing ? (
              <textarea value={canvasData.risks} onChange={e => setCanvasData({...canvasData, risks: e.target.value})} className="w-full min-h-[120px] bg-white border border-rose-200 rounded-xl p-4 text-sm font-medium text-slate-800 outline-none focus:ring-4 focus:ring-rose-500/10 transition-all resize-y leading-relaxed" placeholder="- Rủi ro 1: Đối thủ cạnh tranh mạnh -> Giải pháp: Tăng cường CSKH..." />
            ) : (
              <div className="text-sm text-slate-700 whitespace-pre-line leading-loose">{canvasData.risks || <span className="italic text-slate-400">Chưa có dữ liệu...</span>}</div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}