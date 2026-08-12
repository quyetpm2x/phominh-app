import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientButton } from '../../src/components/ui/Button';
import { MapPlaceholder } from '../../src/components/ui/MapPlaceholder';
import { RadiusCircle, RadiusSlider } from '../../src/components/ui/RadiusSlider';
import { areas } from '../../src/mocks/phoMinh';

// isAreas — sửa bán kính khu vực "Nhà" đã lưu, mở từ hồ sơ.
export default function AreasScreen() {
  const [radius, setRadius] = useState(areas.home.radiusKm);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border">
        <Pressable onPress={() => router.push('/(main)/profile')} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Khu vực "Nhà"</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <View className="h-[180px] rounded-2xl overflow-hidden border border-strong">
          <MapPlaceholder place={areas.home.place}>
            <RadiusCircle valueKm={radius} />
          </MapPlaceholder>
        </View>

        <View className="mt-4 flex-row items-baseline justify-between">
          <Text className="font-sans-semibold text-sm text-ink">Bán kính hiển thị</Text>
          <Text className="font-mono-semibold text-[15px] text-primary">{radius} km</Text>
        </View>
        <View className="mt-2.5">
          <RadiusSlider valueKm={radius} onChange={setRadius} />
        </View>
        <Text className="mt-2.5 text-xs leading-[19px] text-muted">
          Nội đô Hà Nội đủ dày dân để bán kính nhỏ vẫn có tin. Nới rộng quá thì mất cảm giác hàng xóm.
        </Text>

        <Text className="mt-5.5 font-mono-medium text-xs tracking-wide text-muted">THÔNG BÁO</Text>
        <View className="mt-2.5 rounded-[13px] border border-border bg-white p-3.5">
          <View className="flex-row items-center">
            <Text className="flex-1 text-sm text-ink">Gom tin gửi một lần</Text>
            <Text className="font-mono-semibold text-[12.5px] text-ink">Thứ Ba, 19:00</Text>
          </View>
          <Text className="mt-2 text-xs leading-[19px] text-muted">
            Không báo ngay từng tin. Chỉ tin khẩn cấp đã được nhiều người xác nhận mới gửi ngay.
          </Text>
        </View>

        <View className="mt-5.5">
          <GradientButton label="Lưu khu vực" onPress={() => router.push('/(main)/profile')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
