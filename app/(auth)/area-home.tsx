import { router } from 'expo-router';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientButton } from '../../src/components/ui/Button';
import { MapAreaPicker } from '../../src/components/ui/MapAreaPicker';
import { RadiusSlider } from '../../src/components/ui/RadiusSlider';
import { useAreaPicker } from '../../src/hooks/useAreaPicker';

// on.areaHome — khu vực 1/2, chọn bán kính "Nhà". Bản đồ thật (react-native-maps): pin cố định
// giữa màn, kéo bản đồ để chọn vị trí, địa chỉ hiện lên tự động qua reverse geocode.
export default function AreaHomeScreen() {
  const { loading, initialRegion, addressText, radiusKm, setRadiusKm, onCenterChange, save, saving, error } =
    useAreaPicker('home');

  const onSave = async () => {
    const ok = await save();
    if (ok) router.push('/(auth)/area-work');
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Khu vực 1 / 2</Text>
        <View className="flex-1" />
        <Text className="font-mono-medium text-[11px] text-muted">NHÀ</Text>
      </View>

      {loading || !initialRegion ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <MapAreaPicker place={addressText} initialRegion={initialRegion} radiusKm={radiusKm} onCenterChange={onCenterChange} />
      )}

      <View className="px-4.5 pt-3.5 pb-6 bg-cream border-t border-border">
        <View className="flex-row items-baseline justify-between">
          <Text className="font-sans-semibold text-sm text-ink">Bán kính "Nhà"</Text>
          <Text className="font-mono-semibold text-[15px] text-primary">{radiusKm} km</Text>
        </View>
        <View className="mt-2.5">
          <RadiusSlider valueKm={radiusKm} onChange={setRadiusKm} />
        </View>
        {error ? <Text className="mt-2 text-xs text-danger">{error}</Text> : null}
        <View className="mt-3.5">
          {saving ? (
            <View className="h-[54px] items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : (
            <GradientButton label="Lưu & chọn chỗ làm" onPress={onSave} disabled={loading} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
