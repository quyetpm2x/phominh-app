import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthDecorativeBlobs } from '../../src/components/ui/AuthDecorativeBlobs';
import { CustomIcon } from '../../src/components/ui/CustomIcon';
import { GradientPrimaryButton } from '../../src/components/ui/GradientPrimaryButton';
import { GradientPrimaryView } from '../../src/components/ui/GradientPrimaryView';
import { colors } from '../../src/constants/design-tokens';
import {
  HOME_AREA_STORAGE_KEY,
  WORK_AREA_STORAGE_KEY,
  parseHomeArea,
  type HomeArea,
} from '../../src/lib/homeArea';

interface SelectedArea {
  area: HomeArea;
  label: string;
  neighborhood: string;
}
function fallbackArea(area: HomeArea): SelectedArea {
  return {
    area,
    label: `${area.latitude.toFixed(4)}, ${area.longitude.toFixed(4)}`,
    neighborhood: 'Nhà của bạn',
  };
}
// Display samples from Figma until the neighborhood statistics service is available.
const STATS = [
  { value: '37', label: 'QUÁN MỞ', color: '#44403B' },
  { value: '1.2k', label: 'HÀNG XÓM', color: colors.primary.DEFAULT },
  { value: '41', label: 'TIN MỚI', color: colors.accent.DEFAULT },
];

function AreaRow({
  title,
  selected,
  loading,
  work = false,
}: {
  title: string;
  selected: SelectedArea | null;
  loading: boolean;
  work?: boolean;
}) {
  const color = work ? colors.accent.DEFAULT : colors.primary.DEFAULT;
  return (
    <View className="flex-row items-center gap-4">
      <View
        style={{ backgroundColor: `${color}1A` }}
        className="h-11 w-11 items-center justify-center rounded-xl"
      >
        <CustomIcon name={work ? 'workBriefcase' : 'homeHouse'} size={20} color={color} />
      </View>
      <View className="flex-1">
        <Text className="font-sans-bold text-sm leading-[21px] text-ink">{title}</Text>
        <Text className="font-sans-medium text-xs leading-[18px] text-[#79716B]">
          {loading
            ? 'Đang tải khu vực…'
            : selected
              ? `${selected.label} (${selected.area.radiusKm.toFixed(1)}km)`
              : 'Chưa thiết lập'}
        </Text>
      </View>
      {selected ? <CustomIcon name="completionCheck" size={18} color={color} /> : null}
    </View>
  );
}

