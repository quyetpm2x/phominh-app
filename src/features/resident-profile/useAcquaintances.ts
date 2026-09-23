import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const KEY = 'pho-minh.acquaintances.v1';
export function useAcquaintances() {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      void SecureStore.getItemAsync(KEY)
        .then((raw) => {
          const parsed: unknown = raw ? JSON.parse(raw) : [];
          if (active) {
            setIds(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []);
            setReady(true);
          }
        })
        .catch(() => {
          if (active) Alert.alert('Chưa tải được người quen', 'Quay lại hồ sơ để thử tải lại.');
        });
      return () => {
        active = false;
      };
    }, []),
  );
  async function toggle(id: string) {
    if (!ready || busy.current) return;
    busy.current = true;
    setSaving(true);
    const next = ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
    try {
      await SecureStore.setItemAsync(KEY, JSON.stringify(next));
      setIds(next);
    } catch {
      Alert.alert('Chưa lưu được người quen', 'Vui lòng thử lại.');
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }
  return { ids, ready, saving, toggle };
}
