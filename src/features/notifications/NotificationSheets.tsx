import { Text, View } from 'react-native';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { type NotificationItem } from './data';

interface Props {
  selected: NotificationItem | null;
  onClose: () => void;
}
export function NotificationSheets({ selected, onClose }: Props) {
  return (
    <BottomSheet visible={selected !== null} onClose={onClose} variant="actions">
      <View className="gap-5 pt-3">
        <Text accessibilityRole="header" className="font-sans-black text-lg text-ink">
          {selected?.title}
        </Text>
        <>
          <Text className="font-sans text-sm leading-[22px] text-ink">
            {selected?.subtitle}
            {selected?.body ? `\n${selected.body}` : ''}
            {selected?.quote ? `\n${selected.quote}` : ''}
          </Text>
          <Text className="font-sans text-xs text-muted">
            {selected?.metadata} • {selected?.time}
          </Text>
          <Text className="font-sans text-xs leading-[18px] text-muted">
            Thông báo minh họa. Nội dung liên kết và chức năng giao dịch chưa được kết nối.
          </Text>
        </>
        <Button label="Đóng" variant="secondary" onPress={onClose} />
      </View>
    </BottomSheet>
  );
}
