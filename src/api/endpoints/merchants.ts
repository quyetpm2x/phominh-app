import { apiClient } from '../client';

interface Envelope<T> {
  data: T;
}

// Lịch giờ hiện SĐT/Zalo cho 1 ngày trong tuần (mục 43) — 0=Chủ nhật..6=Thứ Bảy, khớp Date.getDay().
export interface DayBusinessHour {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface MerchantProfile {
  id: string;
  userId: string;
  businessName: string;
  addressText: string;
  category: string | null;
  isVerified: boolean;
  phoneVisibility: 'always' | 'business_hours' | 'hidden';
  businessHours: DayBusinessHour[];
  zaloEnabled: boolean;
}

export interface RegisterMerchantInput {
  businessName: string;
  addressText: string;
  lat: number;
  lng: number;
  category?: string;
}

// Đăng ký tài khoản quán (mục 39) — tự động isVerified=true ngay (đã bỏ yêu cầu chụp mặt tiền).
export async function registerMerchant(input: RegisterMerchantInput): Promise<MerchantProfile> {
  const res = await apiClient
    .post('api/mobile/merchants', { json: input })
    .json<Envelope<MerchantProfile>>();
  return res.data;
}

export async function fetchMyMerchantProfile(): Promise<MerchantProfile> {
  const res = await apiClient.get('api/mobile/merchants/me').json<Envelope<MerchantProfile>>();
  return res.data;
}

export interface MerchantDashboard {
  merchant: MerchantProfile;
  activePost: {
    id: string;
    content: string;
    imageUrl: string | null;
    createdAt: string;
    expiresAt: string | null;
    voteCount: number;
    commentCount: number;
    viewCount: number;
  } | null;
}

// Dashboard quán (mục 40) — bài merchant đang hoạt động + đếm ngược.
export async function fetchMerchantDashboard(): Promise<MerchantDashboard> {
  const res = await apiClient
    .get('api/mobile/merchants/me/dashboard')
    .json<Envelope<MerchantDashboard>>();
  return res.data;
}

// Thống kê lượt xem 7 ngày (mục 44) — chỉ tổng số, không lộ danh tính người xem (đã chốt với user).
export async function fetchMerchantStats(): Promise<{ totalViews: number; dailyCounts: number[] }> {
  const res = await apiClient
    .get('api/mobile/merchants/me/stats')
    .json<Envelope<{ totalViews: number; dailyCounts: number[] }>>();
  return res.data;
}

export interface UpdatePhoneVisibilityInput {
  phoneVisibility: 'always' | 'business_hours' | 'hidden';
  // undefined = giữ nguyên lịch đã lưu; [] = xoá hết; có giá trị = THAY TOÀN BỘ lịch cũ (mục 43).
  businessHours?: DayBusinessHour[];
  zaloEnabled?: boolean;
}

export async function updatePhoneVisibility(input: UpdatePhoneVisibilityInput): Promise<void> {
  await apiClient.patch('api/mobile/merchants/me/phone-visibility', { json: input });
}

// Quản lý ảnh Menu (mục 42) — tách khỏi feed, không tính vào xếp hạng độ mới.
export interface MenuPhoto {
  id: string;
  url: string;
  caption: string | null;
  sortOrder: number;
  createdAt: string;
}

export async function fetchMenuPhotos(): Promise<MenuPhoto[]> {
  const res = await apiClient
    .get('api/mobile/merchants/me/menu-photos')
    .json<Envelope<MenuPhoto[]>>();
  return res.data;
}

export async function addMenuPhoto(url: string, caption?: string): Promise<MenuPhoto> {
  const res = await apiClient
    .post('api/mobile/merchants/me/menu-photos', { json: { url, caption } })
    .json<Envelope<MenuPhoto>>();
  return res.data;
}

export async function deleteMenuPhoto(id: string): Promise<void> {
  await apiClient.delete(`api/mobile/merchants/me/menu-photos/${id}`);
}

// Lịch sử thanh toán gói (mục 46) — backend GET /me/payments đã có sẵn từ trước, mobile chưa có
// hàm client/màn hình nào gọi tới.
export interface MerchantPayment {
  id: string;
  amount: number;
  provider: 'vnpay' | 'momo' | 'zalopay';
  status: string;
  createdAt: string;
  subscription: { planKey: string; expiresAt: string } | null;
}

export async function fetchMerchantPayments(): Promise<MerchantPayment[]> {
  const res = await apiClient
    .get('api/mobile/merchants/me/payments')
    .json<Envelope<MerchantPayment[]>>();
  return res.data;
}
