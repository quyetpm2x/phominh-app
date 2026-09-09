import { Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import type { NotificationItem } from './data';
import { NotificationCard } from './NotificationCard';

export function NotificationGroup({
  items,
  unread,
  onOpen,
}: {
  items: NotificationItem[];
  unread?: boolean;
  onOpen: (item: NotificationItem) => void;
}) {
  if (!items.length) return null;
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-1">
        <View className="flex-row items-center gap-1.5">
          {unread ? (
            <View className="h-2 w-2 rounded-full bg-primary" />
          ) : (
            <CustomIcon name="successCheck" size={12} color="#4A4A4A" />
          )}
          <Text className={`font-sans-black text-xs ${unread ? 'text-primary' : 'text-[#4A4A4A]'}`}>
            {unread ? 'CHƯA ĐỌC (MỚI)' : 'ĐÃ ĐỌC'}
          </Text>
        </View>
        <Text className={`font-sans-bold text-[11px] ${unread ? 'text-primary' : 'text-[#4A4A4A]'}`}>
          {items.length} thông báo{unread ? ' mới' : ''}
        </Text>
      </View>
      {items.map((item) => (
        <NotificationCard key={item.id} item={item} onOpen={onOpen} />
      ))}
    </View>
  );
}
