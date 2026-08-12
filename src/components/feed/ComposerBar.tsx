import { Pressable, Text, View } from 'react-native';

interface ComposerBarProps {
  initial: string;
  onPressInput: () => void;
  onPressMedia: () => void;
  onPressStatus: () => void;
  onVoice: () => void;
}

// Thanh soạn bài đầu feed — bấm vào ô chữ mở thẳng "Viết trạng thái", bấm Ảnh/Video mở sheet chọn
// loại bài (đúng phân biệt trong thiết kế: chữ và ảnh/video là hai lối vào khác nhau).
export function ComposerBar({ initial, onPressInput, onPressMedia, onPressStatus, onVoice }: ComposerBarProps) {
  return (
    <View className="rounded-2xl border border-border bg-white p-3">
      <View className="flex-row items-center gap-2.5">
        <View className="w-[38px] h-[38px] rounded-xl bg-primary items-center justify-center">
          <Text className="font-sans-semibold text-white text-[15px]">{initial}</Text>
        </View>
        <Pressable onPress={onPressInput} className="flex-1 h-[38px] rounded-full bg-cream-dark justify-center px-4">
          <Text className="text-[13.5px] text-muted-light">Có chuyện gì quanh bạn?</Text>
        </Pressable>
        <Pressable onPress={onVoice} className="w-[38px] h-[38px] rounded-xl border border-border bg-white items-center justify-center">
          <Text>🎙</Text>
        </Pressable>
      </View>
      <View className="mt-2.5 pt-2.5 border-t border-border-soft flex-row gap-1">
        <Pressable onPress={onPressMedia} className="flex-1 h-9 flex-row items-center justify-center gap-1.5">
          <View className="w-[15px] h-[15px] rounded bg-primary" />
          <Text className="font-sans-semibold text-xs text-muted">Ảnh</Text>
        </Pressable>
        <Pressable onPress={onPressMedia} className="flex-1 h-9 flex-row items-center justify-center gap-1.5">
          <View className="w-[15px] h-[15px] rounded bg-danger" />
          <Text className="font-sans-semibold text-xs text-muted">Video</Text>
        </Pressable>
        <Pressable onPress={onPressStatus} className="flex-1 h-9 flex-row items-center justify-center gap-1.5">
          <View className="w-[15px] h-[15px] rounded bg-accent-300" />
          <Text className="font-sans-semibold text-xs text-muted">Trạng thái</Text>
        </Pressable>
      </View>
    </View>
  );
}
