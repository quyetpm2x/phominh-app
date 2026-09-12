import { Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { formatCount, type ShopPost } from './data';
import { SHOP_POST_ANALYTICS } from './postDetails';
import { ShopMetrics, type ShopMetric } from './ShopMetrics';

export function ShopPostConversion({ post }: { post: ShopPost }) {
  const analytics = SHOP_POST_ANALYTICS[post.id];
  const metrics: ShopMetric[] = [
    {
      label: 'Lượt xem bài',
      value: formatCount(post.views),
      growth: analytics ? `Từ ${formatCount(analytics.residents)} cư dân lân cận` : '',
      icon: 'eye-outline',
      color: '#FF416C',
      background: '#FFF0F4',
      neutralCaption: true,
    },
    {
      label: 'Lượt bấm gọi điện',
      value: formatCount(post.calls),
      growth: `Tỉ lệ chuyển đổi ${post.views ? ((post.calls / post.views) * 100).toFixed(1) : '0.0'}%`,
      icon: 'call-outline',
      color: '#009977',
      background: '#E9F9F3',
    },
    {
      label: 'Tương tác cảm xúc',
      value: formatCount(post.votes),
      growth: analytics ? `${analytics.likes} thích • ${analytics.hearts} thả tim` : '',
      icon: 'heart-outline',
      color: '#FF416C',
      background: '#FFF0F4',
      neutralCaption: true,
    },
    {
      label: 'Bình luận',
      value: formatCount(post.comments),
      growth: analytics ? `${analytics.replied} đã phản hồi` : '',
      icon: 'chatbubble-ellipses-outline',
      color: '#2B7FFF',
      background: '#EFF6FF',
      neutralCaption: true,
    },
  ];
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-1.5">
        <CustomIcon name="statsGrowth" size={15} />
        <Text accessibilityRole="header" className="font-sans-black text-sm text-ink">
          CHỈ SỐ CHUYỂN ĐỔI
        </Text>
      </View>
      <ShopMetrics metrics={metrics} showGrowthIcon={false} />
    </View>
  );
}
