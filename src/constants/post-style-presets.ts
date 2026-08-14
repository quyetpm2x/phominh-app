import { colors } from './design-tokens';

// Style toàn bộ nội dung bài đăng (mục 22) — giống Instagram/Threads Story text tool: chọn 1 màu
// chữ + 1 nền + 1 cỡ chữ cho CẢ đoạn text, không phải rich text nhiều style/đoạn (đã chốt với user).
// Danh sách preset lấy từ design-tokens sẵn có để đồng bộ giao diện, không bịa màu mới.
export interface TextColorPreset {
  label: string;
  value: string | null; // null = mặc định (text-ink hiện tại), không gửi field lên server
}

export const TEXT_COLOR_PRESETS: TextColorPreset[] = [
  { label: 'Mặc định', value: null },
  { label: 'Trắng', value: '#FFFFFF' },
  { label: 'Xanh lá', value: colors.primary.DEFAULT },
  { label: 'Vàng', value: colors.accent.DEFAULT },
  { label: 'Đỏ', value: colors.danger.DEFAULT },
];

export interface BackgroundColorPreset {
  label: string;
  value: string | null; // null = không nền (mặc định hiện tại)
}

export const BACKGROUND_COLOR_PRESETS: BackgroundColorPreset[] = [
  { label: 'Không nền', value: null },
  { label: 'Kem', value: colors.cream.dark },
  { label: 'Xanh nhạt', value: colors.primary[50] },
  { label: 'Vàng nhạt', value: colors.accent[50] },
  { label: 'Đỏ nhạt', value: colors.danger[50] },
  { label: 'Đen', value: colors.ink.DEFAULT },
];

export type PostFontSize = 'small' | 'medium' | 'large';

export const FONT_SIZE_PRESETS: { label: string; value: PostFontSize; px: number; lineHeight: number }[] = [
  { label: 'Nhỏ', value: 'small', px: 13, lineHeight: 19 },
  { label: 'Vừa', value: 'medium', px: 14.5, lineHeight: 22 },
  { label: 'Lớn', value: 'large', px: 17, lineHeight: 25 },
];

export const DEFAULT_FONT_SIZE: PostFontSize = 'medium';

export function fontSizeToStyle(fontSize: PostFontSize | null | undefined) {
  const preset = FONT_SIZE_PRESETS.find((f) => f.value === (fontSize ?? DEFAULT_FONT_SIZE));
  return { fontSize: preset?.px ?? 14.5, lineHeight: preset?.lineHeight ?? 22 };
}
