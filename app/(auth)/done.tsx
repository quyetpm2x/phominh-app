import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getFixedAreas, type FixedArea } from '../../src/api/client';
import { GradientButton } from '../../src/components/ui/Button';

// STATS (hàng xóm/quán đang mở/tin hôm nay) CHƯA nối data thật — cần đếm user/merchant/post trong
// bán kính qua PostGIS, nhưng tính năng đăng bài/merchant chưa xây (mới tới Onboarding, TẦNG 1).
// Giữ minh hoạ tạm, không giả vờ gọi API trả về toàn số 0 gây hiểu lầm là bug.
const STATS = [
  { value: '1.240', label: 'hàng xóm' },
  { value: '37', label: 'quán đang mở' },
  { value: '41', label: 'tin hôm nay' },
];

// on.onboardDone — xác nhận đã sẵn sàng, tổng kết những gì đang chờ. Khu vực đã cài lấy từ
// GET /api/mobile/users/me/areas (data thật vừa lưu ở area-home.tsx/area-work.tsx).
export default function OnboardDoneScreen() {
  const [areas, setAreas] = useState<FixedArea[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setAreas(await getFixedAreas());
      } catch {
        setAreas([]);
      }
    })();
  }, []);

  const home = areas?.find((a) => a.label === 'home');
  const work = areas?.find((a) => a.label === 'work');

  const savedAreaRows = [
    home ? { name: `Nhà · ${home.addressText}`, meta: `${home.radiusKm} km`, color: '#e4f0e9' } : null,
    work ? { name: `Chỗ làm · ${work.addressText}`, meta: `${work.radiusKm} km`, color: '#f6ecd4' } : null,
    { name: 'Quanh đây · theo GPS', meta: 'tự động', color: '#eeece6' },
  ].filter((r): r is { name: string; meta: string; color: string } => r !== null);

  const introText = home
    ? `Đây là những gì đang chờ bạn trong bán kính ${home.radiusKm} km quanh ${home.addressText}.`
    : 'Đây là những gì đang chờ bạn quanh khu vực bạn đã chọn.';

  return (
    <LinearGradient colors={['#fdf6ec', '#f4ecdd', '#eee6d4']} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerClassName="flex-1 px-6 pt-6" bounces={false}>
          <View className="flex-1 items-center">
            <View style={{ height: 96 }} className="w-full relative items-center justify-center">
              <View className="w-[72px] h-[72px] rounded-full bg-primary items-center justify-center">
                <Text className="text-white text-3xl">✓</Text>
              </View>
              <View
                style={{ position: 'absolute', left: 8, top: 6, transform: [{ rotate: '-4deg' }] }}
                className="flex-row items-center gap-1.5 rounded-full bg-white border border-primary-100 px-3 py-1.5 shadow-sm"
              >
                <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                <Text className="font-sans-bold text-[11px] text-ink">41 tin mới</Text>
              </View>
              <View
                style={{ position: 'absolute', right: 4, top: 0, transform: [{ rotate: '4deg' }] }}
                className="flex-row items-center gap-1.5 rounded-full bg-white border border-accent-100 px-3 py-1.5 shadow-sm"
              >
                <View className="w-1.5 h-1.5 rounded-full bg-accent" />
                <Text className="font-sans-bold text-[11px] text-ink">~3 phút đi bộ</Text>
              </View>
            </View>

            <Text className="mt-1 text-[32px] leading-[36px] font-sans-bold tracking-tight text-ink text-center">
              Xong rồi,{'\n'}
              <Text className="text-accent">xóm của bạn đã sẵn sàng</Text>
            </Text>
            <Text className="mt-2.5 text-[15px] leading-[23px] text-muted text-center">{introText}</Text>

            <View className="mt-5 flex-row gap-2.5 w-full">
              {STATS.map((s) => (
                <View
                  key={s.label}
                  className="flex-1 rounded-2xl bg-white/80 border border-primary-100 p-3.5 items-center"
                >
                  <Text className="font-mono-semibold text-2xl text-primary">{s.value}</Text>
                  <Text className="mt-0.5 text-[11.5px] text-muted">{s.label}</Text>
                </View>
              ))}
            </View>

            <View className="mt-4 w-full rounded-[18px] bg-white/85 border border-border p-4">
              <Text className="font-mono-medium text-[10px] tracking-wide text-muted">KHU VỰC ĐÃ CÀI</Text>
              {areas === null ? (
                <View className="mt-3 items-center py-2">
                  <ActivityIndicator />
                </View>
              ) : (
                <View className="mt-3 gap-2.5">
                  {savedAreaRows.map((a) => (
                    <View key={a.name} className="flex-row items-center gap-2.5">
                      <View style={{ backgroundColor: a.color }} className="w-[30px] h-[30px] rounded-[10px]" />
                      <Text className="flex-1 font-sans-semibold text-sm text-ink">{a.name}</Text>
                      <Text className="font-mono-medium text-[11.5px] text-muted">{a.meta}</Text>
                    </View>
                  ))}
                </View>
              )}
              <Text className="mt-3 pt-3 border-t border-border text-xs text-muted">
                Đổi khu vực bất cứ lúc nào trong mục Tôi.
              </Text>
            </View>
          </View>

          <View className="pb-8 pt-4">
            <GradientButton label="Xem xóm mình có gì" onPress={() => router.replace('/(main)/feed')} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
