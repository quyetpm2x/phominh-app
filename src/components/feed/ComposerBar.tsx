import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '../../constants/design-tokens';

interface ComposerBarProps {
  initial: string;
  onPress: () => void;
}

// Gộp lại thành 1 ô bấm duy nhất theo mockup 2026-08-26 (trước đó có thêm hàng 3 nút tắt Ảnh/Video/
// Trạng thái + icon mic riêng bên dưới) — bấm vào mở thẳng CreateSheet, nơi đã có đủ cả 4 lối vào
// (chụp ảnh/Locket/viết trạng thái/giọng nói), không mất tính năng nào, chỉ gọn giao diện.
export function ComposerBar({ initial, onPress }: ComposerBarProps) {
  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-white p-3.5">
      <View className="w-10 h-10 rounded-xl bg-primary items-center justify-center">
        <Text className="font-sans-semibold text-white text-[15px]">{initial}</Text>
      </View>
      <Pressable
        onPress={onPress}
        className="flex-1 h-[42px] flex-row items-center justify-between rounded-xl bg-cream-surface/70 border border-border/60 px-4"
      >
        <Text className="flex-1 text-[13px] font-sans-medium text-muted" numberOfLines={1}>
          Khu bạn có gì mới hôm nay?
        </Text>
        <View className="ml-2 flex-row items-center gap-1">
          <Ionicons name="create-outline" size={14} color={colors.primary.DEFAULT} />
          <Text className="font-sans-bold text-xs text-primary">Đăng tin</Text>
        </View>
      </Pressable>
    </View>
  );
}
