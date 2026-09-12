import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';

export interface ShopMetric {
  label: string;
  value: string;
  growth: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  color: string;
  background: string;
  neutralCaption?: boolean;
}
const METRICS: ShopMetric[] = [
  {
    label: 'Lượt xem',
    value: '3.420',
    growth: '+18.4% so tuần trước',
    icon: 'eye-outline',
    color: '#FF416C',
    background: '#FFF0F4',
  },
  {
    label: 'Vote hữu ích',
    value: '286',
    growth: '+32.0% tăng mạnh',
    icon: 'thumbs-up-outline',
    color: '#FF4B2B',
    background: '#FFF0EB',
  },
  {
    label: 'Tương tác bình luận',
    value: '412',
    growth: '+24.1% tương tác',
    icon: 'chatbubble-ellipses-outline',
    color: '#FF416C',
    background: '#FFF0F4',
  },
  {
    label: 'Bấm gọi / Chat',
    value: '86',
    growth: '+9.5% chuyển đổi',
    icon: 'call-outline',
    color: '#009977',
    background: '#E9F9F3',
  },
];
export function ShopMetrics({
  metrics = METRICS,
  showGrowthIcon = true,
}: {
  metrics?: ShopMetric[];
  showGrowthIcon?: boolean;
}) {
  return (
    <View className="gap-3">
      {[0, 2].map((start) => (
        <View key={start} className="flex-row gap-3">
          {metrics.slice(start, start + 2).map((metric) => (
            <View
              key={metric.label}
              className="flex-1 gap-1 rounded-[20px] border border-[#E9ECEF] bg-white p-3"
            >
              <View className="flex-row items-center justify-between gap-1">
                <Text className="flex-1 font-sans-medium text-[11px] text-[#4A4A4A]">{metric.label}</Text>
                <View
                  style={{ backgroundColor: metric.background }}
                  className="h-7 w-7 items-center justify-center rounded-lg"
                >
                  <Ionicons name={metric.icon} size={15} color={metric.color} />
                </View>
              </View>
              <Text className="font-sans-black text-[24px] leading-8 text-[#1A1A1A]">{metric.value}</Text>
              <View className="flex-row items-center gap-1">
                {showGrowthIcon ? <CustomIcon name="statsGrowth" size={12} /> : null}
                <Text
                  className={`flex-shrink text-[10px] ${metric.neutralCaption ? 'font-sans text-[#4A4A4A]' : 'font-sans-bold text-[#009977]'}`}
                >
                  {metric.growth}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
