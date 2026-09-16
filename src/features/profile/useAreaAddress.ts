import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import type { HomeArea } from '../../lib/homeArea';

export function useAreaAddress(area: HomeArea | null) {
  const [resolved, setResolved] = useState<{ key: string; address: string } | null>(null);
  const latitude = area?.latitude;
  const longitude = area?.longitude;
  const savedAddress = area?.address;
  const key = `${latitude},${longitude}`;
  useEffect(() => {
    let active = true;
    if (savedAddress || latitude === undefined || longitude === undefined) return;
    void (async () => {
      try {
        if (!(await Location.getForegroundPermissionsAsync()).granted) return;
        const [result] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (active && result)
          setResolved({
            key,
            address: [result.street, result.district, result.city].filter(Boolean).join(', '),
          });
      } catch {
        /* The saved coordinates remain usable without geocoding. */
      }
    })();
    return () => {
      active = false;
    };
  }, [key, latitude, longitude, savedAddress]);
  if (area?.address) return area.address;
  return resolved?.key === key && resolved.address
    ? resolved.address
    : area
      ? `Khu vực đã lưu · Bán kính ${area.radiusKm}km`
      : 'Chưa thiết lập';
}
