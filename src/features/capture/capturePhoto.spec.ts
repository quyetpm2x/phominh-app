import { createCapturedPhoto, type CapturePlace } from './capturePhoto';

const place: CapturePlace = {
  latitude: 21.03,
  longitude: 105.78,
  accuracy: 10,
  measuredAt: 100_000,
  street: 'Ngõ 82 Duy Tân',
  area: 'Dịch Vọng Hậu, Cầu Giấy',
};

describe('capture photo metadata', () => {
  it('snapshots coordinates and shutter time for a camera photo', () => {
    const photo = createCapturedPhoto('file://photo.jpg', 'camera', place, 120_000);
    expect(photo.capturedAt).toBe(120_000);
    expect(photo.place).toEqual(place);
    expect(photo.place).not.toBe(place);
  });
  it('does not certify a library photo using the current location', () => {
    const photo = createCapturedPhoto('file://library.jpg', 'library', place, 120_000);
    expect(photo.place).toBeNull();
    expect(photo.capturedAt).toBeNull();
  });
  it.each([99_999, 160_001])('rejects stale or future location fixes at %s', (now) => {
    expect(createCapturedPhoto('file://photo.jpg', 'camera', place, now).place).toBeNull();
  });
});
