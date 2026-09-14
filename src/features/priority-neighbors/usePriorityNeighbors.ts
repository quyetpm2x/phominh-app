import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { restorePriorityIds, type NeighborFilter } from './data';
const KEY = 'pho-minh.priority-neighbors.v1';
export function usePriorityNeighbors() {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<NeighborFilter>('all');
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      SecureStore.getItemAsync(KEY)
        .then((raw) => {
          if (active) {
            setIds(restorePriorityIds(raw));
            setReady(true);
            setError(false);
          }
        })
        .catch(() => {
          if (active) setError(true);
        });
      return () => {
        active = false;
      };
      // Retry must rerun the focus callback after a failed storage read.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attempt]),
  );
  const toggle = async (id: string) => {
    if (!ready || busy.current) return;
    busy.current = true;
    setSaving(true);
    const next = ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id];
    try {
      await SecureStore.setItemAsync(KEY, JSON.stringify(next));
      setIds(next);
    } catch {
      Alert.alert('Chưa lưu được danh sách', 'Vui lòng thử lại.');
    } finally {
      busy.current = false;
      setSaving(false);
    }
  };
  return {
    ids,
    ready,
    error,
    query,
    setQuery,
    filter,
    setFilter,
    saving,
    toggle,
    retry: () => {
      setError(false);
      setAttempt((value) => value + 1);
    },
  };
}
