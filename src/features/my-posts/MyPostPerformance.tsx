import { Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import type { MyPost } from './data';

export function MyPostPerformance({ post }: { post: MyPost }) {
  const metrics = [
    { label: 'LƯỢT XEM', value: post.views, color: '#1A1A1A' },
    { label: 'HỮU ÍCH', value: post.likes, color: '#FF416C' },
    { label: 'PHẢN HỒI', value: post.comments, color: '#2B7FFF' },
    { label: 'TIẾP CẬN', value: `${post.reach}+`, color: '#FF416C' },
  ];
  return (
    <View className="gap-3 rounded-[20px] border border-[#F1F3F5] bg-[#FAFAFA] p-3">
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-1">
          <CustomIcon name="statsGrowth" size={12} color="#FF416C" />
          <Text className="font-sans-black text-[11px] text-[#1A1A1A]">HIỆU QUẢ TIN ĐĂNG</Text>
        </View>
        <Text className="rounded-full bg-[#E9F9F3] px-2 py-0.5 font-sans-bold text-[9px] text-[#009977]">
          {post.remainingHours ? '• Hiển thị tốt' : 'Đã kết thúc'}
        </Text>
      </View>
      <View className="flex-row gap-1.5">
        {metrics.map((metric) => (
          <View
            key={metric.label}
            className="flex-1 items-center gap-1 rounded-xl border border-[#F1F3F5] bg-white py-2"
          >
            <Text className="font-sans-medium text-[9px] text-[#4A4A4A]">{metric.label}</Text>
            <Text className="font-sans-black text-[13px]" style={{ color: metric.color }}>
              {metric.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
