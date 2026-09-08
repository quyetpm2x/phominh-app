import { Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { Toggle } from '../../components/ui/Toggle';
import type { PostEdit } from './postEdit';

export function EditDisplaySettings({
  value,
  onChange,
}: {
  value: PostEdit;
  onChange: (value: PostEdit) => void;
}) {
  const rows = [
    {
      key: 'commentsEnabled',
      icon: 'editComments',
      title: 'Cho phép bình luận',
      description: 'Người xung quanh có thể tương tác và thảo luận',
    },
    {
      key: 'notifyReplies',
      icon: 'editNotifications',
      title: 'Thông báo phản hồi mới',
      description: 'Nhận thông báo khi có hàng xóm trả lời',
    },
  ] as const;
  return (
    <View className="gap-2">
      <Text className="font-sans-bold text-xs tracking-[0.6px] text-[#4A4A4A]">CÀI ĐẶT HIỂN THỊ</Text>
      <View className="overflow-hidden rounded-[20px] border border-[#E9ECEF]/80 bg-white">
        {rows.map((row, index) => (
          <View
            key={row.key}
            className={`flex-row items-center gap-2.5 p-3.5 ${index === 0 ? 'border-b border-[#E9ECEF]/60' : ''}`}
          >
            <CustomIcon name={row.icon} size={18} />
            <View className="flex-1">
              <Text className="font-sans-bold text-[13px] leading-5 text-[#1A1A1A]">{row.title}</Text>
              <Text className="font-sans text-[10.5px] leading-4 text-[#4A4A4A]">{row.description}</Text>
            </View>
            <Toggle
              label={row.title}
              value={value[row.key]}
              onValueChange={(next) => onChange({ ...value, [row.key]: next })}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
