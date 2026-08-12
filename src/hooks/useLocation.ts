import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  isFromMockProvider: boolean | null;
  error: string | null;
}

// Wrap expo-location — Fused Location Provider (Android)/CoreLocation (iOS).
// TODO xác minh sớm: expo-location managed workflow có expose isFromMockProvider không;
// nếu không đủ, chuyển sang Expo Development Build (mục 2 tài liệu FE, chống giả mạo GPS).
export function useLocation() {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    isFromMockProvider: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (!cancelled) setState((s) => ({ ...s, error: 'permission_denied' }));
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      if (cancelled) return;
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        isFromMockProvider: position.mocked ?? null,
        error: null,
      });
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
