import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { FilterChip } from '../../components/ui/Chip';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { NOTIFICATION_FILTERS, type NotificationFilter } from './data';

interface Props {
  unread: number;
  filter: NotificationFilter;
  onFilter: (filter: NotificationFilter) => void;
  onReadAll: () => void;
  onSettings: () => void;
}
export function NotificationsHeader({ unread, filter, onFilter, onReadAll, onSettings }: Props) {
  return (
    <View className="bg-white">
      <View className="flex-row items-center gap-2.5 px-4 pb-4 pt-3">
        <View className="h-11 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/5">
          <CustomIcon name="feedBellHeader" size={24} color="#FF416C" />
        </View>
        <View className="flex-1 gap-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text accessibilityRole="header" className="font-sans-black text-xl text-[#1A1A1A]">
              Thông báo
            </Text>
            {unread > 0 ? (
              <Text className="rounded-full bg-primary px-2 py-0.5 font-sans-bold text-[10px] text-white">
                {unread} mới
              </Text>
            ) : null}
          </View>
          <Text className="font-sans text-xs leading-[18px] text-[#4A4A4A]">
            Cập nhật tương tác, quán xá & phần thưởng
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Đánh dấu tất cả đã đọc"
          disabled={unread === 0}
          accessibilityState={{ disabled: unread === 0 }}
          onPress={onReadAll}
          className="h-10 w-10 items-center justify-center rounded-xl bg-[#F1F3F5]/60"
        >
          <CustomIcon name="checkmarkDone" size={20} color={unread ? '#FF416C' : '#A0A0A0'} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cài đặt thông báo"
          onPress={onSettings}
          className="h-10 w-10 items-center justify-center rounded-xl bg-[#F1F3F5]/60"
        >
          <Ionicons name="settings-outline" size={20} color="#1A1A1A" />
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="border-y border-[#E9ECEF]/60"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
      >
        {NOTIFICATION_FILTERS.map((item) => (
          <FilterChip
            key={item.key}
            label={item.label}
            selected={filter === item.key}
            filled
            accessibilityRole="tab"
            accessibilityState={{ selected: filter === item.key }}
            onPress={() => onFilter(item.key)}
            icon={
              <CustomIcon
                name={item.icon}
                size={14}
                color={filter === item.key ? '#FFFFFF' : item.key === 'rewards' ? '#00A982' : '#FF416C'}
              />
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
