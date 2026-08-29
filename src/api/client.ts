import ky, { HTTPError } from 'ky';
import * as SecureStore from 'expo-secure-store';


const ACCESS_TOKEN_KEY = 'pho_minh_access_token';
const REFRESH_TOKEN_KEY = 'pho_minh_refresh_token';
export interface Envelope<T> {
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
