'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

// DANH SÁCH ICON THƯỜNG DÙNG CHO ADMIN DASHBOARD
const COMMON_ICONS = [
  'ph-squares-four', 'ph-users', 'ph-identification-badge', 'ph-buildings',
  'ph-shield-check', 'ph-lock-key', 'ph-wallet', 'ph-money',
  'ph-chart-bar', 'ph-chart-line-up', 'ph-gear', 'ph-wrench',
  'ph-briefcase', 'ph-kanban', 'ph-target', 'ph-compass',
  'ph-folder', 'ph-file-text', 'ph-bell', 'ph-envelope-simple',
  'ph-storefront', 'ph-shopping-cart', 'ph-globe', 'ph-handshake'
];

export default function DynamicRolesPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'matrix' | 'roles' | 'modules'>('matrix');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // States lưu dữ liệu Động
  const [roles, setRoles] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({});

  // States cho Form VAI TRÒ
  const [editingRoleCode, setEditingRoleCode] = useState<string | null>(null);
  const [newRole, setNewRole] = useState({ code: '', name: '', color: 'text-slate-600 bg-slate-100 border-slate-200' });

  // States cho Form PHÂN HỆ
  const [editingModPath, setEditingModPath] = useState<string | null>(null);
  const [newMod, setNewMod] = useState({ path: '', name: '', icon: 'ph-squares-four', sort_order: 0 });

  // 1. "HÚT" DỮ LIỆU TỪ 3 BẢNG CÙNG LÚC
  const fetchData = async () => {
    setLoading(true);
    const [rolesRes, modsRes, permsRes] = await Promise.all([
      supabase.from('app_roles').select('*').order('created_at', { ascending: true }),
      supabase.from('app_modules').select('*').order('sort_order', { ascending: true }),
      supabase.from('role_permissions').select('*')
    ]);

    const fetchedRoles = rolesRes.data || [];
    const fetchedMods = modsRes.data || [];
    setRoles(fetchedRoles);
    setModules(fetchedMods);

    const initialMatrix: Record<string, Record<string, boolean>> = {};
    fetchedRoles.forEach(r => {
      initialMatrix[r.code] = {};
      fetchedMods.forEach(m => {
        initialMatrix[r.code][m.path] = r.code === 'SUPER_ADMIN'; 
      });
    });

    if (permsRes.data) {
      permsRes.data.forEach(p => {
        if (initialMatrix[p.role_code] && p.module_path in initialMatrix[p.role_code]) {
          if (p.role_code !== 'SUPER_ADMIN') {
            initialMatrix[p.role_code][p.module_path] = p.can_access;
          }
        }
      });
    }

    setMatrix(initialMatrix);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // 2. LƯU CẤU HÌNH MA TRẬN
  const togglePermission = (roleCode: string, modulePath: string) => {
    if (roleCode === 'SUPER_ADMIN') return alert("Super Admin mặc định có toàn quyền, không thể tắt!");
    setMatrix(prev => ({ ...prev, [roleCode]: { ...prev[roleCode], [modulePath]: !prev[roleCode][modulePath] } }));
  };

  const saveMatrix = async () => {
    setSaving(true);
    const payload: any[] = [];
    roles.forEach(r => {
      modules.forEach(m => {
        payload.push({ role_code: r.code, module_path: m.path, can_access: matrix[r.code][m.path] });
      });
    });
    const { error } = await supabase.from('role_permissions').upsert(payload, { onConflict: 'role_code, module_path' });
    if (error) alert("Lỗi khi lưu: " + error.message);
    else alert("✅ Lưu Cấu hình Phân quyền thành công!");
    setSaving(false);
  };

  // ==========================================
  // 3. XỬ LÝ VAI TRÒ (THÊM / SỬA / XÓA)
  // ==========================================
  const handleSaveRole = async () => {
    if (!newRole.code || !newRole.name) return alert('Nhập đủ Mã và Tên Vai trò!');
    
    if (editingRoleCode) {
      // Cập nhật
      const { error } = await supabase.from('app_roles').update({ name: newRole.name, color: newRole.color }).eq('code', editingRoleCode);
      if (error) alert('Lỗi cập nhật: ' + error.message);
      else { alert('✅ Cập nhật Vai trò thành công!'); setEditingRoleCode(null); setNewRole({ code: '', name: '', color: 'text-slate-600 bg-slate-100 border-slate-200' }); fetchData(); }
    } else {
      // Thêm mới
      const payload = { ...newRole, code: newRole.code.toUpperCase().replace(/\s+/g, '_') };
      const { error } = await supabase.from('app_roles').insert([payload]);
      if (error) alert('Lỗi thêm mới: ' + error.message);
      else { alert('✅ Thêm Vai trò thành công!'); setNewRole({ code: '', name: '', color: 'text-slate-600 bg-slate-100 border-slate-200' }); fetchData(); }
    }
  };

  const handleDeleteRole = async (code: string) => {
    if (code === 'SUPER_ADMIN') return alert('Không thể xóa quyền SUPER_ADMIN cốt lõi!');
    if (!confirm(`Bạn có chắc muốn xóa vai trò [${code}]? Mọi dữ liệu phân quyền của vai trò này sẽ biến mất.`)) return;
    const { error } = await supabase.from('app_roles').delete().eq('code', code);
    if (error) alert('Lỗi xóa: ' + error.message); else fetchData();
  };

  // ==========================================
  // 4. XỬ LÝ PHÂN HỆ (THÊM / SỬA / XÓA)
  // ==========================================
  const handleSaveModule = async () => {
    if (!newMod.path || !newMod.name || !newMod.icon) return alert('Nhập đủ Đường dẫn, Tên và chọn Icon Phân hệ!');
    
    if (editingModPath) {
      // Cập nhật
      const { error } = await supabase.from('app_modules').update({ name: newMod.name, icon: newMod.icon }).eq('path', editingModPath);
      if (error) alert('Lỗi cập nhật: ' + error.message);
      else { alert('✅ Cập nhật Phân hệ thành công!'); setEditingModPath(null); setNewMod({ path: '', name: '', icon: 'ph-squares-four', sort_order: 0 }); fetchData(); }
    } else {
      // Thêm mới
      const { error } = await supabase.from('app_modules').insert([newMod]);
      if (error) alert('Lỗi thêm mới: ' + error.message);
      else { alert('✅ Thêm Phân hệ thành công!'); setNewMod({ path: '', name: '', icon: 'ph-squares-four', sort_order: 0 }); fetchData(); }
    }
  };

  const handleDeleteModule = async (path: string) => {
    if (!confirm(`Bạn có chắc muốn xóa phân hệ [${path}]?`)) return;
    const { error } = await supabase.from('app_modules').delete().eq('path', path);
    if (error) alert('Lỗi xóa: ' + error.message); else fetchData();
  };


  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">Đang nạp hệ thống cấu hình...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      
      {/* HEADER & TABS */}
      <div className="bg-white p-6 md:px-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#002D62]"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Quản trị Truy cập Hệ thống</h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">Thiết lập động Vai trò, Phân hệ và Ma trận kiểm soát (RBAC).</p>
          </div>
          {activeTab === 'matrix' && (
            <button onClick={saveMatrix} disabled={saving} className="px-8 py-3 bg-[#002D62] text-white text-sm font-bold rounded-xl shadow-md disabled:bg-slate-400">
              {saving ? 'ĐANG LƯU...' : 'LƯU MA TRẬN'}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-6 p-1 bg-slate-100 rounded-xl w-fit">
          <button onClick={() => setActiveTab('matrix')} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'matrix' ? 'bg-white text-[#002D62] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><i className="ph-fill ph-grid-nine mr-2"></i> Ma trận Phân quyền</button>
          <button onClick={() => setActiveTab('roles')} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'roles' ? 'bg-white text-[#002D62] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><i className="ph-fill ph-identification-badge mr-2"></i> Khai báo Vai trò</button>
          <button onClick={() => setActiveTab('modules')} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'modules' ? 'bg-white text-[#002D62] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><i className="ph-fill ph-stack mr-2"></i> Khai báo Phân hệ</button>
        </div>
      </div>

      {/* TAB 1: MA TRẬN PHÂN QUYỀN */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {roles.length === 0 || modules.length === 0 ? (
             <div className="p-10 text-center text-slate-500 font-medium">Vui lòng khai báo Vai trò và Phân hệ trước.</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr>
                  <th className="p-5 border-b bg-slate-50 sticky left-0 z-10 w-[250px] font-black text-slate-400 uppercase text-xs tracking-widest">Phân hệ (Module)</th>
                  {roles.map(r => (
                    <th key={r.code} className="p-4 border-b border-l bg-slate-50 text-center min-w-[140px]">
                      <div className={`inline-block px-3 py-1.5 rounded-lg border text-[11px] font-black uppercase tracking-wider ${r.color}`}>{r.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {modules.map(mod => (
                  <tr key={mod.path} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 border-r bg-white sticky left-0 z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500"><i className={`ph-fill ${mod.icon} text-xl`}></i></div>
                        <div><div className="font-bold text-slate-800 text-sm">{mod.name}</div><div className="text-[10px] text-blue-600 font-mono mt-0.5">{mod.path}</div></div>
                      </div>
                    </td>
                    {roles.map(role => {
                      const hasAccess = matrix[role.code]?.[mod.path] || false;
                      const isSuper = role.code === 'SUPER_ADMIN';
                      return (
                        <td key={`${role.code}-${mod.path}`} className="p-4 text-center border-l border-slate-100">
                          <label className={`inline-flex w-8 h-8 cursor-pointer ${isSuper ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110 transition-transform'}`}>
                            <input type="checkbox" className="peer sr-only" checked={hasAccess} onChange={() => togglePermission(role.code, mod.path)} disabled={isSuper} />
                            <div className={`w-6 h-6 m-auto rounded-md border-2 flex items-center justify-center transition-all ${hasAccess ? 'bg-[#002D62] border-[#002D62] text-white' : 'bg-white border-slate-300 text-transparent'}`}><i className="ph-bold ph-check text-sm"></i></div>
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 2: KHAI BÁO VAI TRÒ */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className={`bg-white p-6 rounded-2xl border shadow-sm sticky top-6 transition-all ${editingRoleCode ? 'ring-2 ring-amber-400 border-amber-200 bg-amber-50/30' : 'border-slate-200'}`}>
            <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
              <i className={`ph-bold ${editingRoleCode ? 'ph-pencil-simple text-amber-500' : 'ph-plus-circle text-blue-600'} text-xl`}></i> 
              {editingRoleCode ? 'Chỉnh sửa Vai trò' : 'Thêm Vai trò mới'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã Hệ thống (Code)</label>
                <input type="text" value={newRole.code} onChange={e => setNewRole({...newRole, code: e.target.value})} disabled={!!editingRoleCode} placeholder="VD: ADMIN_FINANCE" className="w-full h-11 px-4 border border-slate-200 rounded-xl mt-1 text-sm font-bold text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all uppercase disabled:bg-slate-100 disabled:text-slate-400" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên hiển thị</label>
                <input type="text" value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} placeholder="VD: Quản lý Tài chính" className="w-full h-11 px-4 border border-slate-200 rounded-xl mt-1 text-sm font-medium outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={handleSaveRole} className={`flex-1 h-12 text-white text-sm font-bold rounded-xl transition-all shadow-md ${editingRoleCode ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#002D62] hover:bg-blue-900'}`}>
                  {editingRoleCode ? 'CẬP NHẬT' : 'THÊM VAI TRÒ'}
                </button>
                {editingRoleCode && (
                  <button onClick={() => {setEditingRoleCode(null); setNewRole({code: '', name: '', color: 'text-slate-600 bg-slate-100 border-slate-200'})}} className="px-5 h-12 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all">HỦY</button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-5">Danh sách Vai trò Hệ thống</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roles.map(r => (
                <div key={r.code} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:border-slate-300 transition-colors group">
                  <div>
                    <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg border ${r.color}`}>{r.name}</span>
                    <div className="font-mono text-[10px] font-bold text-slate-400 mt-2">{r.code}</div>
                  </div>
                  {r.code !== 'SUPER_ADMIN' && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => {setEditingRoleCode(r.code); setNewRole({code: r.code, name: r.name, color: r.color})}} className="w-8 h-8 rounded bg-white border shadow-sm flex items-center justify-center text-amber-600 hover:bg-amber-50"><i className="ph-bold ph-pencil-simple"></i></button>
                      <button onClick={() => handleDeleteRole(r.code)} className="w-8 h-8 rounded bg-white border shadow-sm flex items-center justify-center text-rose-600 hover:bg-rose-50"><i className="ph-bold ph-trash"></i></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KHAI BÁO PHÂN HỆ */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className={`bg-white p-6 rounded-2xl border shadow-sm sticky top-6 transition-all ${editingModPath ? 'ring-2 ring-amber-400 border-amber-200 bg-amber-50/30' : 'border-slate-200'}`}>
            <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
              <i className={`ph-bold ${editingModPath ? 'ph-pencil-simple text-amber-500' : 'ph-plus-circle text-emerald-600'} text-xl`}></i> 
              {editingModPath ? 'Chỉnh sửa Phân hệ' : 'Thêm Phân hệ mới'}
            </h3>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đường dẫn (Path)</label>
                <input type="text" value={newMod.path} onChange={e => setNewMod({...newMod, path: e.target.value})} disabled={!!editingModPath} placeholder="VD: /finance" className="w-full h-11 px-4 border border-slate-200 rounded-xl mt-1 text-sm font-medium text-blue-600 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono disabled:bg-slate-100 disabled:text-slate-400" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên Phân hệ</label>
                <input type="text" value={newMod.name} onChange={e => setNewMod({...newMod, name: e.target.value})} placeholder="VD: Kế toán & Tài chính" className="w-full h-11 px-4 border border-slate-200 rounded-xl mt-1 text-sm font-medium outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all" />
              </div>
              
              {/* VÙNG CHỌN ICON (ICON PICKER) */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-between mb-3">
                  <span>Chọn Icon hiển thị</span>
                  {newMod.icon && <i className={`ph-fill ${newMod.icon} text-lg text-[#002D62]`}></i>}
                </label>
                
                <div className="grid grid-cols-6 gap-2 mb-3">
                  {COMMON_ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewMod({...newMod, icon})}
                      title={icon}
                      className={`h-9 rounded-lg flex items-center justify-center text-xl transition-all ${newMod.icon === icon ? 'bg-[#002D62] text-white shadow-md scale-110' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
                    >
                      <i className={`ph-fill ${icon}`}></i>
                    </button>
                  ))}
                </div>
                
                <input type="text" value={newMod.icon} onChange={e => setNewMod({...newMod, icon: e.target.value})} placeholder="Hoặc nhập tên icon..." className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs font-mono text-slate-500 outline-none focus:border-emerald-400 transition-all" />
              </div>

              <div className="flex gap-2 mt-4">
                <button onClick={handleSaveModule} className={`flex-1 h-12 text-white text-sm font-bold rounded-xl transition-all shadow-md ${editingModPath ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                  {editingModPath ? 'CẬP NHẬT' : 'THÊM PHÂN HỆ'}
                </button>
                {editingModPath && (
                  <button onClick={() => {setEditingModPath(null); setNewMod({path: '', name: '', icon: 'ph-squares-four', sort_order: 0})}} className="px-5 h-12 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all">HỦY</button>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-5">Danh sách Phân hệ (Menu)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {modules.map(m => (
                <div key={m.path} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm shrink-0">
                    <i className={`ph-fill ${m.icon} text-xl`}></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-slate-800 truncate">{m.name}</p>
                    <p className="font-mono text-[10px] text-emerald-600 truncate mt-0.5">{m.path}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => {setEditingModPath(m.path); setNewMod({path: m.path, name: m.name, icon: m.icon, sort_order: m.sort_order})}} className="w-8 h-8 rounded bg-white border shadow-sm flex items-center justify-center text-amber-600 hover:bg-amber-50"><i className="ph-bold ph-pencil-simple"></i></button>
                    <button onClick={() => handleDeleteModule(m.path)} className="w-8 h-8 rounded bg-white border shadow-sm flex items-center justify-center text-rose-600 hover:bg-rose-50"><i className="ph-bold ph-trash"></i></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}