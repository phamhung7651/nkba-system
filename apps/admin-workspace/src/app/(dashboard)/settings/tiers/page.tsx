'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function TiersConfigPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'individual' | 'corporate'>('individual');
  const [isLoading, setIsLoading] = useState(true);

  // Data States
  const [indTiers, setIndTiers] = useState<any[]>([]);
  const [corpTiers, setCorpTiers] = useState<any[]>([]);

  // Form States cho Gói Cá nhân
  const [newIndTier, setNewIndTier] = useState({
    code: '', name: '', annual_fee: 0
  });

  // Form States cho Gói Doanh nghiệp (Có Quota)
  const [newCorpTier, setNewCorpTier] = useState({
    code: '', name: '', annual_fee: 0,
    quota_silver: 0, quota_gold: 0, quota_titanium: 0
  });

  const fetchData = async () => {
    setIsLoading(true);
    const [indRes, corpRes] = await Promise.all([
      supabase.from('individual_tiers').select('*').order('annual_fee', { ascending: true }),
      supabase.from('corporate_tiers').select('*').order('annual_fee', { ascending: true })
    ]);
    if (indRes.data) setIndTiers(indRes.data);
    if (corpRes.data) setCorpTiers(corpRes.data);
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // HÀM LƯU GÓI CÁ NHÂN
  const handleSaveIndTier = async () => {
    if (!newIndTier.code || !newIndTier.name) return alert('Vui lòng nhập đủ Mã và Tên gói cá nhân!');
    const { error } = await supabase.from('individual_tiers').insert([{
      ...newIndTier, 
      code: newIndTier.code.toUpperCase().replace(/\s+/g, '_')
    }]);
    
    if (error) alert('Lỗi: ' + (error.code === '23505' ? 'Mã gói này đã tồn tại!' : error.message));
    else {
      alert('✅ Đã thêm gói Cá nhân mới!');
      setNewIndTier({ code: '', name: '', annual_fee: 0 });
      fetchData();
    }
  };

  // HÀM LƯU GÓI DOANH NGHIỆP
  const handleSaveCorpTier = async () => {
    if (!newCorpTier.code || !newCorpTier.name) return alert('Vui lòng nhập đủ Mã và Tên gói doanh nghiệp!');
    const { error } = await supabase.from('corporate_tiers').insert([{
      ...newCorpTier,
      code: newCorpTier.code.toUpperCase().replace(/\s+/g, '_')
    }]);
    
    if (error) alert('Lỗi: ' + (error.code === '23505' ? 'Mã gói này đã tồn tại!' : error.message));
    else {
      alert('✅ Đã thêm gói Doanh nghiệp mới!');
      setNewCorpTier({ code: '', name: '', annual_fee: 0, quota_silver: 0, quota_gold: 0, quota_titanium: 0 });
      fetchData();
    }
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse font-bold text-slate-400">ĐANG TẢI CẤU HÌNH GÓI CƯỚC...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      
      {/* HEADER TỔNG */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#002D62]"></div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Cấu hình Gói cước (Tiers)</h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">Định nghĩa giá trị gói hội viên cá nhân và hạn mức (Quota) cho Pháp nhân.</p>
        
        <div className="flex gap-2 mt-6 p-1 bg-slate-100 rounded-xl w-fit">
          <button onClick={() => setActiveTab('individual')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'individual' ? 'bg-white text-[#002D62] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <i className="ph-fill ph-user mr-2"></i> Gói Cá nhân
          </button>
          <button onClick={() => setActiveTab('corporate')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'corporate' ? 'bg-[#002D62] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
            <i className="ph-fill ph-buildings mr-2"></i> Gói Doanh nghiệp & Quota
          </button>
        </div>
      </div>

      {/* TAB 1: GÓI CÁ NHÂN */}
      {activeTab === 'individual' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form thêm mới Cá nhân */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm relative lg:sticky lg:top-6">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <i className="ph-bold ph-plus-circle text-amber-500 text-xl"></i> Tạo gói Cá nhân
            </h3>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã gói (Code)</label>
                <input type="text" value={newIndTier.code} onChange={e => setNewIndTier({...newIndTier, code: e.target.value.toUpperCase()})} placeholder="VD: SILVER, GOLD..." className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl mt-1.5 font-bold text-slate-700 outline-none focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên gói hiển thị</label>
                <input type="text" value={newIndTier.name} onChange={e => setNewIndTier({...newIndTier, name: e.target.value})} placeholder="VD: Hội viên Bạc" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl mt-1.5 font-medium outline-none focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phí thường niên (VNĐ)</label>
                <input type="number" value={newIndTier.annual_fee || ''} onChange={e => setNewIndTier({...newIndTier, annual_fee: Number(e.target.value)})} placeholder="0" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl mt-1.5 font-black text-amber-600 outline-none focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all" />
              </div>
              <button onClick={handleSaveIndTier} className="w-full h-12 mt-2 bg-[#002D62] text-white text-sm font-bold rounded-xl hover:bg-blue-900 transition-all shadow-md">THÊM GÓI CÁ NHÂN</button>
            </div>
          </div>

          {/* Danh sách gói Cá nhân */}
          <div className="lg:col-span-2 space-y-3">
            {indTiers.length === 0 ? (
              <div className="p-10 text-center bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400 font-medium">Chưa có gói cá nhân nào. Hãy tạo ở bên trái.</div>
            ) : (
              indTiers.map(tier => (
                <div key={tier.id} className="bg-white p-5 md:px-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center group hover:border-amber-300 hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest">{tier.code}</span>
                      <h4 className="font-black text-slate-800 text-base md:text-lg">{tier.name}</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Phí thường niên</p>
                    <p className="text-amber-600 font-black text-base md:text-lg mt-0.5">{tier.annual_fee === 0 ? 'MIỄN PHÍ' : `${tier.annual_fee.toLocaleString()} đ`}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: GÓI DOANH NGHIỆP & QUOTA */}
      {activeTab === 'corporate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form thêm mới Doanh nghiệp */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm relative lg:sticky lg:top-6">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <i className="ph-bold ph-plus-circle text-blue-600 text-xl"></i> Tạo gói Doanh nghiệp
            </h3>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã gói (Code)</label>
                <input type="text" value={newCorpTier.code} onChange={e => setNewCorpTier({...newCorpTier, code: e.target.value.toUpperCase()})} placeholder="VD: PREMIUM" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl mt-1.5 font-bold text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên gói hiển thị</label>
                <input type="text" value={newCorpTier.name} onChange={e => setNewCorpTier({...newCorpTier, name: e.target.value})} placeholder="VD: Gói Premium 10" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl mt-1.5 font-medium outline-none focus:border-blue-400 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phí thường niên (VNĐ)</label>
                <input type="number" value={newCorpTier.annual_fee || ''} onChange={e => setNewCorpTier({...newCorpTier, annual_fee: Number(e.target.value)})} placeholder="0" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl mt-1.5 font-black text-blue-600 outline-none focus:border-blue-400 focus:bg-white transition-all" />
              </div>
              
              {/* VÙNG NHẬP QUOTA */}
              <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100">
                <p className="text-xs font-black text-[#002D62] uppercase mb-4 text-center">Cấp hạn mức thẻ Cá nhân (Quota)</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Silver</label>
                    <input type="number" value={newCorpTier.quota_silver || ''} onChange={e => setNewCorpTier({...newCorpTier, quota_silver: Number(e.target.value)})} placeholder="0" className="w-full h-10 border border-slate-200 rounded-lg text-center text-sm font-black text-slate-700 focus:border-blue-400 outline-none" />
                  </div>
                  <div className="text-center">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Gold</label>
                    <input type="number" value={newCorpTier.quota_gold || ''} onChange={e => setNewCorpTier({...newCorpTier, quota_gold: Number(e.target.value)})} placeholder="0" className="w-full h-10 border border-slate-200 rounded-lg text-center text-sm font-black text-slate-700 focus:border-blue-400 outline-none" />
                  </div>
                  <div className="text-center">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Titanium</label>
                    <input type="number" value={newCorpTier.quota_titanium || ''} onChange={e => setNewCorpTier({...newCorpTier, quota_titanium: Number(e.target.value)})} placeholder="0" className="w-full h-10 border border-slate-200 rounded-lg text-center text-sm font-black text-slate-700 focus:border-blue-400 outline-none" />
                  </div>
                </div>
              </div>
              
              <button onClick={handleSaveCorpTier} className="w-full h-12 mt-2 bg-[#002D62] text-white text-sm font-bold rounded-xl hover:bg-blue-900 transition-all shadow-md">THÊM GÓI DOANH NGHIỆP</button>
            </div>
          </div>

          {/* Danh sách gói Doanh nghiệp */}
          <div className="lg:col-span-2 space-y-3">
            {corpTiers.length === 0 ? (
               <div className="p-10 text-center bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400 font-medium">Chưa có gói doanh nghiệp nào. Hãy tạo ở bên trái.</div>
            ) : (
              corpTiers.map(tier => (
                <div key={tier.id} className="bg-white p-5 md:px-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:border-blue-400 hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest">{tier.code}</span>
                      <h4 className="font-black text-slate-800 text-base md:text-lg">{tier.name}</h4>
                    </div>
                    <p className="text-blue-600 font-black text-sm mt-1.5">{tier.annual_fee === 0 ? 'MIỄN PHÍ' : `${tier.annual_fee.toLocaleString()} đ`} / năm</p>
                  </div>
                  
                  {/* Hiển thị Quota */}
                  <div className="flex gap-2 w-full md:w-auto bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="flex-1 md:w-16 text-center px-2">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Silver</p>
                      <p className="font-black text-slate-700">{tier.quota_silver}</p>
                    </div>
                    <div className="w-px bg-slate-200"></div>
                    <div className="flex-1 md:w-16 text-center px-2">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Gold</p>
                      <p className="font-black text-slate-700">{tier.quota_gold}</p>
                    </div>
                    <div className="w-px bg-slate-200"></div>
                    <div className="flex-1 md:w-16 text-center px-2">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Titanium</p>
                      <p className="font-black text-slate-700">{tier.quota_titanium}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}