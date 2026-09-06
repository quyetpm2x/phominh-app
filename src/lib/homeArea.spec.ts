import { parseHomeArea } from './homeArea';

describe('parseHomeArea', () => {
  it('restores coordinates and radius without retaining unrelated data', () => {
    expect(
      parseHomeArea(JSON.stringify({ latitude: 21.03, longitude: 105.78, radiusKm: 1.5, ignored: true })),
    ).toEqual({ latitude: 21.03, longitude: 105.78, radiusKm: 1.5 });
  });
  it.each([
    null,
    '',
    '{',
    'null',
    '{}',
    '{"latitude":91,"longitude":105,"radiusKm":1}',
    '{"latitude":21,"longitude":181,"radiusKm":1}',
    '{"latitude":21,"longitude":105,"radiusKm":0}',
    '{"latitude":21,"longitude":105,"radiusKm":6}',
    '{"latitude":"21","longitude":105,"radiusKm":1}',
  ])('rejects invalid saved state %s', (value) => {
    expect(parseHomeArea(value)).toBeNull();
  });
  it.each([0.5, 0.8, 5])('accepts the radius boundary %s', (radiusKm) => {
    expect(parseHomeArea(JSON.stringify({ latitude: 0, longitude: 0, radiusKm }))?.radiusKm).toBe(radiusKm);
  });
});
