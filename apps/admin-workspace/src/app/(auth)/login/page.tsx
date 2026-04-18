'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  // DANH SÁCH QUYỀN ĐƯỢC PHÉP VÀO ADMIN WORKSPACE
  const ALLOWED_ADMIN_ROLES = ['ADMIN', 'STAFF', 'SUPER_ADMIN', 'ADMIN_BIZLINK', 'ADMIN_TALENT', 'ADMIN_INSIGHTS'];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. Xác thực bằng Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        throw new Error('Email hoặc mật khẩu không chính xác.');
      }

      // 2. Lấy Role và trạng thái từ bảng users
      const { data: userData, error: userError } = await supabase
        .from('employees') // Đổi từ 'users' sang 'employees' nếu bảng phân quyền admin là bảng employees 
        .select('role, is_active')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        await supabase.auth.signOut();
        throw new Error('Tài khoản của bạn chưa được thiết lập hồ sơ phân quyền.');
      }

      // 3. Kiểm tra tài khoản có bị khóa không
      if (!userData.is_active) {
        await supabase.auth.signOut();
        throw new Error('CẢNH BÁO: Tài khoản của bạn đã bị vô hiệu hóa.');
      }

      // 4. Kiểm tra phân quyền (Authorization Check)
      if (!ALLOWED_ADMIN_ROLES.includes(userData.role)) {
        await supabase.auth.signOut();
        throw new Error('TRUY CẬP BỊ TỪ CHỐI: Bạn không có thẩm quyền vào Admin Workspace!');
      }

      // Thành công! SSR Client sẽ tự động lo phần Cookie bảo mật.
      router.push('/');
      
    } catch (error: any) {
      console.error('Login Error:', error);
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b132b] w-full items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Hiệu ứng Ánh sáng Cyber/Admin */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[120px] translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4"></div>

      {/* Form Đăng nhập */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 p-8 md:p-10 rounded-3xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-500">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-widest">
            NKBA<span className="text-rose-500">.ADMIN</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium text-sm tracking-wide">Trung tâm Chỉ huy Hệ sinh thái</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-950/50 border-l-4 border-rose-500 text-rose-200 text-sm font-bold rounded-r-lg flex items-center gap-3">
            <i className="ph-fill ph-warning-octagon text-xl text-rose-500"></i>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Email Quản trị
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <i className="ph-fill ph-envelope-simple text-lg"></i>
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="w-full pl-11 pr-5 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition text-white placeholder:text-slate-600" 
                placeholder="admin@nkba.com" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Mật khẩu cấp phép
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <i className="ph-fill ph-lock-key text-lg"></i>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="w-full pl-11 pr-5 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition text-white placeholder:text-slate-600" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 text-white font-black tracking-wide rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
              isLoading 
                ? 'bg-slate-700 cursor-not-allowed opacity-70' 
                : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/30'
            }`}
          >
            {isLoading ? (
              <>
                <i className="ph ph-spinner animate-spin text-xl"></i>
                ĐANG XÁC THỰC...
              </>
            ) : (
              <>
                <span>XÁC THỰC QUYỀN TRUY CẬP</span>
                <i className="ph-bold ph-arrow-right text-lg"></i>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <a href="https://portal.nkba.vn/login" className="text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-1.5">
            <i className="ph-bold ph-arrow-left"></i>
            Quay lại cổng Hội viên
          </a>
        </div>

      </div>
    </div>
  );
}
