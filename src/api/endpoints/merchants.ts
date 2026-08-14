import { apiClient } from '../client';

interface Envelope<T> {
  data: T;
}

export interface MerchantProfile {
  id: string;
  userId: string;
  businessName: string;
  addressText: string;
  category: string | null;
  isVerified: boolean;
  phoneVisibility: 'always' | 'business_hours' | 'hidden';
  businessHoursStart: string | null;
  businessHoursEnd: string | null;
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
  businessHoursStart?: string;
  businessHoursEnd?: string;
  zaloEnabled?: boolean;
}

export async function updatePhoneVisibility(input: UpdatePhoneVisibilityInput): Promise<void> {
  await apiClient.patch('api/mobile/merchants/me/phone-visibility', { json: input });
}
