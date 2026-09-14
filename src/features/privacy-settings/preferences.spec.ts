import { DEFAULT_PREFERENCES, restorePreferences } from './preferences';
describe('privacy preference restoration', () => {
  it('restores defaults for missing or unreadable data', () => {
    for (const raw of [null, '{', 'null', '42']) expect(restorePreferences(raw)).toEqual(DEFAULT_PREFERENCES);
  });
  it('preserves explicitly disabled switches and message audience', () => {
    const saved = {
      approximateDistance: false,
      hideHome: false,
      discoverable: false,
      online: true,
      messageAudience: 'nobody',
    };
    expect(restorePreferences(JSON.stringify(saved))).toEqual(saved);
  });
  it('keeps valid fields while rejecting invalid types and prototype keys', () => {
    expect(
      restorePreferences(JSON.stringify({ hideHome: false, online: 'true', messageAudience: 'toString' })),
    ).toEqual({ ...DEFAULT_PREFERENCES, hideHome: false });
  });
});
