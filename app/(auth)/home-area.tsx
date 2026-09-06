import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomIcon } from '../../src/components/ui/CustomIcon';
import { GradientPrimaryButton } from '../../src/components/ui/GradientPrimaryButton';
import { MapAreaPicker } from '../../src/components/ui/MapAreaPicker';
import { RadiusSlider } from '../../src/components/ui/RadiusSlider';
import { colors } from '../../src/constants/design-tokens';
import {
  DEFAULT_HOME_AREA,
  HOME_AREA_STORAGE_KEY,
  WORK_AREA_STORAGE_KEY,
  parseHomeArea,
  type HomeArea,
} from '../../src/lib/homeArea';

export default function HomeAreaScreen() {
  const { width } = useWindowDimensions();
  const [step, setStep] = useState<'home' | 'work'>('home');
  const [drafts, setDrafts] = useState({
    home: DEFAULT_HOME_AREA,
    work: { ...DEFAULT_HOME_AREA, radiusKm: 0.8 },
  });
  const area = drafts[step];
  const isWork = step === 'work';
  const placeName = isWork ? 'Chỗ làm' : 'Nhà';
  const accent = isWork ? colors.accent.DEFAULT : colors.primary.DEFAULT;
  const scrollRef = useRef<ScrollView>(null);
  const setArea = useCallback(
    (update: (previous: HomeArea) => HomeArea) => {
      setDrafts((previous) => ({ ...previous, [step]: update(previous[step]) }));
    },
    [step],
  );
  const [initialArea, setInitialArea] = useState<HomeArea | null>(null);
  const [address, setAddress] = useState<{ title: string; detail: string } | null>(null);
  const [resolving, setResolving] = useState(false);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    let active = true;
    const restore = async () => {
      const results = await Promise.allSettled([
        SecureStore.getItemAsync(HOME_AREA_STORAGE_KEY),
        SecureStore.getItemAsync(WORK_AREA_STORAGE_KEY),
      ]);
      const home =
        results[0].status === 'fulfilled'
          ? (parseHomeArea(results[0].value) ?? DEFAULT_HOME_AREA)
          : DEFAULT_HOME_AREA;
      const fallbackWork = { ...home, radiusKm: 0.8 };
      const work =
        results[1].status === 'fulfilled' ? (parseHomeArea(results[1].value) ?? fallbackWork) : fallbackWork;
      if (active) {
        setDrafts({ home, work });
        setInitialArea(home);
      }
    };
    void restore();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!initialArea) return;
    let active = true;
    setAddress(null);
    setResolving(true);
    const timer = setTimeout(async () => {
      try {
        const permission = await Location.getForegroundPermissionsAsync();
        // Android geocoding requires location permission; allow manual selection without it.
        if (!permission.granted) return;
        const [result] = await Location.reverseGeocodeAsync({
          latitude: area.latitude,
          longitude: area.longitude,
        });
        if (active && result) {
          const title =
            [result.streetNumber, result.street].filter(Boolean).join(', ') ||
            result.name ||
            `Vị trí ${placeName} đã chọn`;
          const detail = [
            ...new Set([result.district, result.subregion, result.city, result.region].filter(Boolean)),
          ].join(', ');
          setAddress({ title, detail });
        }
      } catch {
        /* Coordinates remain the source of truth when no address is available. */
      } finally {
        if (active) setResolving(false);
      }
    }, 450);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [area.latitude, area.longitude, initialArea, placeName]);

  const onCenterChange = useCallback(
    (latitude: number, longitude: number) => {
      setArea((previous) =>
        previous.latitude === latitude && previous.longitude === longitude
          ? previous
          : { ...previous, latitude, longitude },
      );
    },
    [setArea],
  );
  const changeStep = useCallback(
    (next: 'home' | 'work') => {
      setAddress(null);
      setResolving(true);
      setInitialArea(drafts[next]);
      setStep(next);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    },
    [drafts],
  );

  const finishSetup = () => {
    router.push('/(auth)/work-info');
  };
  const saveArea = async () => {
    if (savingRef.current || !initialArea) return;
    savingRef.current = true;
    setSaving(true);
    try {
      await SecureStore.setItemAsync(
        isWork ? WORK_AREA_STORAGE_KEY : HOME_AREA_STORAGE_KEY,
        JSON.stringify(area),
      );
      if (isWork) finishSetup();
      else changeStep('work');
    } catch {
      Alert.alert('Chưa lưu được vị trí', 'Vui lòng thử lại.');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };
  const goBack = () => {
    if (savingRef.current) return;
    if (isWork) {
      changeStep('home');
      return;
    }
    if (router.canGoBack()) router.back();
    else router.replace('/(auth)/permissions');
  };
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (savingRef.current) return true;
        if (step === 'work') {
          changeStep('home');
          return true;
        }
        return false;
      });
      return () => subscription.remove();
    }, [step, changeStep]),
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View className="gap-2 border-b border-stone-100 bg-white px-6 pb-5 pt-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={isWork ? 'Quay lại chọn Nhà' : 'Quay lại trang cấp quyền'}
                hitSlop={6}
                onPress={goBack}
                className="h-8 w-8 items-center justify-center rounded-[9px] bg-stone-100 active:opacity-60"
              >
                <Ionicons name="chevron-back" size={16} color={colors.ink.DEFAULT} />
              </Pressable>
              <Text className="font-sans-black text-[10px] tracking-[2px] text-primary">
                KHU VỰC {isWork ? '2' : '1'}/2
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              {isWork ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Bỏ qua chọn Chỗ làm"
                  disabled={saving}
                  hitSlop={10}
                  onPress={finishSetup}
                  className="min-h-8 justify-center active:opacity-60"
                >
                  <Text className="font-sans-black text-[10px] tracking-[1px] text-muted">BỎ QUA</Text>
                </Pressable>
              ) : null}
              <Text
                style={{ color: accent, backgroundColor: `${accent}1A` }}
                className="rounded-sm px-1.5 py-0.5 font-sans-black text-[9px] tracking-[0.45px]"
              >
                {isWork ? 'CHỖ LÀM' : 'NHÀ'}
              </Text>
            </View>
          </View>
          <Text
            accessibilityRole="header"
            className="font-sans-black text-2xl leading-9 tracking-[-0.6px] text-[#1C1917]"
          >
            Đặt vị trí {placeName}
          </Text>
        </View>
        <View style={{ height: Math.min(440, Math.max(320, width)), backgroundColor: colors.cream.surface }}>
          {initialArea ? (
            <MapAreaPicker
              key={step}
              variant="home"
              pinLabel={isWork ? 'CHỖ LÀM Ở ĐÂY?' : 'NHÀ Ở ĐÂY?'}
              pinColor={accent}
              place={address?.title ?? `Vị trí ${placeName}`}
              initialRegion={{ ...initialArea, latitudeDelta: 0.035, longitudeDelta: 0.035 }}
              radiusKm={area.radiusKm}
              onCenterChange={onCenterChange}
            />
          ) : (
            <ActivityIndicator style={styles.loading} color={colors.primary.DEFAULT} />
          )}
        </View>
        <View style={styles.sheet}>
          <View className="flex-row items-start gap-4">
            <View
              style={{ backgroundColor: `${accent}1A` }}
              className="h-12 w-12 items-center justify-center rounded-2xl"
            >
              <CustomIcon name={isWork ? 'workBriefcase' : 'homeHouse'} size={24} color={accent} />
            </View>
            <View className="flex-1 pt-1">
              <Text
                accessibilityLiveRegion="polite"
                className="font-sans-black text-[15px] leading-[22.5px] text-[#1C1917]"
              >
                {resolving ? 'Đang tìm địa chỉ…' : (address?.title ?? `Vị trí ${placeName} đã chọn`)}
              </Text>
              <Text className="font-sans-medium text-[13px] leading-[19.5px] text-[#79716B]">
                {address?.detail || `${area.latitude.toFixed(5)}, ${area.longitude.toFixed(5)}`}
              </Text>
            </View>
          </View>
          <View>
            <Text className="font-sans-black text-[10px] tracking-[1px] text-muted">BÁN KÍNH XEM TIN</Text>
            <View className="mt-1 flex-row items-center justify-between">
              <Text style={{ color: accent }} className="font-sans-black text-xl leading-7">
                {area.radiusKm.toFixed(1)} <Text className="text-sm">km</Text>
              </Text>
              {/* Figma sample counts; replace with neighborhood statistics when the API is available. */}
              <View className="flex-row items-center gap-1">
                <CustomIcon name="areaNeighbors" size={16} />
                <Text className="font-sans-bold text-[11px] tracking-[-0.275px] text-muted">
                  {isWork ? '~850 hàng xóm' : '~1.2k hàng xóm'}
                </Text>
              </View>
            </View>
            <RadiusSlider
              variant="home"
              color={accent}
              stepKm={0.1}
              minKm={0.5}
              maxKm={5}
              valueKm={area.radiusKm}
              onChange={(radiusKm) => setArea((previous) => ({ ...previous, radiusKm }))}
            />
          </View>
          <View
            style={{ borderColor: `${accent}1A`, backgroundColor: `${accent}0D` }}
            className="flex-row items-start gap-3 rounded-[18px] border p-3.5"
          >
            <CustomIcon name="homeInfo" size={18} color={accent} />
            <Text
              style={{ color: accent }}
              className="flex-1 font-sans-bold text-[11px] leading-[17.875px] tracking-[-0.275px]"
            >
              LƯU Ý: CHỈ DÙNG ĐỂ LỌC TIN, KHÔNG ẢNH HƯỞNG GPS KHI ĐĂNG BÀI.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: saving || !initialArea, busy: saving }}
            disabled={saving || !initialArea}
            onPress={saveArea}
            className="active:scale-[0.98]"
          >
            <GradientPrimaryButton>
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text className="font-sans-bold text-base text-white">
                    {isWork ? 'Hoàn thành cài đặt' : 'Lưu & chọn chỗ làm'}
                  </Text>
                  {isWork ? (
                    <CustomIcon name="otpCheck" size={18} color="white" />
                  ) : (
                    <Ionicons name="arrow-forward" size={18} color="white" />
                  )}
                </>
              )}
            </GradientPrimaryButton>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  content: { flexGrow: 1, backgroundColor: colors.cream.DEFAULT },
  loading: { flex: 1 },
  sheet: {
    marginTop: -12,
    backgroundColor: '#fff',
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
    padding: 24,
    gap: 32,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -6 },
    elevation: 5,
  },
});
