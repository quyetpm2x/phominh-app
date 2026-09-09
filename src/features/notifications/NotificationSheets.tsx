import { Text, View } from 'react-native';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { Toggle } from '../../components/ui/Toggle';
import { NOTIFICATION_FILTERS, type NotificationCategory, type NotificationItem } from './data';

interface Props {
  settingsOpen: boolean;
  selected: NotificationItem | null;
  preferences: Record<NotificationCategory, boolean>;
  onPreference: (category: NotificationCategory, value: boolean) => void;
  onClose: () => void;
}
export function NotificationSheets({ settingsOpen, selected, preferences, onPreference, onClose }: Props) {
  return (
    <BottomSheet visible={settingsOpen || selected !== null} onClose={onClose} variant="actions">
      <View className="gap-5 pt-3">
        <Text accessibilityRole="header" className="font-sans-black text-lg text-ink">
          {settingsOpen ? 'Cài đặt thông báo' : selected?.title}
        </Text>
        {settingsOpen ? (
          <>
            {NOTIFICATION_FILTERS.filter((item) => item.key !== 'all').map((item) => (
              <View key={item.key} className="flex-row items-center justify-between">
                <Text className="font-sans text-sm text-ink">{item.label}</Text>
                <Toggle
                  label={item.label}
                  value={preferences[item.key as NotificationCategory]}
                  onValueChange={(value) => onPreference(item.key as NotificationCategory, value)}
                />
              </View>
            ))}
            <Text className="font-sans text-xs leading-[18px] text-muted">
              Tùy chọn chỉ áp dụng cho danh sách mẫu trong lần mở trang này.
            </Text>
          </>
        ) : (
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
        )}
        <Button label="Đóng" variant="secondary" onPress={onClose} />
      </View>
    </BottomSheet>
  );
}
