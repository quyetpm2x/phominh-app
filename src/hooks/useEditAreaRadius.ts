import { useEffect, useState } from 'react';

import { extractErrorMessage, getFixedAreas, setFixedArea, type FixedArea } from '../api/client';

// Sửa bán kính khu vực cố định đã lưu (tai-lieu-chuc-nang.md #37, profile/areas.tsx) — CHỈ đổi
// radiusKm, giữ nguyên lat/lng/addressText đã chốt lúc onboarding (đổi vị trí phải qua luồng
// MapAreaPicker riêng, không phải màn này). Khác useAreaPicker.ts (dùng cho lần đặt ĐẦU TIÊN,
// luôn bắt đầu từ GPS) — hook này đọc lại khu vực đã lưu để sửa tiếp.
export function useEditAreaRadius(label: 'home' | 'work') {
  const [area, setArea] = useState<FixedArea | null>(null);
  const [radiusKm, setRadiusKm] = useState(2);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const areas = await getFixedAreas();
        const found = areas.find((a) => a.label === label) ?? null;
        setArea(found);
        if (found) setRadiusKm(found.radiusKm);
      } catch (err) {
        setError(await extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [label]);

  const save = async (): Promise<boolean> => {
    if (!area) return false;
    setSaving(true);
    setError(null);
    try {
      await setFixedArea({
        label,
        addressText: area.addressText,
        lat: area.lat,
        lng: area.lng,
        radiusKm,
      });
      return true;
    } catch (err) {
      setError(await extractErrorMessage(err));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { area, radiusKm, setRadiusKm, loading, saving, error, save };
}
