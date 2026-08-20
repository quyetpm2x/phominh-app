import { toConnectionStatus } from '../lib/realtimeConnectionStatus';

describe('toConnectionStatus', () => {
  it('SUBSCRIBED → live', () => {
    expect(toConnectionStatus('SUBSCRIBED')).toBe('live');
  });

  it('TIMED_OUT/CLOSED/CHANNEL_ERROR → offline', () => {
    expect(toConnectionStatus('TIMED_OUT')).toBe('offline');
    expect(toConnectionStatus('CLOSED')).toBe('offline');
    expect(toConnectionStatus('CHANNEL_ERROR')).toBe('offline');
  });
});
