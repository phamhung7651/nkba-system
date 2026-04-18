import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 1. DÒNG NÀY RẤT QUAN TRỌNG ĐỂ DEBUG: In ra Terminal xem Next.js có đọc được file .env không
console.log("👉 [DEBUG SUPABASE] URL:", supabaseUrl);
console.log("👉 [DEBUG SUPABASE] KEY:", supabaseKey ? "Đã nhận được Key" : "THIẾU KEY!");

// 2. Ép hệ thống báo lỗi ngay lập tức nếu thiếu biến môi trường, thay vì âm thầm chạy sai
if (!supabaseUrl || !supabaseKey) {
  throw new Error("❌ BÁO ĐỘNG: Thiếu biến môi trường Supabase! Hãy kiểm tra lại file .env.local trong thư mục app này.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);