import ky, { HTTPError } from 'ky';
import * as SecureStore from 'expo-secure-store';

// ky instance riêng của Mobile, gắn expo-secure-store (mục 1, 2, 6 tài liệu FE).
// KHÔNG dùng AsyncStorage — không mã hóa.
const ACCESS_TOKEN_KEY = 'pho_minh_access_token';
const REFRESH_TOKEN_KEY = 'pho_minh_refresh_token';

// Mọi response thành công từ backend đều bọc trong { data: ... } (TransformInterceptor).
interface Envelope<T> {
  data: T;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

async function saveTokens(tokens: TokenPair): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
  ]);
}

async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);
}

let refreshPromise: Promise<string | null> | null = null;

// Refresh token XOAY VÒNG — mỗi lần gọi, backend revoke token cũ và cấp cặp mới (token.service.ts).
// Phải lưu lại CẢ 2 token mới, không chỉ accessToken, nếu không lần refresh sau sẽ dùng refresh
// token đã bị revoke và thất bại.
async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!refreshToken) return null;

    try {
      const res = await ky
        .post('api/mobile/auth/refresh', {
          prefixUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
          json: { refreshToken },
        })
        .json<Envelope<TokenPair>>();
      await saveTokens(res.data);
      return res.data.accessToken;
    } catch {
      await clearTokens();
      return null;
    }
  })().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

export const apiClient = ky.create({
  prefixUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        if (response.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            request.headers.set('Authorization', `Bearer ${newToken}`);
            return ky(request);
          }
          await clearTokens();
        }
        return response;
      },
    ],
  },
});

// ===== Auth: gửi/xác thực OTP (backend/src/modules/auth) =====

export async function sendOtp(phone: string, captchaToken?: string): Promise<{ retryAfter: number }> {
  const res = await apiClient
    .post('api/mobile/auth/send-otp', { json: { phone, captchaToken } })
    .json<Envelope<{ retryAfter: number }>>();
  return res.data;
}

export interface UserProfile {
  id: string;
  alias: string;
  realName: string | null;
  avatarUrl: string | null;
  trustTier: number;
  trustBadgeLabel: string;
  pointsToNextTier: number | null;
  createdAt: string;
}

export async function verifyOtp(phone: string, otp: string): Promise<{ user: UserProfile; restored: boolean }> {
  const res = await apiClient
    .post('api/mobile/auth/verify-otp', { json: { phone, otp } })
    .json<Envelope<{ tokens: TokenPair; user: UserProfile; restored: boolean }>>();
  await saveTokens(res.data.tokens);
  return { user: res.data.user, restored: res.data.restored };
}

// Đăng xuất (mục 72) — PHẢI gọi backend thu hồi refresh token TRƯỚC khi xoá khỏi SecureStore, nếu
// không backend vẫn coi token đó còn hiệu lực (dùng được tới khi hết hạn tự nhiên, 60 ngày) dù
// client đã "đăng xuất". Không throw nếu gọi backend lỗi — vẫn phải xoá token cục bộ để user thoát
// ra được, lỗi mạng không nên chặn đăng xuất.
export async function logout(): Promise<void> {
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  if (refreshToken) {
    try {
      await apiClient.post('api/mobile/auth/logout', { json: { refreshToken } });
    } catch {
      // im lặng — vẫn xoá token cục bộ bên dưới dù backend không gọi được.
    }
  }
  await clearTokens();
}

export async function getMe(): Promise<UserProfile> {
  const res = await apiClient.get('api/mobile/auth/me').json<Envelope<UserProfile>>();
  return res.data;
}

// Gọi lúc mở app (app/index.tsx) để biết còn phiên đăng nhập hợp lệ không, tránh bắt nhập lại SĐT
// mỗi lần mở app. GET /auth/me yêu cầu JWT hợp lệ — nếu access token hết hạn, hook afterResponse
// trong apiClient (đã có sẵn ở trên) tự thử refresh bằng refresh token trước khi trả lỗi, nên hàm
// này tự động "chịu" được trường hợp access token hết hạn nhưng refresh token vẫn còn.
export async function checkSession(): Promise<boolean> {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  ]);
  if (!accessToken && !refreshToken) return false;

  try {
    await getMe();
    return true;
  } catch {
    await clearTokens();
    return false;
  }
}

// ===== Notifications: đăng ký push token (backend/src/modules/notifications) =====

export async function registerPushToken(token: string, platform: 'ios' | 'android'): Promise<void> {
  await apiClient.post('api/mobile/notifications/push-tokens', { json: { token, platform } });
}

// ===== Users: khu vực cố định Nhà/Chỗ làm (backend/src/modules/users) =====

export interface SetFixedAreaInput {
  label: 'home' | 'work';
  addressText: string;
  lat: number;
  lng: number;
  radiusKm: number;
}

export async function setFixedArea(input: SetFixedAreaInput): Promise<void> {
  await apiClient.post('api/mobile/users/me/areas', { json: input });
}

export interface FixedArea {
  id: string;
  label: 'home' | 'work';
  addressText: string;
  lat: number;
  lng: number;
  radiusKm: number;
}

export async function getFixedAreas(): Promise<FixedArea[]> {
  const res = await apiClient.get('api/mobile/users/me/areas').json<Envelope<FixedArea[]>>();
  return res.data;
}

// Đăng bài/upload ảnh (uploadPostImage, createPost) chuyển sang src/api/endpoints/posts.ts — gộp
// chung với các hàm đọc bài (fetchNearbyPosts, fetchPost...) đã ở đó từ trước, đỡ tách 2 nơi.

// Đọc message lỗi chuẩn hoá từ HttpExceptionFilter ({ message: string | string[] }) — dùng ở màn
// hình để hiện đúng lý do lỗi thay vì chuỗi chung chung "Đã có lỗi xảy ra".
export async function extractErrorMessage(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const body = await error.response.json<{ message: string | string[] }>();
      return Array.isArray(body.message) ? body.message.join('\n') : body.message;
    } catch {
      return 'Đã có lỗi xảy ra, vui lòng thử lại';
    }
  }
  return 'Không kết nối được máy chủ, kiểm tra mạng và thử lại';
}
