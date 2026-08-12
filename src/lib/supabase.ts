import { createClient } from '@supabase/supabase-js';

// Supabase client — CHỈ dùng cho Realtime (đọc bình luận), ngoại lệ duy nhất còn lại được
// gọi trực tiếp từ client (backend/README.md §"Ranh giới bảo mật", tai-lieu-cong-nghe-backend.md §6).
//
// OTP KHÔNG dùng Supabase Auth — NestJS tự quản lý toàn bộ vòng đời OTP qua eSMS và tự ký JWT
// riêng (xem tai-lieu-chi-tiet-chuc-nang.md, phụ lục "Nhập số điện thoại & Xác thực OTP"; luồng
// thật nằm ở src/api/client.ts: sendOtp/verifyOtp gọi thẳng NestJS, không đụng tới supabase.auth).
// Vì vậy client này không cấu hình `auth` (không có session Supabase nào để lưu/refresh).
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
// "Publishable key" (sb_publishable_...) — bản thay thế "anon key" kiểu JWT cũ, an toàn để
// nhúng vào client (khác hẳn Secret Key/Service Role Key, chỉ được nằm trong backend/.env).
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
