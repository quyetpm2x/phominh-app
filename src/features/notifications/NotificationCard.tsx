import { Pressable, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { CustomIcon } from '../../components/ui/CustomIcon';
import type { NotificationItem } from './data';
import { getNotificationPresentation } from './presentation';

export function NotificationCard({
  item,
  onOpen,
}: {
  item: NotificationItem;
  onOpen: (item: NotificationItem) => void;
}) {
  const { color, icon, badge, cardStyle, iconStyle } = getNotificationPresentation(item.type, item.read);
  const highlightSubtitle = item.type === 'reward' || item.type === 'reputation';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.read ? 'Đã đọc' : 'Chưa đọc'}. ${item.title}${item.subtitle ?? ''}. ${item.time}`}
      onPress={() => onOpen(item)}
      className="flex-row items-start gap-3 rounded-[22px] border p-3.5"
      style={cardStyle}
    >
      <View className="mt-0.5">
        {item.initial ? (
          <Avatar initial={item.initial} size={44} radius={12} color={color} />
        ) : (
          <View className="h-11 w-11 items-center justify-center rounded-xl border" style={iconStyle}>
            <CustomIcon name={icon} size={24} color={color} />
          </View>
        )}
        <View
          className="absolute -bottom-1 -right-1 h-5 w-5 items-center justify-center rounded-full border border-white"
          style={{ backgroundColor: color }}
        >
          <CustomIcon name={badge} size={item.type === 'reward' ? 7 : 10} color="#FFFFFF" />
        </View>
      </View>
      <View className="flex-1 gap-2">
        <View className="flex-row items-start justify-between gap-2">
          <Text className="flex-1 font-sans-bold text-[13px] leading-[19px] text-[#1A1A1A]">
            {item.title}
            <Text
              className={highlightSubtitle ? 'font-sans-black' : 'font-sans'}
              style={highlightSubtitle ? { color: color } : undefined}
            >
              {item.subtitle}
            </Text>
          </Text>
          <View className="flex-row items-center gap-1.5">
            <Text
              className="font-sans-bold text-[10px] leading-[17px]"
              style={{ color: item.read ? '#4A4A4A' : color }}
            >
              {item.time}
            </Text>
            {!item.read ? <View className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} /> : null}
          </View>
        </View>
        {item.quote ? (
          <View className="rounded-[16px] border border-primary/15 bg-white/70 p-2.5">
            <Text className="font-sans-bold text-xs leading-[18px] text-[#1A1A1A]">{item.quote}</Text>
          </View>
        ) : null}
        {item.body ? (
          <Text className="font-sans text-xs leading-[19px] text-[#4A4A4A]">{item.body}</Text>
        ) : null}
        {item.metadata ? (
          <View className="flex-row flex-wrap items-center gap-2">
            {item.type === 'comment' ? (
              <View className="flex-row items-center gap-1">
                <CustomIcon name="feedLocation" size={11} color={color} />
                <Text className="font-sans text-[11px] text-[#4A4A4A]">{item.metadata}</Text>
              </View>
            ) : (
              <Text
                className={
                  item.type === 'reward'
                    ? 'rounded-full border px-2 py-1 font-sans-bold text-[11px]'
                    : 'rounded-[6px] px-2 py-1 font-sans-bold text-[11px]'
                }
                style={{
                  color: color,
                  backgroundColor: `${color}18`,
                  ...(item.type === 'reward' ? { borderColor: `${color}40` } : {}),
                }}
              >
                {item.metadata}
              </Text>
            )}
            <Text className="font-sans-bold text-[11px] text-[#4A4A4A]">•</Text>
            <Text
              className={
                item.type === 'shop'
                  ? 'font-sans-bold text-[11px] text-[#4A4A4A]'
                  : 'font-sans-bold text-[11px] text-primary'
              }
            >
              {item.action}
              {item.type === 'reward' ? ' ›' : ''}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
