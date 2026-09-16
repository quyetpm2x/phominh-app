import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';
import {
  DEFAULT_HOME_AREA,
  HOME_AREA_STORAGE_KEY,
  WORK_AREA_STORAGE_KEY,
  parseHomeArea,
  type HomeArea,
} from '../../lib/homeArea';
export interface AreaSuggestion {
  title: string;
  subtitle: string;
  latitude?: number;
  longitude?: number;
}
// Suggested addresses supplied by the design; coordinates are resolved on selection.
const SUGGESTIONS: AreaSuggestion[] = [
  { title: 'Số 12 Ngõ 86 Duy Tân', subtitle: 'Phường Dịch Vọng Hậu, Cầu Giấy, Hà Nội' },
  { title: 'Chung cư FLC Twin Towers', subtitle: '265 Cầu Giấy, Dịch Vọng, Cầu Giấy' },
  { title: 'Ngõ 133 Xuân Thủy', subtitle: 'Dịch Vọng Hậu, Cầu Giấy, Hà Nội' },
];
async function geocode(address: string) {
  if (Platform.OS === 'android') {
    let permission = await Location.getForegroundPermissionsAsync();
    if (!permission.granted && permission.canAskAgain)
      permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) throw new Error('permission');
  }
  return Location.geocodeAsync(address);
}
export function useEditArea(place: 'home' | 'work') {
  const [area, setArea] = useState<HomeArea>(DEFAULT_HOME_AREA);
  const [target, setTarget] = useState<HomeArea | undefined>();
  const [initial, setInitial] = useState<HomeArea | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState(SUGGESTIONS);
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);
  const lock = useRef(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    void SecureStore.getItemAsync(place === 'home' ? HOME_AREA_STORAGE_KEY : WORK_AREA_STORAGE_KEY)
      .then((raw) => {
        if (!active) return;
        const value = parseHomeArea(raw) ?? DEFAULT_HOME_AREA;
        setError(false);
        setArea(value);
        setInitial(value);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [place, loadAttempt]);
  const centerChanged = (latitude: number, longitude: number) =>
    setArea((current) => {
      if (
        Math.abs(current.latitude - latitude) < 0.000001 &&
        Math.abs(current.longitude - longitude) < 0.000001
      )
        return current;
      return { latitude, longitude, radiusKm: current.radiusKm };
    });
  const search = async () => {
    if (lock.current || locating) return;
    if (!query.trim()) {
      setSuggestions(SUGGESTIONS);
      return;
    }
    lock.current = true;
    setBusy(true);
    try {
      const results = await geocode(query.trim());
      setSuggestions(
        results.map((result) => ({
          title: query.trim(),
          subtitle: `${result.latitude.toFixed(5)}, ${result.longitude.toFixed(5)}`,
          latitude: result.latitude,
          longitude: result.longitude,
        })),
      );
    } catch {
      Alert.alert('Chưa tìm được địa chỉ', 'Vui lòng kiểm tra kết nối hoặc quyền vị trí rồi thử lại.');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  const choose = async (suggestion: AreaSuggestion) => {
    if (lock.current || locating) return;
    lock.current = true;
    setBusy(true);
    try {
      const coords =
        suggestion.latitude !== undefined && suggestion.longitude !== undefined
          ? { latitude: suggestion.latitude, longitude: suggestion.longitude }
          : (await geocode(`${suggestion.title}, ${suggestion.subtitle}`))[0];
      if (!coords) {
        Alert.alert('Không tìm thấy toạ độ', 'Hãy thử địa chỉ cụ thể hơn hoặc chọn trên bản đồ.');
        return;
      }
      const next = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        radiusKm: area.radiusKm,
        address:
          suggestion.latitude === undefined
            ? `${suggestion.title}, ${suggestion.subtitle}`
            : suggestion.title,
      };
      setArea(next);
      setTarget(next);
    } catch {
      Alert.alert('Chưa chọn được địa chỉ', 'Vui lòng kiểm tra kết nối hoặc quyền vị trí.');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  const save = async () => {
    if (lock.current || locating || !initial || error) return;
    lock.current = true;
    setBusy(true);
    try {
      await SecureStore.setItemAsync(
        place === 'home' ? HOME_AREA_STORAGE_KEY : WORK_AREA_STORAGE_KEY,
        JSON.stringify(area),
      );
      if (router.canGoBack()) router.back();
      else router.replace('/home?tab=profile');
    } catch {
      Alert.alert('Chưa lưu được vị trí', 'Vui lòng thử lại.');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  return {
    area,
    initial,
    target,
    error,
    query,
    setQuery: (value: string) => {
      if (lock.current) return;
      setQuery(value);
      if (!value.trim()) setSuggestions(SUGGESTIONS);
    },
    suggestions,
    busy,
    locating,
    setLocating,
    retry: () => {
      setError(false);
      setInitial(null);
      setLoadAttempt((value) => value + 1);
    },
    centerChanged,
    search,
    choose,
    save,
    radiusChanged: (radiusKm: number) => setArea((current) => ({ ...current, radiusKm })),
  };
}
