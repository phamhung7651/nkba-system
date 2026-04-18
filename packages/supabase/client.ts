import { createClient } from '@supabase/supabase-js'

// Kiểm tra xem biến môi trường đã được load chưa
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Thiếu biến môi trường: NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Khởi tạo và export client để các App khác dùng chung
export const supabase = createClient(supabaseUrl, supabaseAnonKey)