import { Pressable, Text, View } from 'react-native';

interface ToastStripProps {
  variant: 'fav' | 'undo' | 'success';
  text: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

// Dải toast ngắn — dùng cho "đã thêm người quen", "vừa ẩn 1 bài, hoàn tác?", xác nhận vote.
export function ToastStrip({ variant, text, actionLabel, onAction, onDismiss }: ToastStripProps) {
  const dark = variant === 'undo';
  return (
    <View
      className={`flex-row items-center gap-2.5 rounded-2xl px-3.5 py-3 ${
        dark ? 'bg-ink' : 'bg-primary-50 border border-primary-100'
      }`}
    >
      {variant === 'fav' ? (
        <View className="w-[18px] h-[18px] rounded-full bg-primary items-center justify-center">
          <Text className="text-white text-[9px]">★</Text>
        </View>
      ) : null}
      <Text className={`flex-1 font-sans-semibold text-[13px] ${dark ? 'text-cream' : 'text-primary'}`}>{text}</Text>
      {actionLabel ? (
        <Pressable onPress={onAction}>
          <Text className={`font-sans-semibold text-xs ${dark ? 'text-primary-100' : 'text-primary'}`}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
      <Pressable onPress={onDismiss}>
        <Text className={dark ? 'text-muted-faint' : 'text-muted'}>×</Text>
      </Pressable>
    </View>
  );
}
