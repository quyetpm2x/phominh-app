import { Pressable, Text, View } from 'react-native';

interface NearBannerProps {
  place: string;
  onSave: () => void;
}

// isNear — hiện khi vị trí GPS hiện tại không trùng Nhà/Chỗ làm đã lưu.
export function NearBanner({ place, onSave }: NearBannerProps) {
  return (
    <View className="flex-row items-center gap-2.5 rounded-2xl bg-white border border-dashed border-accent-300 px-3.5 py-2.5">
      <View className="w-2 h-2 rounded-full bg-accent-300" />
      <Text className="flex-1 text-xs leading-[19px] text-muted">
        Bạn đang ở <Text className="font-sans-bold text-ink">{place}</Text> — không phải Nhà hay Chỗ làm. Đây là tin
        quanh chỗ bạn đứng lúc này.
      </Text>
      <Pressable onPress={onSave}>
        <Text className="font-sans-semibold text-xs text-accent-text">Lưu khu này</Text>
      </Pressable>
    </View>
  );
}
