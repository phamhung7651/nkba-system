'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function EmployeeRolesPage() {
  const supabase = createClient();
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const SYSTEM_ROLES = [
    { value: 'SUPER_ADMIN', label: 'Super Admin', color: 'bg-rose-100 text-rose-700' },
    { value: 'ADMIN', label: 'Admin Tổng', color: 'bg-indigo-100 text-indigo-700' },
    { value: 'STAFF', label: 'Nhân viên', color: 'bg-slate-100 text-slate-700' },
    { value: 'ADMIN_BIZLINK', label: 'Quản lý Biz-Link', color: 'bg-amber-100 text-amber-700' },
    { value: 'ADMIN_TALENT', label: 'Quản lý Nhân sự', color: 'bg-emerald-100 text-emerald-700' },
  ];

  const fetchData = async () => {
    setLoading(true);
    const [empRes, deptRes] = await Promise.all([
      supabase.from('employees').select('id, code, name, email, role, is_active, department_ids').order('created_at', { ascending: false }),
      supabase.from('departments').select('id, name')
    ]);
    if (empRes.data) setEmployees(empRes.data);
    if (deptRes.data) setDepartments(deptRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleRoleChange = async (employeeId: string, newRole: string) => {
    const { error } = await supabase.from('employees').update({ role: newRole }).eq('id', employeeId);
    if (!error) setEmployees(employees.map(emp => emp.id === employeeId ? { ...emp, role: newRole } : emp));
  };

  const handleToggleActive = async (employeeId: string, currentStatus: boolean) => {
    const { error } = await supabase.from('employees').update({ is_active: !currentStatus }).eq('id', employeeId);
    if (!error) setEmployees(employees.map(emp => emp.id === employeeId ? { ...emp, is_active: !currentStatus } : emp));
  };

  const getDeptName = (deptId: string) => departments.find(d => d.id === deptId)?.name || 'N/A';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Phân quyền Hệ thống</h2>
          <p className="text-sm text-slate-500 font-medium">Thiết lập vai trò truy cập Admin Workspace (Cấu hình chức vụ và Email bên phần Tổ chức).</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4">Mã NV</th>
                <th className="px-6 py-4">Nhân sự & Tài khoản</th>
                <th className="px-6 py-4">Đơn vị công tác</th>
                <th className="px-6 py-4">Vai trò hệ thống</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thiết lập quyền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400">Đang tải...</td></tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4"><span className="font-black text-[#002D62] bg-blue-50 px-2 py-1 rounded-md text-xs">{emp.code}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-black">{emp.name.charAt(0)}</div>
                        <div>
                          <div className="font-bold text-slate-900">{emp.name}</div>
                          {emp.email ? (
                            <div className="text-xs text-slate-500 mt-0.5"><i className="ph-fill ph-envelope-simple"></i> {emp.email}</div>
                          ) : (
                            <Link href="/organization" className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 mt-1 flex items-center gap-1"><i className="ph-bold ph-warning-circle"></i> Sửa ở Tổ chức</Link>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[200px]">
                      {(!emp.department_ids || emp.department_ids.length === 0) ? <span className="text-slate-400 text-xs italic">Chưa phân bổ</span> : (
                        <div className="flex flex-wrap gap-1">
                          {emp.department_ids.map((id: string) => <span key={id} className="px-2 py-0.5 bg-white text-slate-700 text-[10px] font-bold rounded border shadow-sm whitespace-nowrap">{getDeptName(id)}</span>)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const roleObj = SYSTEM_ROLES.find(r => r.value === emp.role);
                        return <span className={`px-3 py-1 rounded-full text-xs font-bold border ${roleObj ? roleObj.color : 'bg-slate-50'}`}>{roleObj ? roleObj.label : emp.role}</span>;
                      })()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleToggleActive(emp.id, emp.is_active)} className={`px-3 py-1.5 rounded-md text-xs font-bold border ${emp.is_active ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                        {emp.is_active ? 'Hoạt động' : 'Đã khóa'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={emp.role || ''}
                        onChange={(e) => handleRoleChange(emp.id, e.target.value)}
                        className="text-sm font-bold text-slate-700 bg-white border rounded-lg px-3 py-2 cursor-pointer outline-none"
                        disabled={!emp.email}
                      >
                        <option value="" disabled>-- Đổi quyền --</option>
                        {SYSTEM_ROLES.map(role => <option key={role.value} value={role.value}>{role.label}</option>)}
                      </select>
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