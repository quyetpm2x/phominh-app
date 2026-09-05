
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
  success: {
    50: '#e7f9ee',
    100: '#c3f0d6',
    DEFAULT: '#22C55E',
    dark: '#16a34a',
    text: '#15803d',
  },
  ink: {
    DEFAULT: '#292524',
    soft: '#6a6a6a',
  },
  muted: {
    DEFAULT: '#A6A09B',
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
