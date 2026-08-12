import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import type { Region } from 'react-native-maps';

import { extractErrorMessage, setFixedArea } from '../api/client';

// Trung tâm Hà Nội — dùng khi chưa có quyền vị trí hoặc lấy vị trí thiết bị thất bại, để bản đồ
// vẫn có điểm khởi đầu hợp lý thay vì màn trắng/toạ độ (0,0) giữa biển.
const FALLBACK_REGION: Region = { latitude: 21.0285, longitude: 105.8542, latitudeDelta: 0.06, longitudeDelta: 0.06 };
const DEFAULT_RADIUS_KM = 2;

function formatAddress(result: Location.LocationGeocodedAddress | undefined, lat: number, lng: number): string {
  if (!result) return `Toạ độ ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  const line = [result.street, result.district || result.subregion || result.city].filter(Boolean).join(', ');
  return line || result.name || `Toạ độ ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

// Dùng chung cho area-home.tsx và area-work.tsx — cả 2 màn cần y hệt logic: lấy vị trí ban đầu,
// reverse geocode mỗi khi kéo bản đồ, và lưu lên backend.
export function useAreaPicker(label: 'home' | 'work') {
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [addressText, setAddressText] = useState('Đang định vị...');
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
          setInitialRegion(FALLBACK_REGION);
          setCenter({ lat: FALLBACK_REGION.latitude, lng: FALLBACK_REGION.longitude });
          return;
        }
        const pos = await Location.getCurrentPositionAsync({});
        const region: Region = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          latitudeDelta: 0.06,
          longitudeDelta: 0.06,
        };
        setInitialRegion(region);
        setCenter({ lat: region.latitude, lng: region.longitude });
        await reverseGeocode(region.latitude, region.longitude);
      } catch {
        setInitialRegion(FALLBACK_REGION);
        setCenter({ lat: FALLBACK_REGION.latitude, lng: FALLBACK_REGION.longitude });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      setAddressText(formatAddress(results[0], lat, lng));
    } catch {
      setAddressText(`Toạ độ ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const onCenterChange = (lat: number, lng: number) => {
    setCenter({ lat, lng });
    setAddressText('Đang tìm địa chỉ...');
    void reverseGeocode(lat, lng);
  };

  const save = async (): Promise<boolean> => {
    if (!center) return false;
    setSaving(true);
    setError(null);
    try {
      await setFixedArea({ label, addressText, lat: center.lat, lng: center.lng, radiusKm });
      return true;
    } catch (err) {
      setError(await extractErrorMessage(err));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    loading: !initialRegion,
    initialRegion,
    addressText,
    radiusKm,
    setRadiusKm,
    onCenterChange,
    save,
    saving,
    error,
  };
}
