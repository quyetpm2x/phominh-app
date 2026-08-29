// Bảng màu ĐÃ REBRAND (2026-08-24, xác nhận với người dùng) — chuyển từ tông xanh lá + kem ấm
// ("Phố Mình mobile app" option 1a) sang tông hồng-cam + trắng-xám lạnh, dùng đúng mã màu người
// dùng chọn qua công cụ theme editor (khớp bảng SPLASH_* trước đó CHỈ dùng riêng ở Splash.tsx —
// nay áp dụng cho TOÀN APP, không còn lệch tone giữa Splash và phần còn lại nữa). Các sắc độ phụ
// (50/100/300/dark/soft/light/faint...) không có mã màu gốc — tự tính bằng cách pha với trắng/đen
// theo đúng tỉ lệ tương đối của scale cũ, không phải giá trị người dùng tự chọn từng ô.
// Web (`web-app/web/packages/design-tokens/`) KHÔNG đổi theo, vẫn tách biệt hoàn toàn (mục 1 tài liệu FE).
// `danger.DEFAULT`/`cream.surface` cập nhật thêm khi có file HTML gốc của công cụ theme editor —
// lộ ra đúng mã `--destructive` (#E63946) và `--muted` (#F1F3F5) chính thức, thay cho giá trị đoán
// trước đó (giữ nguyên phần "tự tính" cho các sắc độ phụ không có trong file gốc).
// ĐÍNH CHÍNH (cùng ngày): có lúc xuất hiện file `src/constants/onboardingAccent.ts` tách riêng,
// tưởng lầm hồng-cam CHỈ dành cho Splash/Welcome — SAI, đã xác nhận lại: hồng-cam áp dụng TOÀN
// APP đúng như file này. `onboardingAccent.ts` đã xoá, Splash.tsx/welcome.tsx chuyển dùng thẳng
// `colors` ở đây (thêm `primary.peach` cho đúng 1 giá trị riêng Splash từng có mà ở đây chưa có).
export const colors = {
  primary: {
    50: '#ffecf0',
    100: '#ffd5df',
    300: '#ff6386',
    DEFAULT: '#FF416C',
    dark: '#d13559',
    darker: '#1A1A1A',
    peach: '#FF8C68',
  },
  accent: {
    50: '#ffedea',
    100: '#ffd7d0',
    200: '#ffaea0',
    300: '#ff6b51',
    DEFAULT: '#FF4B2B',
    text: '#b2341e',
  },
  danger: {
    50: '#fcebec',
    100: '#fad3d6',
    200: '#f4a6ac',
    DEFAULT: '#E63946',
    text: '#ac2b34',
  },
  // Xanh lá "thành công" — mới thêm (2026-08-25), KHÔNG phải xanh lá thương hiệu cũ đã bỏ hẳn khi
  // rebrand. Chỉ dùng làm tín hiệu trạng thái hợp lệ (vd viền/glow ô nhập SĐT khi số đã đúng định
  // dạng), không dùng làm màu chủ đạo ở bất kỳ đâu khác.
  success: {
    50: '#e7f9ee',
    100: '#c3f0d6',
    DEFAULT: '#22C55E',
    dark: '#16a34a',
    text: '#15803d',
  },
  ink: {
    DEFAULT: '#1A1A1A',
    soft: '#6a6a6a',
  },
  muted: {
    DEFAULT: '#4A4A4A',
    light: '#aeaeae',
    faint: '#808080',
  },
  cream: {
    DEFAULT: '#F8F9FA',
    dark: '#f1f2f2',
    surface: '#F1F3F5',
  },
  border: {
    DEFAULT: '#E9ECEF',
    soft: '#f4f6f7',
    strong: '#cdd0d2',
  },
  freshness: {
    fresh: '#FF416C',
    aging: '#FF4B2B',
    stale: '#aeaeae',
  },
  trust: {
    verified: '#FF416C',
  },
  map: {
    DEFAULT: '#e9e6df',
    road: '#dfdbd1',
  },
  background: '#e4e5e6',
} as const;

export const fontFamily = {
  sans: 'BeVietnamPro_400Regular',
  'sans-medium': 'BeVietnamPro_500Medium',
  'sans-semibold': 'BeVietnamPro_600SemiBold',
  'sans-bold': 'BeVietnamPro_700Bold',
  'sans-black': 'BeVietnamPro_900Black',
  mono: 'JetBrainsMono_400Regular',
  'mono-medium': 'JetBrainsMono_500Medium',
  'mono-bold': 'JetBrainsMono_700Bold',
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48 } as const;
