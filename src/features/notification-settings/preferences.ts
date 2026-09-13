export type QuietPreset = 'night' | 'nap' | 'custom';
export interface NotificationPreferences {
  comments: boolean;
  mentions: boolean;
  quietEnabled: boolean;
  preset: QuietPreset;
  customStart: number;
  customEnd: number;
}
export const DEFAULT_PREFERENCES: NotificationPreferences = {
  comments: true,
  mentions: true,
  quietEnabled: true,
  preset: 'night',
  customStart: 23 * 60,
  customEnd: 7 * 60,
};
export function formatTime(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}
export function quietRange(preferences: NotificationPreferences): [number, number] {
  return preferences.preset === 'night'
    ? [1320, 420]
    : preferences.preset === 'nap'
      ? [720, 810]
      : [preferences.customStart, preferences.customEnd];
}
export function quietDuration(start: number, end: number) {
  const minutes = (end - start + 1440) % 1440;
  return `${Math.floor(minutes / 60) ? `${Math.floor(minutes / 60)} giờ` : ''}${minutes % 60 ? ` ${minutes % 60} phút` : ''}`.trim();
}
export function restorePreferences(raw: string | null): NotificationPreferences {
  try {
    const value: unknown = JSON.parse(raw ?? 'null');
    if (!value || typeof value !== 'object') return { ...DEFAULT_PREFERENCES };
    const p = value as NotificationPreferences;
    if (
      typeof p.comments !== 'boolean' ||
      typeof p.mentions !== 'boolean' ||
      typeof p.quietEnabled !== 'boolean' ||
      !['night', 'nap', 'custom'].includes(p.preset) ||
      ![p.customStart, p.customEnd].every((n) => Number.isInteger(n) && n >= 0 && n < 1440) ||
      p.customStart === p.customEnd
    )
      return { ...DEFAULT_PREFERENCES };
    return p;
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}
