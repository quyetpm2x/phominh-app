import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler } from 'react-native';
import {
  DEFAULT_HOME_AREA,
  HOME_AREA_STORAGE_KEY,
  WORK_AREA_STORAGE_KEY,
  parseHomeArea,
  type HomeArea,
} from '../../lib/homeArea';
import {
  EMPTY_PROFILE,
  PROFILE_STORAGE_KEY,
  restoreProfile,
  type PersonalProfile,
} from '../../lib/personalProfile';

export function useProfileEditor() {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [home, setHome] = useState(DEFAULT_HOME_AREA);
  const [work, setWork] = useState<HomeArea | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState<string>();
  const busy = useRef(false);
  const original = useRef('');
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const values = await Promise.all([
          SecureStore.getItemAsync(PROFILE_STORAGE_KEY),
          SecureStore.getItemAsync(HOME_AREA_STORAGE_KEY),
          SecureStore.getItemAsync(WORK_AREA_STORAGE_KEY),
        ]);
        if (!active) return;
        const profile = restoreProfile(values[0]);
        const home = parseHomeArea(values[1]) ?? DEFAULT_HOME_AREA;
        const work = parseHomeArea(values[2]);
        setProfile(profile);
        setHome(home);
        setWork(work);
        original.current = JSON.stringify({ profile, home, work });
      } catch {
        if (active) setLoadError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  const leave = () => (router.canGoBack() ? router.back() : router.replace('/home?tab=profile'));
  const back = () => {
    if (busy.current) return;
    const dirty = !loading && !loadError && original.current !== JSON.stringify({ profile, home, work });
    if (!dirty) return leave();
    Alert.alert('Bỏ thay đổi?', 'Những thay đổi chưa lưu sẽ bị bỏ.', [
      { text: 'Tiếp tục sửa', style: 'cancel' },
      { text: 'Bỏ thay đổi', style: 'destructive', onPress: leave },
    ]);
  };
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      back();
      return true;
    });
    return () => subscription.remove();
  });
  const choosePhoto = async () => {
    if (busy.current || loading || loadError) return;
    busy.current = true;
    setPicking(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) setProfile((current) => ({ ...current, avatarUri: result.assets[0].uri }));
    } catch {
      Alert.alert('Chưa mở được thư viện ảnh', 'Vui lòng thử lại.');
    } finally {
      busy.current = false;
      setPicking(false);
    }
  };
  const save = async () => {
    if (busy.current || loading || loadError) return;
    if (!profile.fullName.trim()) {
      setError('Vui lòng nhập họ và tên.');
      return;
    }
    busy.current = true;
    setSaving(true);
    try {
      const updated = { ...profile, fullName: profile.fullName.trim(), nickname: profile.nickname.trim() };
      await SecureStore.setItemAsync(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      await SecureStore.setItemAsync(HOME_AREA_STORAGE_KEY, JSON.stringify(home));
      if (work) await SecureStore.setItemAsync(WORK_AREA_STORAGE_KEY, JSON.stringify(work));
      leave();
    } catch {
      Alert.alert('Chưa lưu được toàn bộ thay đổi', 'Vui lòng thử lưu lại.');
    } finally {
      busy.current = false;
      setSaving(false);
    }
  };
  const update = (patch: Partial<PersonalProfile>) => {
    setProfile((current) => ({ ...current, ...patch }));
    if (patch.fullName !== undefined) setError(undefined);
  };
  return {
    profile,
    home,
    work,
    loading,
    loadError,
    saving,
    picking,
    error,
    back,
    choosePhoto,
    save,
    update,
    setHome,
    setWork,
  };
}
