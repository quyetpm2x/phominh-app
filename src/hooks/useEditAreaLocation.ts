import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import type { Region } from 'react-native-maps';

import { extractErrorMessage, getFixedAreas, setFixedArea } from '../api/client';
import type { AddressSuggestion } from './useAddressSuggestions';

const DEFAULT_DELTA = 0.02;

function formatAddress(result: Location.LocationGeocodedAddress | undefined, lat: number, lng: number): string {
  if (!result) return `Toạ độ ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  const line = [result.street, result.district || result.subregion || result.city].filter(Boolean).join(', ');
  return line || result.name || `Toạ độ ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

function toRegion(lat: number, lng: number): Region {
  return { latitude: lat, longitude: lng, latitudeDelta: DEFAULT_DELTA, longitudeDelta: DEFAULT_DELTA };
}

// Sửa khu vực cố định ĐÃ LƯU — cho đổi CẢ vị trí (kéo bản đồ hoặc gõ tìm địa chỉ) lẫn bán kính
// (quyết định 2026-08-26 — trước đó chỉ cho sửa bán kính, đổi vị trí phải qua luồng đặt lần đầu
// area-home.tsx/area-work.tsx). Khác useAreaPicker.ts (luôn bắt đầu từ GPS, dùng cho lần đặt ĐẦU
// TIÊN) — hook này bắt đầu từ khu vực đã lưu, không tự nhảy vào GPS trừ khi user bấm nút định vị.
export function useEditAreaLocation(label: 'home' | 'work') {
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [addressText, setAddressText] = useState('');
  const [radiusKm, setRadiusKm] = useState(2);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const areas = await getFixedAreas();
        const found = areas.find((a) => a.label === label) ?? null;
        if (!found) {
          setNotFound(true);
          return;
        }
        setInitialRegion(toRegion(found.lat, found.lng));
        setCenter({ lat: found.lat, lng: found.lng });
        setAddressText(found.addressText);
        setRadiusKm(found.radiusKm);
      } catch (err) {
        setError(await extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [label]);

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

  // Chọn 1 gợi ý từ useAddressSuggestions.ts — toạ độ + địa chỉ đã có sẵn (đã geocode/reverse-
  // geocode xong ở hook đó), chỉ cần set state, không gọi thêm API nào.
  const selectSuggestion = (suggestion: AddressSuggestion) => {
    setCenter({ lat: suggestion.lat, lng: suggestion.lng });
    setInitialRegion(toRegion(suggestion.lat, suggestion.lng));
    setAddressText(suggestion.description);
  };

  // Fallback khi chưa chọn gợi ý nào mà bấm Enter thẳng — geocode THẬT qua Location.geocodeAsync
  // (hệ điều hành), không phải dữ liệu giả.
  const searchAddress = async (query: string): Promise<boolean> => {
    if (!query.trim()) return false;
    setSearching(true);
    setError(null);
    try {
      const results = await Location.geocodeAsync(query);
      const hit = results[0];
      if (!hit) {
        setError('Không tìm thấy địa chỉ này');
        return false;
      }
      setCenter({ lat: hit.latitude, lng: hit.longitude });
      setInitialRegion(toRegion(hit.latitude, hit.longitude));
      await reverseGeocode(hit.latitude, hit.longitude);
      return true;
    } catch {
      setError('Không tìm được địa chỉ, kiểm tra lại kết nối mạng');
      return false;
    } finally {
      setSearching(false);
    }
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
    loading,
    notFound,
    initialRegion,
    addressText,
    radiusKm,
    setRadiusKm,
    onCenterChange,
    selectSuggestion,
    searchAddress,
    searching,
    saving,
    error,
    save,
  };
}
