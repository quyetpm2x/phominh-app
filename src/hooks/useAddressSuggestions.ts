import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export interface AddressSuggestion {
  lat: number;
  lng: number;
  description: string;
}

const DEBOUNCE_MS = 500;
const MIN_QUERY_LENGTH = 3;
const MAX_RESULTS = 5;

function formatAddress(result: Location.LocationGeocodedAddress | undefined, lat: number, lng: number): string {
  if (!result) return `Toạ độ ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  const line = [result.name, result.street, result.district || result.subregion || result.city]
    .filter(Boolean)
    .join(', ');
  return line || `Toạ độ ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

// Gợi ý địa chỉ MIỄN PHÍ — dùng geocode 2 chiều có sẵn của expo-location (không cần API key/
// billing nào), thay cho Google Places Autocomplete (đắt hơn, cần bật billing — tạm chưa dùng,
// xem lịch sử trò chuyện nếu sau này muốn đổi lại). geocodeAsync(query) trả về TOẠ ĐỘ khớp đúng
// chuỗi đã gõ (thường 1-3 kết quả, KHÔNG đoán-trước theo từng ký tự kiểu Apple Maps/Google), rồi
// reverse-geocode lại từng kết quả để có tên hiển thị dễ đọc thay vì chỉ toạ độ số.
export function useAddressSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return undefined;
    }
    let cancelled = false;
    setLoading(true);

    const timer = setTimeout(() => {
      (async () => {
        try {
          const hits = await Location.geocodeAsync(query);
          const results = await Promise.all(
            hits.slice(0, MAX_RESULTS).map(async (hit) => {
              try {
                const reverse = await Location.reverseGeocodeAsync({
                  latitude: hit.latitude,
                  longitude: hit.longitude,
                });
                return { lat: hit.latitude, lng: hit.longitude, description: formatAddress(reverse[0], hit.latitude, hit.longitude) };
              } catch {
                return { lat: hit.latitude, lng: hit.longitude, description: `Toạ độ ${hit.latitude.toFixed(4)}, ${hit.longitude.toFixed(4)}` };
              }
            }),
          );
          if (!cancelled) setSuggestions(results);
        } catch {
          if (!cancelled) setSuggestions([]);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return { suggestions, loading };
}
