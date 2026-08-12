import { Pressable, Text, View } from 'react-native';

interface EmptyFeedStateProps {
  place: string;
  onCompose: () => void;
  onWiden: () => void;
}

// isThin — feed vắng tin, mời đăng bài đầu tiên hoặc nới bán kính.
export function EmptyFeedState({ place, onCompose, onWiden }: EmptyFeedStateProps) {
  return (
    <View className="rounded-2xl border border-dashed border-strong bg-white px-5 py-6.5 items-center">
      <View className="w-10 h-10 rounded-xl bg-cream-surface mb-3.5" />
      <Text className="font-sans-bold text-[15px] text-ink">Khu này còn vắng</Text>
      <Text className="mt-1.5 text-[13px] leading-[20px] text-muted text-center">
        Mới có 1 bài quanh {place} hôm nay. Đăng một tin để hàng xóm quanh đây bắt đầu.
      </Text>
      <View className="mt-4 flex-row gap-2">
        <Pressable onPress={onCompose} className="h-[38px] rounded-[10px] bg-ink px-3.5 items-center justify-center">
          <Text className="font-sans-semibold text-[13px] text-white">Đăng tin đầu tiên</Text>
        </Pressable>
        <Pressable onPress={onWiden} className="h-[38px] rounded-[10px] border border-strong bg-white px-3.5 items-center justify-center">
          <Text className="font-sans-semibold text-[13px] text-ink">Nới bán kính lên 4 km</Text>
        </Pressable>
      </View>
    </View>
  );
}
