import { router } from 'expo-router';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientButton } from '../../src/components/ui/Button';
import { MapPlaceholder } from '../../src/components/ui/MapPlaceholder';
import { RadiusCircle, RadiusSlider } from '../../src/components/ui/RadiusSlider';
import { useEditAreaRadius } from '../../src/hooks/useEditAreaRadius';

// isAreas — sửa bán kính khu vực "Nhà" đã lưu, mở từ hồ sơ. Trước đây nút "Lưu khu vực" chỉ
// router.push (không gọi API nào) và cả màn hiện dữ liệu giả từ mocks/phoMinh — đã nối lại bằng
// useEditAreaRadius (đọc/ghi thật qua getFixedAreas/setFixedArea đã có sẵn ở api/client.ts).
export default function AreasScreen() {
  const { area, radiusKm, setRadiusKm, loading, saving, error, save } = useEditAreaRadius('home');

  const onSave = () => {
    void save().then((ok) => {
      if (ok) router.push('/(main)/profile');
      else if (error) Alert.alert('Không lưu được', error);
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!area) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center px-6">
        <Text className="text-center text-sm text-muted">
          Chưa đặt khu vực "Nhà" — vào onboarding hoặc liên hệ hỗ trợ để đặt lại.
        </Text>
      </SafeAreaView>
    );
  }

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
          <MapPlaceholder place={area.addressText}>
            <RadiusCircle valueKm={radiusKm} />
          </MapPlaceholder>
        </View>

        <View className="mt-4 flex-row items-baseline justify-between">
          <Text className="font-sans-semibold text-sm text-ink">Bán kính hiển thị</Text>
          <Text className="font-mono-semibold text-[15px] text-primary">{radiusKm} km</Text>
        </View>
        <View className="mt-2.5">
          <RadiusSlider valueKm={radiusKm} onChange={setRadiusKm} />
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
          <GradientButton label={saving ? 'Đang lưu…' : 'Lưu khu vực'} onPress={onSave} disabled={saving} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
