import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet } from '../ui/BottomSheet';

interface CreateSheetProps {
  visible: boolean;
  onClose: () => void;
}

const OPTIONS = [
  { label: 'Chụp ảnh tại chỗ', hint: 'Ảnh gắn kèm thời gian & vị trí', href: '/post/create/camera' as const },
  { label: 'Chụp nhanh kiểu Locket', hint: 'Một chạm, gửi thẳng lên xóm, ẩn sau 12 giờ', href: '/post/create/quick' as const },
  { label: 'Viết trạng thái', hint: 'Không cần ảnh', href: '/post/create/status' as const },
  { label: 'Đăng bằng giọng nói', hint: 'Nói 5–10 giây, app tự chuyển thành chữ', href: '/post/create/voice' as const },
];

// sheetOpen — "Bạn muốn đăng gì?" chọn loại bài rồi mới mở camera/soạn bài.
export function CreateSheet({ visible, onClose }: CreateSheetProps) {
  const go = (href: (typeof OPTIONS)[number]['href']) => {
    onClose();
    router.push(href);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text className="text-[17px] font-sans-bold text-ink">Bạn muốn đăng gì?</Text>
      <Text className="mt-1 text-xs text-muted">Chọn loại bài rồi mới mở camera.</Text>
      <View className="mt-3.5 gap-2.5">
        {OPTIONS.map((opt) => (
          <Pressable
            key={opt.label}
            onPress={() => go(opt.href)}
            className="rounded-2xl border border-border bg-white px-3.5 py-3"
          >
            <Text className="font-sans-bold text-sm text-ink">{opt.label}</Text>
            <Text className="mt-0.5 text-xs text-muted">{opt.hint}</Text>
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
}
