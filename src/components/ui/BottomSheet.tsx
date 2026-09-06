import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onDismiss?: () => void;
  children: ReactNode;
}

// Sheet trượt lên từ đáy màn hình — dùng cho menu tạo bài, bộ lọc, menu bài đăng (menuOpen/sheetOpen
// trong thiết kế). Bấm ra ngoài (backdrop) để đóng, giống hành vi trong Phố Mình.dc.html.
export function BottomSheet({ visible, onClose, onDismiss, children }: BottomSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} onDismiss={onDismiss}>
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-ink/40" onPress={onClose} />
        <View className="rounded-t-3xl bg-cream px-5 pb-8 pt-4">
          <View className="mx-auto mb-4 h-1 w-9 rounded-full bg-border" />
          {children}
        </View>
      </View>
    </Modal>
  );
}
