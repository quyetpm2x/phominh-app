export type CapturePlace = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  measuredAt: number;
  street: string;
  area: string;
};

export type CapturedPhoto = {
  uri: string;
  source: 'camera' | 'library';
  capturedAt: number | null;
  place: CapturePlace | null;
};

export function createCapturedPhoto(
  uri: string,
  source: CapturedPhoto['source'],
  place: CapturePlace | null,
  now = Date.now(),
): CapturedPhoto {
  const fresh = place && now >= place.measuredAt && now - place.measuredAt <= 60_000;
  return {
    uri,
    source,
    capturedAt: source === 'camera' ? now : null,
    place: source === 'camera' && fresh ? { ...place } : null,
  };
}