export default function OnboardingCompleteScreen() {
  const [home, setHome] = useState<SelectedArea | null>(null);
  const [work, setWork] = useState<SelectedArea | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const load = async () => {
      const results = await Promise.allSettled([
        SecureStore.getItemAsync(HOME_AREA_STORAGE_KEY),
        SecureStore.getItemAsync(WORK_AREA_STORAGE_KEY),
      ]);
      if (!active) return;
      const areas = results.map((result) =>
        result.status === 'fulfilled' ? parseHomeArea(result.value) : null,
      );
      setHome(areas[0] ? fallbackArea(areas[0]) : null);
      setWork(areas[1] ? fallbackArea(areas[1]) : null);
      setLoading(false);
      try {
        const permission = await Location.getForegroundPermissionsAsync();
        if (!permission.granted || !active) return;
        await Promise.allSettled(
          areas.map(async (area, index) => {
            if (!area) return;
            const [address] = await Location.reverseGeocodeAsync({
              latitude: area.latitude,
              longitude: area.longitude,
            });
            if (!active || !address) return;
            const neighborhood = address.street || address.district || address.city || 'Nhà của bạn';
            const label =
              [
                ...new Set(
                  [address.name || address.street, address.district || address.city].filter(Boolean),
                ),
              ].join(', ') || fallbackArea(area).label;
            const selected = { area, label, neighborhood };
            if (index === 0) setHome(selected);
            else setWork(selected);
          }),
        );
      } catch {
        /* Keep the saved coordinates when address lookup is unavailable. */
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <AuthDecorativeBlobs />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={[styles.floatingCard, styles.newsCard]}>
            <Text className="font-sans-bold text-center text-[11px] tracking-[0.55px] text-primary">
              41 TIN MỚI
            </Text>
          </View>
          <View style={[styles.floatingCard, styles.walkCard]}>
            <Text className="font-sans-bold text-center text-[11px] tracking-[0.55px] text-accent">
              ~3 PHÚT ĐI BỘ
            </Text>
          </View>
          <View style={styles.brandIcon}>
            <GradientPrimaryView size={112} borderRadius={31} borderWidth={4} hasShadow>
              <CustomIcon name="completionBuilding" size={65} color="white" />
            </GradientPrimaryView>
          </View>
        </View>
        <Text
          accessibilityRole="header"
          className="text-center font-sans-black text-[30px] leading-[37.5px] tracking-[-0.75px] text-[#1C1917]"
        >
          Xong rồi, xóm của bạn đã sẵn sàng!
        </Text>
        <Text className="mt-3 text-center font-sans-medium text-[15px] leading-[24.375px] text-[#79716B]">
          Chào mừng bạn đến với khu vực{' '}
          <Text className="font-sans-bold text-primary">{home?.neighborhood ?? 'bạn đã chọn'}</Text>
          {home ? (
            <>
              {'\n'}trong bán kính{' '}
              <Text className="font-sans-bold text-[#1C1917]">{home.area.radiusKm.toFixed(1)}km</Text>.
            </>
          ) : (
            '.'
          )}
        </Text>
        <View className="mt-10 flex-row gap-3">
          {STATS.map((stat, index) => (
            <LinearGradient
              key={stat.label}
              colors={index === 1 ? ['#FFFFFF', '#FF416C0D'] : ['#FFFFFF', '#FFFFFF']}
              style={[styles.stat, index === 1 && styles.highlightStat]}
            >
              <Text style={{ color: stat.color }} className="font-sans-black text-[22px] leading-7">
                {stat.value}
              </Text>
              <Text
                style={{ color: index === 0 ? colors.muted.DEFAULT : stat.color }}
                className="font-sans-bold text-[9px] tracking-[0.9px]"
              >
                {stat.label}
              </Text>
            </LinearGradient>
          ))}
        </View>
        <View style={styles.spacer} />
        <View style={styles.areaCardShadow}>
          <View className="overflow-hidden rounded-[31px] border border-white">
            <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFillObject} />
            <View className="gap-5 bg-white/80 p-6">
              <Text className="font-sans-bold text-[10px] tracking-[2px] text-muted">KHU VỰC HOẠT ĐỘNG</Text>
              <View className="gap-4">
                <AreaRow title="Nhà" selected={home} loading={loading} />
                <AreaRow title="Chỗ làm" selected={work} loading={loading} work />
              </View>
            </View>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => Alert.alert('Khám phá xóm mình', 'Tính năng khám phá sẽ sớm sẵn sàng.')}
          className="mt-6 active:scale-[0.98]"
        >
          <GradientPrimaryButton>
            <Text className="font-sans-bold text-base text-white">Khám phá xóm mình ngay</Text>
            <Ionicons name="arrow-forward" size={18} color="white" />
          </GradientPrimaryButton>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 32 },
  hero: { height: 180, width: 280, alignSelf: 'center', marginBottom: 8 },
  brandIcon: { position: 'absolute', left: 84, top: 32 },
  floatingCard: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  newsCard: { width: 105, height: 62, right: 4, top: 6 },
  walkCard: { width: 127, height: 59, left: 0, top: 105 },
  stat: {
    flex: 1,
    minHeight: 76,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F5F5F4',
    paddingHorizontal: 6,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  highlightStat: {
    borderWidth: 2,
    borderColor: '#FF416C4D',
    shadowColor: colors.primary.DEFAULT,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  spacer: { flexGrow: 1, minHeight: 28 },
  areaCardShadow: {
    borderRadius: 31,
    shadowColor: '#E7E5E4',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
});
