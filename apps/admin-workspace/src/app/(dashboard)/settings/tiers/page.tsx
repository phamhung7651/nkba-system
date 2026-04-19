'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

// DANH SÁCH TÍNH NĂNG CỦA PORTAL HỘI VIÊN
const PORTAL_FEATURES = [
  { code: 'VIEW_MARKET_BUDGET', name: 'Xem Ngân sách Dự án Biz-Link', icon: 'ph-wallet' },
  { code: 'VIEW_MARKET_CONTACT', name: 'Xem Liên hệ Chủ thầu Biz-Link', icon: 'ph-phone-call' },
  { code: 'POST_PROJECT', name: 'Đăng Dự án lên Biz-Link', icon: 'ph-upload-simple' },
  { code: 'VIEW_TALENT_CONTACT', name: 'Xem Liên hệ Ứng viên J-Job', icon: 'ph-identification-card' },
  { code: 'POST_JOB', name: 'Đăng tin Tuyển dụng J-Job', icon: 'ph-briefcase' },
  { code: 'REQUEST_CUSTOM_DATA', name: 'Đặt hàng Dữ liệu Insights', icon: 'ph-chart-pie' }
];

export default function TiersConfigPage() {
  const supabase = createClient();
  // Đã thêm tab 'permissions'
  const [activeTab, setActiveTab] = useState<'individual' | 'corporate' | 'permissions'>('individual');
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data States
  const [indTiers, setIndTiers] = useState<any[]>([]);
  const [corpTiers, setCorpTiers] = useState<any[]>([]);
  
  // Ma trận Đặc quyền (Feature Flags)
  const [tierMatrix, setTierMatrix] = useState<Record<string, Record<string, boolean>>>({});

  // Form States cho Gói Cá nhân
  const [newIndTier, setNewIndTier] = useState({
    code: '', name: '', annual_fee: 0
  });

  // Form States cho Gói Doanh nghiệp
  const [newCorpTier, setNewCorpTier] = useState({
    code: '', name: '', annual_fee: 0,
    quota_silver: 0, quota_gold: 0, quota_titanium: 0
  });

  const fetchData = async () => {
    setIsLoading(true);
    const [indRes, corpRes, tierFeatRes] = await Promise.all([
      supabase.from('individual_tiers').select('*').order('annual_fee', { ascending: true }),
      supabase.from('corporate_tiers').select('*').order('annual_fee', { ascending: true }),
      supabase.from('tier_features').select('*') // Bảng cấu hình tính năng hội viên
    ]);

    const fetchedIndTiers = indRes.data || [];
    setIndTiers(fetchedIndTiers);
    if (corpRes.data) setCorpTiers(corpRes.data);

    // XÂY DỰNG MA TRẬN ĐẶC QUYỀN BAN ĐẦU
    const initialTierMatrix: Record<string, Record<string, boolean>> = {};
    fetchedIndTiers.forEach(t => {
      initialTierMatrix[t.code] = {};
      PORTAL_FEATURES.forEach(f => {
        initialTierMatrix[t.code][f.code] = t.code === 'VIP'; // VIP auto bật
      });
    });

    if (tierFeatRes.data) {
      tierFeatRes.data.forEach(tf => {
        if (initialTierMatrix[tf.tier_code] && tf.feature_code in initialTierMatrix[tf.tier_code]) {
          if (tf.tier_code !== 'VIP') initialTierMatrix[tf.tier_code][tf.feature_code] = tf.can_access;
        }
      });
    }
    setTierMatrix(initialTierMatrix);

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

  // LOGIC LƯU ĐẶC QUYỀN
  const toggleTierFeature = (tierCode: string, featureCode: string) => {
    if (tierCode === 'VIP') return alert("Hạng VIP mặc định mở khóa mọi tính năng!");
    setTierMatrix(prev => ({ ...prev, [tierCode]: { ...prev[tierCode], [featureCode]: !prev[tierCode][featureCode] } }));
  };

  const saveTierMatrix = async () => {
    setSaving(true);
    const payload: any[] = [];
    indTiers.forEach(t => {
      PORTAL_FEATURES.forEach(f => { payload.push({ tier_code: t.code, feature_code: f.code, can_access: tierMatrix[t.code][f.code] }); });
    });
    const { error } = await supabase.from('tier_features').upsert(payload, { onConflict: 'tier_code, feature_code' });
    if (error) alert("Lỗi khi lưu: " + error.message);
    else alert("✅ Lưu Đặc quyền Hội viên thành công!");
    setSaving(false);
  };


  if (isLoading) return <div className="p-20 text-center animate-pulse font-bold text-slate-400">ĐANG TẢI CẤU HÌNH GÓI CƯỚC...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      
      {/* HEADER TỔNG */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#002D62]"></div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Cấu hình Gói cước (Tiers)</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Định nghĩa giá trị gói hội viên, hạn mức Quota và Đặc quyền sử dụng Portal.</p>
        </div>

        {/* Nút lưu xuất hiện khi ở Tab Đặc quyền */}
        {activeTab === 'permissions' && (
          <button onClick={saveTierMatrix} disabled={saving} className="px-8 py-3 bg-amber-500 text-[#002D62] text-sm font-black rounded-xl shadow-md disabled:bg-slate-400 hover:bg-amber-400 transition-colors">
            {saving ? 'ĐANG LƯU...' : 'LƯU ĐẶC QUYỀN'}
          </button>
        )}
      </div>

      {/* ĐIỀU HƯỚNG TABS */}
      <div className="flex flex-wrap gap-2 p-1 bg-white border border-slate-200 shadow-sm rounded-xl w-fit">
        <button onClick={() => setActiveTab('individual')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'individual' ? 'bg-[#002D62] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <i className="ph-fill ph-user mr-2"></i> Gói Cá nhân
        </button>
        <button onClick={() => setActiveTab('corporate')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'corporate' ? 'bg-[#002D62] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
          <i className="ph-fill ph-buildings mr-2"></i> Gói Doanh nghiệp & Quota
        </button>
        {/* THÊM TAB MỚI */}
        <button onClick={() => setActiveTab('permissions')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'permissions' ? 'bg-amber-400 text-amber-900 shadow-md' : 'text-slate-500 hover:text-amber-600'}`}>
          <i className="ph-fill ph-crown mr-2"></i> Đặc quyền Portal (Feature Flags)
        </button>
      </div>

      {/* TAB 1: GÓI CÁ NHÂN (GIỮ NGUYÊN CỦA BẠN) */}
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

      {/* TAB 2: GÓI DOANH NGHIỆP & QUOTA (GIỮ NGUYÊN CỦA BẠN) */}
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

      {/* TAB 3: ĐẶC QUYỀN PORTAL (MỚI THÊM VÀO ĐÂY) */}
      {activeTab === 'permissions' && (
        <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-200 shadow-sm overflow-x-auto animate-in slide-in-from-bottom-4">
          <div className="p-6 border-b border-amber-100 bg-amber-100/50">
            <h3 className="font-black text-amber-900 text-lg">Ma trận Đặc quyền (Feature Flags)</h3>
            <p className="text-sm text-amber-700 mt-1 font-medium">Bật/tắt các tính năng "mồi câu" và cao cấp hiển thị trên Member Portal cho từng hạng thẻ Cá nhân.</p>
          </div>
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr>
                <th className="p-5 border-b border-amber-100 sticky left-0 z-10 w-[300px] font-black text-amber-700 uppercase text-xs tracking-widest bg-white">Tính năng trên Portal</th>
                {indTiers.map(t => (
                  <th key={t.code} className="p-4 border-b border-l border-amber-100 bg-white text-center min-w-[140px]">
                    <div className={`inline-block px-3 py-1.5 rounded-lg border text-[11px] font-black uppercase tracking-wider ${t.code === 'VIP' ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                      {t.name} {t.code === 'VIP' && '👑'}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {PORTAL_FEATURES.map(feat => (
                <tr key={feat.code} className="hover:bg-white transition-colors">
                  <td className="p-4 border-r border-amber-50 sticky left-0 z-10 bg-amber-50/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600"><i className={`ph-fill ${feat.icon} text-xl`}></i></div>
                      <div><div className="font-bold text-slate-800 text-sm">{feat.name}</div><div className="text-[9px] text-amber-600 font-bold tracking-widest uppercase mt-1">{feat.code}</div></div>
                    </div>
                  </td>
                  {indTiers.map(tier => {
                    const hasAccess = tierMatrix[tier.code]?.[feat.code] || false;
                    const isVIP = tier.code === 'VIP';
                    return (
                      <td key={`${tier.code}-${feat.code}`} className="p-4 text-center border-l border-amber-50 bg-amber-50/10">
                        <label className={`inline-flex w-8 h-8 cursor-pointer ${isVIP ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110 transition-transform'}`}>
                          <input type="checkbox" className="peer sr-only" checked={hasAccess} onChange={() => toggleTierFeature(tier.code, feat.code)} disabled={isVIP} />
                          <div className={`w-6 h-6 m-auto rounded-md border-2 flex items-center justify-center transition-all ${hasAccess ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-amber-200 text-transparent'}`}><i className="ph-bold ph-check text-sm"></i></div>
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}