import {
  DEFAULT_PREFERENCES,
  formatTime,
  quietDuration,
  quietRange,
  restorePreferences,
} from './preferences';

test('overnight and midday quiet windows retain their duration', () => {
  expect(quietDuration(1380, 420)).toBe('8 giờ');
  expect(quietDuration(720, 810)).toBe('1 giờ 30 phút');
  expect(quietDuration(1425, 0)).toBe('15 phút');
  expect(formatTime(0)).toBe('00:00');
});
test('presets do not overwrite the saved custom window', () => {
  const preferences = { ...DEFAULT_PREFERENCES, customStart: 1200, customEnd: 360 };
  expect(quietRange(preferences)).toEqual([1320, 420]);
  expect(quietRange({ ...preferences, preset: 'nap' })).toEqual([720, 810]);
  expect(quietRange({ ...preferences, preset: 'custom' })).toEqual([1200, 360]);
});
test('saved toggles and custom times survive serialization', () => {
  const saved = {
    ...DEFAULT_PREFERENCES,
    comments: false,
    quietEnabled: false,
    preset: 'custom' as const,
    customStart: 0,
    customEnd: 60,
  };
  expect(restorePreferences(JSON.stringify(saved))).toEqual(saved);
});
test.each([
  null,
  'invalid',
  '{}',
  JSON.stringify({ ...DEFAULT_PREFERENCES, customStart: -1 }),
  JSON.stringify({ ...DEFAULT_PREFERENCES, customEnd: 1440 }),
  JSON.stringify({ ...DEFAULT_PREFERENCES, customStart: 420 }),
  JSON.stringify({ ...DEFAULT_PREFERENCES, preset: 'unknown' }),
])('corrupt saved settings fall back safely: %s', (raw) => {
  expect(restorePreferences(raw)).toEqual(DEFAULT_PREFERENCES);
});
