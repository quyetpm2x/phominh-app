export interface HomeArea {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

export const HOME_AREA_STORAGE_KEY = 'pho_minh_home_area';
export const WORK_AREA_STORAGE_KEY = 'pho_minh_work_area';
export const DEFAULT_HOME_AREA: HomeArea = { latitude: 21.0302, longitude: 105.782, radiusKm: 1.5 };

export function parseHomeArea(value: string | null): HomeArea | null {
  if (!value) return null;
  try {
    const area = JSON.parse(value) as Partial<HomeArea> | null;
    if (
      !area ||
      typeof area.latitude !== 'number' ||
      !Number.isFinite(area.latitude) ||
      Math.abs(area.latitude) > 90 ||
      typeof area.longitude !== 'number' ||
      !Number.isFinite(area.longitude) ||
      Math.abs(area.longitude) > 180 ||
      typeof area.radiusKm !== 'number' ||
      !Number.isFinite(area.radiusKm) ||
      area.radiusKm < 0.5 ||
      area.radiusKm > 5
    )
      return null;
    return { latitude: area.latitude, longitude: area.longitude, radiusKm: area.radiusKm };
  } catch {
    return null;
  }
}
