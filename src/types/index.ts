// Copy tay từ web + app/web/packages/shared-types — KHÔNG import từ Web (mục 1 tài liệu FE).
// Khi backend đổi cấu trúc dữ liệu, cập nhật CẢ HAI nơi.
export interface Post {
  id: string;
  authorId: string;
  content: string;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  createdAt: string;
  expiresAt: string;
  voteCount: number;
  commentCount: number;
  isMerchantPost: boolean;
}

export interface User {
  id: string;
  phoneNumber: string;
  displayName: string | null;
  trustScore: number;
  createdAt: string;
  isBanned: boolean;
}

export interface MerchantProfile {
  id: string;
  userId: string;
  businessName: string;
  address: string;
  zaloPhoneNumber: string | null;
  visiblePhoneStart: string | null;
  visiblePhoneEnd: string | null;
  isVerified: boolean;
  freeMonthsRemaining: number;
}
