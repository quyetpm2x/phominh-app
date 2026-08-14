import { Pressable, Text } from 'react-native';

import { BottomSheet } from './BottomSheet';

export interface ActionSheetItem {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

interface ActionSheetMenuProps {
  visible: boolean;
  onClose: () => void;
  items: ActionSheetItem[];
}

// Menu hành động dùng chung (menu bài đăng, menu bình luận...) — dựng trên BottomSheet có sẵn, mỗi
// hành động tự đóng sheet sau khi bấm.
export function ActionSheetMenu({ visible, onClose, items }: ActionSheetMenuProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      {items.map((item, i) => (
        <Pressable
          key={item.label}
          onPress={() => {
            onClose();
            item.onPress();
          }}
          className={`h-12 items-center justify-center ${i < items.length - 1 ? 'border-b border-border-soft' : ''}`}
        >
          <Text className={`font-sans-semibold text-[15px] ${item.destructive ? 'text-danger' : 'text-ink'}`}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </BottomSheet>
  );
}
