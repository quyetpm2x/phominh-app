import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '../constants/design-tokens';

interface HighlightToolbarProps {
  hasSelection: boolean;
  hasHighlight: boolean;
  onHighlight: () => void;
  onClear: () => void;
}

// Tô nổi 1 cụm từ trong content (khác PostStyleTools — cái đó style CẢ đoạn). Bôi đen 1 đoạn trong
// TextInput ở caption.tsx rồi bấm nút này — content được bọc thẳng bằng `==...==` (highlightMarkup.ts),
// không có field riêng nào ở backend, xem HighlightedText.tsx phần hiển thị lại.
export function HighlightToolbar({ hasSelection, hasHighlight, onHighlight, onClear }: HighlightToolbarProps) {
  return (
    <View className="mt-3 gap-1.5">
      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={onHighlight}
          disabled={!hasSelection}
          className={`flex-row items-center gap-1.5 h-8 rounded-full border px-3 ${
            hasSelection ? 'border-primary bg-primary-50' : 'border-border bg-white opacity-50'
          }`}
        >
          <Ionicons
            name="color-fill"
            size={13}
            color={hasSelection ? colors.primary.DEFAULT : colors.muted.DEFAULT}
          />
          <Text className={`font-sans-semibold text-xs ${hasSelection ? 'text-primary' : 'text-muted'}`}>
            Tô nổi đoạn đã chọn
          </Text>
        </Pressable>
        {hasHighlight ? (
          <Pressable
            onPress={onClear}
            className="h-8 items-center justify-center rounded-full border border-border bg-white px-3"
          >
            <Text className="font-sans-semibold text-xs text-muted">Xoá tô nổi</Text>
          </Pressable>
        ) : null}
      </View>
      <Text className="text-[11px] leading-[16px] text-muted-light">
        Bôi đen 1 đoạn trong nội dung rồi bấm "Tô nổi" — vd "5 suất bún chả nem cua bể".
      </Text>
    </View>
  );
}
