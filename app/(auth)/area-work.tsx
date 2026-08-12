import { router } from 'expo-router';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientButton } from '../../src/components/ui/Button';
import { MapAreaPicker } from '../../src/components/ui/MapAreaPicker';
import { RadiusSlider } from '../../src/components/ui/RadiusSlider';
import { useAreaPicker } from '../../src/hooks/useAreaPicker';

const WORK_PIN_COLOR = '#c9a227';

// on.areaWork — khu vực 2/2, chỉ quyết định xem feed nào, bài đăng luôn gắn GPS thật. Có thể "Bỏ
// qua" (không bắt buộc như Nhà) — FixedArea label=work đơn giản không được tạo, feed "Chỗ làm" ẩn.
export default function AreaWorkScreen() {
  const { loading, initialRegion, addressText, radiusKm, setRadiusKm, onCenterChange, save, saving, error } =
    useAreaPicker('work');

  const onSave = async () => {
    const ok = await save();
    if (ok) router.push('/(auth)/done');
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Khu vực 2 / 2</Text>
        <View className="flex-1" />
        <Pressable onPress={() => router.push('/(auth)/done')}>
          <Text className="text-[13.5px] text-muted">Bỏ qua</Text>
        </Pressable>
      </View>

      {loading || !initialRegion ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <MapAreaPicker
          place={addressText}
          initialRegion={initialRegion}
          radiusKm={radiusKm}
          pinColor={WORK_PIN_COLOR}
          onCenterChange={onCenterChange}
        />
      )}

      <View className="px-4.5 pt-3.5 pb-6 bg-cream border-t border-border">
        <View className="flex-row items-baseline justify-between">
          <Text className="font-sans-semibold text-sm text-ink">Bán kính "Chỗ làm"</Text>
          <Text className="font-mono-semibold text-[15px] text-primary">{radiusKm} km</Text>
        </View>
        <View className="mt-2.5">
          <RadiusSlider valueKm={radiusKm} onChange={setRadiusKm} />
        </View>

        <Text className="mt-3 text-xs leading-[22px] text-muted">
          Hai khu vực này chỉ quyết định bạn <Text className="font-sans-bold text-ink">xem</Text> feed nào. Bài bạn
          đăng luôn gắn vị trí GPS thật lúc đăng.
        </Text>

        {error ? <Text className="mt-2 text-xs text-danger">{error}</Text> : null}

        <View className="mt-3.5">
          {saving ? (
            <View className="h-[54px] items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : (
            <GradientButton label="Lưu khu vực" onPress={onSave} disabled={loading} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
