// Bảng màu lấy từ thiết kế claude.ai/design "Phố Mình mobile app" (Phố Mình.dc.html, option 1a).
// Thay thế bảng "Vàng kim + Bạc + Ngọc" cũ ở tai-lieu-cong-nghe-frontend.md §9 — bảng đó đã lỗi thời
// so với thiết kế thực tế đang triển khai. Web (`web + app/web/packages/design-tokens/`) KHÔNG đổi theo,
// vẫn tách biệt hoàn toàn (mục 1 tài liệu FE).
export const colors = {
  primary: {
    50: '#e4f0e9',
    100: '#cfe3d8',
    300: '#2a8a66',
    DEFAULT: '#1f6f52',
    dark: '#16523c',
    darker: '#17150f',
  },
  accent: {
    50: '#f6ecd4',
    100: '#f0dfa8',
    200: '#e8dcb8',
    300: '#c9a227',
    DEFAULT: '#a8801a',
    text: '#8a6d1a',
  },
  danger: {
    50: '#fdf1ee',
    100: '#f3d6cd',
    200: '#e2b3a4',
    DEFAULT: '#b8482a',
    text: '#8f3a22',
  },
  ink: {
    DEFAULT: '#17150f',
    soft: '#2c2a24',
  },
  muted: {
    DEFAULT: '#5d5950',
    light: '#a8a297',
    faint: '#7d786d',
  },
  cream: {
    DEFAULT: '#faf8f5',
    dark: '#f6f4f0',
    surface: '#f1eee7',
  },
  border: {
    DEFAULT: '#e6e2da',
    soft: '#f0ece4',
    strong: '#d8d3c9',
  },
  freshness: {
    fresh: '#1f6f52',
    aging: '#c9a227',
    stale: '#a8a297',
  },
  trust: {
    verified: '#1f6f52',
  },
  map: {
    DEFAULT: '#e9e6df',
    road: '#dfdbd1',
  },
  background: '#eeece7',
} as const;

export const fontFamily = {
  sans: 'BeVietnamPro_400Regular',
  'sans-medium': 'BeVietnamPro_500Medium',
  'sans-semibold': 'BeVietnamPro_600SemiBold',
  'sans-bold': 'BeVietnamPro_700Bold',
  mono: 'JetBrainsMono_400Regular',
  'mono-medium': 'JetBrainsMono_500Medium',
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48 } as const;
