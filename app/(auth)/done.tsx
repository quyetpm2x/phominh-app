import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getFixedAreas, type FixedArea } from '../../src/api/client';
import { colors } from '../../src/constants/design-tokens';
import { NEARBY_RADIUS_KM } from '../../src/constants/geo';
import { DoneBadgeIcon } from '../../src/components/DoneBadgeIcon';
import { GpsStatusRow } from '../../src/components/GpsStatusRow';
import { GradientSubmitButton } from '../../src/components/ui/GradientSubmitButton';

// STATS (quán mở/hàng xóm/tin hôm nay) CHƯA nối data thật — cần đếm user/merchant/post trong bán
// kính qua PostGIS, nhưng tính năng đăng bài/merchant chưa xây (mới tới Onboarding, TẦNG 1). Giữ
// minh hoạ tạm, không giả vờ gọi API trả về toàn số 0 gây hiểu lầm là bug.
const STATS = [
  { value: '37', label: 'Quán mở', valueClassName: 'text-ink' },
  { value: '1.2k', label: 'Hàng xóm', valueClassName: 'text-primary', highlight: true },
  { value: '41', label: 'Tin mới', valueClassName: 'text-accent' },
];

// on.onboardDone — xác nhận đã sẵn sàng, tổng kết những gì đang chờ. Khu vực đã cài lấy từ
// GET /api/mobile/users/me/areas (data thật vừa lưu ở area-home.tsx/area-work.tsx). Giao diện làm
// lại theo mockup 2026-08-26 (nền cream trơn + 2 khối trang trí thay vì gradient kem cũ còn sót lại
// từ trước rebrand hồng-cam) — mockup dùng text/số minh hoạ cố định ("Duy Tân", "1.5km", "1.2k hàng
// xóm") nhưng màn này đã có sẵn data thật (khu vực/bán kính vừa lưu) nên GIỮ NGUYÊN phần đó, chỉ đổi
// giao diện; riêng STATS vẫn là số minh hoạ như trước (lý do ở comment trên).
export default function OnboardDoneScreen() {
  const [areas, setAreas] = useState<FixedArea[] | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'checking' | 'on' | 'off'>('checking');
  const [gpsPlace, setGpsPlace] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setAreas(await getFixedAreas());
      } catch {
        setAreas([]);
      }
    })();
  }, []);

  // Vị trí hiện tại — chỉ hiện "Đang bật" nếu THẬT SỰ đã cấp quyền (permissions.tsx không bắt buộc
  // cấp quyền nào), cùng cách lấy toạ độ + reverse-geocode như tab "Quanh đây" ở feed.tsx.
  useEffect(() => {
    (async () => {
      try {
        const perm = await Location.getForegroundPermissionsAsync();
        if (perm.status !== 'granted') {
          setGpsStatus('off');
          return;
        }
        const pos = await Location.getCurrentPositionAsync({});
        const results = await Location.reverseGeocodeAsync({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        const r = results[0];
        setGpsPlace([r?.street, r?.district || r?.subregion || r?.city].filter(Boolean).join(', ') || 'Vị trí hiện tại');
        setGpsStatus('on');
      } catch {
        setGpsStatus('off');
      }
    })();
  }, []);

  const home = areas?.find((a) => a.label === 'home');
  const work = areas?.find((a) => a.label === 'work');

  interface AreaRow {
    name: string;
    meta: string;
    icon: 'home' | 'briefcase';
    tint: string;
  }

  const areaRows: AreaRow[] = [];
  if (home) {
    areaRows.push({ name: 'Nhà', meta: `${home.addressText} (${home.radiusKm}km)`, icon: 'home', tint: colors.primary.DEFAULT });
  }
  if (work) {
    areaRows.push({ name: 'Chỗ làm', meta: `${work.addressText} (${work.radiusKm}km)`, icon: 'briefcase', tint: colors.accent.DEFAULT });
  }

  const introText = home
    ? `Đây là những gì đang chờ bạn trong bán kính ${home.radiusKm}km quanh ${home.addressText}.`
    : 'Đây là những gì đang chờ bạn quanh khu vực bạn đã chọn.';

  return (
    <SafeAreaView className="flex-1 bg-cream">
      {/* Blur thật (BlurView, không phải hình tròn nền phẳng) — cùng kỹ thuật AuthDecorativeBlobs:
          lớp màu (LinearGradient, overflow hidden theo đúng hình tròn) + lớp BlurView phủ RỘNG HƠN
          40px mỗi phía để giả lập blur-3xl. */}
      <View
        style={{ position: 'absolute', top: -128, right: -128, width: 320, height: 320, borderRadius: 160, overflow: 'hidden' }}
      >
        <LinearGradient colors={[`${colors.primary.DEFAULT}33`, `${colors.accent.DEFAULT}1a`]} style={{ flex: 1 }} />
      </View>
      <BlurView
        intensity={35}
        tint="light"
        style={{ position: 'absolute', top: -168, right: -168, width: 400, height: 400, borderRadius: 200 }}
      />
      <View
        style={{ position: 'absolute', bottom: -128, left: -128, width: 320, height: 320, borderRadius: 160, overflow: 'hidden' }}
      >
        <LinearGradient colors={[`${colors.accent.DEFAULT}1a`, 'transparent']} style={{ flex: 1 }} />
      </View>
      <BlurView
        intensity={35}
        tint="light"
        style={{ position: 'absolute', bottom: -168, left: -168, width: 400, height: 400, borderRadius: 200 }}
      />

      <ScrollView contentContainerClassName="flex-1 px-6 pt-10 pb-8" bounces={false}>
        <View className="flex-1 items-center justify-center">
          <DoneBadgeIcon />

          <Text className="mt-2 text-[30px] leading-[34px] font-sans-black tracking-tight text-ink text-center">
            Xong rồi,{'\n'}
            <Text className="text-accent">xóm của bạn đã sẵn sàng</Text>
          </Text>
          <Text className="mt-3 text-[15px] leading-[23px] font-sans-medium text-muted text-center px-2">
            {introText}
          </Text>

          <View className="mt-8 flex-row gap-2.5 w-full">
            {STATS.map((s) => (
              <View
                key={s.label}
                className={`flex-1 items-center rounded-2xl bg-white p-3.5 ${
                  s.highlight ? 'border-2 border-primary/30 shadow-sm' : 'border border-border'
                }`}
              >
                <Text className={`font-sans-black text-[21px] leading-none ${s.valueClassName}`}>{s.value}</Text>
                <Text className="mt-1 text-[9px] font-sans-bold uppercase tracking-widest text-muted-light">
                  {s.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="gap-4 pt-6">
          <View
            style={{
              shadowColor: '#787878',
              shadowOpacity: 0.15,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 12 },
              elevation: 8,
            }}
            className="rounded-3xl border border-white bg-white/90 p-5"
          >
            <Text className="font-mono-medium text-[10px] tracking-[2px] text-muted-light">
              KHU VỰC HOẠT ĐỘNG & ĐỊNH VỊ
            </Text>
            {areas === null ? (
              <View className="mt-3 items-center py-2">
                <ActivityIndicator />
              </View>
            ) : (
              <View className="mt-3.5 gap-3.5">
                <GpsStatusRow status={gpsStatus} place={gpsPlace} radiusKm={NEARBY_RADIUS_KM} />
                {areaRows.map((a) => (
                  <View key={a.name} className="flex-row items-center gap-3">
                    <View
                      style={{ backgroundColor: `${a.tint}1a` }}
                      className="h-11 w-11 items-center justify-center rounded-xl"
                    >
                      <Ionicons name={a.icon} size={19} color={a.tint} />
                    </View>
                    <View className="flex-1">
                      <Text className="font-sans-bold text-sm text-ink">{a.name}</Text>
                      <Text numberOfLines={1} className="text-xs font-sans-medium text-muted">
                        {a.meta}
                      </Text>
                    </View>
                    <Ionicons name="checkmark-circle" size={18} color={a.tint} />
                  </View>
                ))}
              </View>
            )}
            <Text className="mt-3.5 pt-3.5 border-t border-border text-xs text-muted">
              Đổi khu vực bất cứ lúc nào trong mục Tôi.
            </Text>
          </View>

          <GradientSubmitButton
            label="Khám phá xóm mình ngay"
            icon="arrow-forward"
            disabled={false}
            loading={false}
            onPress={() => router.replace('/(main)/feed')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
