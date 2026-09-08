import { Text, View } from 'react-native';
import { CustomIcon, type CustomIconProps } from '../../components/ui/CustomIcon';
import { distanceCounts, type getPostMetrics, type PostAnalytics } from './data';

interface Props {
  metrics: ReturnType<typeof getPostMetrics>;
  analytics?: PostAnalytics;
}
export function StatisticsMetrics({ metrics, analytics }: Props) {
  const counts = analytics ? distanceCounts(metrics.views, analytics) : [];
  const nearby = analytics
    ? analytics.distances.slice(0, 2).reduce((sum, row) => sum + row.percent, 0)
    : null;
  const cards: {
    icon: CustomIconProps['name'];
    title: string;
    value: string;
    caption: string;
    tone: string;
  }[] = [
    {
      icon: 'statsViews',
      title: 'TỔNG LƯỢT\nXEM',
      value: metrics.views.toLocaleString('en-US'),
      caption: analytics ? `+${analytics.growth}%` : 'Chưa có xu hướng',
      tone: 'bg-primary/10',
    },
    {
      icon: 'statsHeart',
      title: 'TƯƠNG TÁC',
      value: String(metrics.interactions),
      caption: `${metrics.rate}% tỷ lệ`,
      tone: 'bg-[#FB2C36]/10',
    },
    {
      icon: 'statsPin',
      title: `TRONG ${analytics?.radius.toUpperCase() ?? 'BÁN KÍNH'}`,
      value: nearby === null ? '—' : `${nearby}%`,
      caption: analytics ? `${(counts[0] + counts[1]).toLocaleString('en-US')} lượt xem` : 'Chưa có dữ liệu',
      tone: 'bg-[#FE9A00]/10',
    },
  ];
  return (
    <View className="flex-row gap-2.5">
      {cards.map((card, index) => (
        <View
          key={card.icon}
          className="min-h-[142px] flex-1 gap-1 rounded-[20px] border border-[#E9ECEF]/80 bg-white p-3"
        >
          <View className={`h-7 w-7 items-center justify-center rounded-lg ${card.tone}`}>
            <CustomIcon name={card.icon} size={14} />
          </View>
          <Text className="font-sans-bold text-[10px] leading-[15px] tracking-[0.25px] text-[#4A4A4A]">
            {card.title}
          </Text>
          <Text className="font-sans-black text-lg leading-[27px] text-[#1A1A1A]">{card.value}</Text>
          <View className="flex-row items-center gap-0.5">
            {index === 0 && analytics ? <CustomIcon name="statsGrowth" size={10} /> : null}
            <Text
              className={`shrink font-sans-bold text-[10px] leading-[15px] ${index === 0 ? 'text-[#009966]' : index === 2 ? 'text-primary' : 'text-[#4A4A4A]'}`}
            >
              {card.caption}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
