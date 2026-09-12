import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/design-tokens';
import { StatisticsSection } from '../post-statistics/StatisticsSection';
import { formatCount, type ShopPost } from './data';
import { SHOP_POST_ANALYTICS } from './postDetails';

export function ShopPostAudience({ post }: { post: ShopPost }) {
  const analytics = SHOP_POST_ANALYTICS[post.id];
  if (!analytics)
    return (
      <Text className="font-sans text-sm text-muted">
        Chưa có dữ liệu phân phối và khung giờ cho bài viết này.
      </Text>
    );
  return (
    <>
      <StatisticsSection
        title="Bán kính phân phối thực tế"
        icon="statsPin"
        accessory={
          <Text className="rounded-full bg-primary/10 px-2 py-1 font-sans-bold text-[11px] text-primary">
            {post.radius}
          </Text>
        }
      >
        <Text className="font-sans text-[11px] text-muted">Độ phủ bài viết theo khoảng cách từ quán</Text>
        {analytics.distances.map((row) => {
          const percent = post.views ? Math.round((row.views / post.views) * 100) : 0;
          return (
            <View key={row.label} className="gap-1.5">
              <View className="flex-row flex-wrap justify-between gap-1">
                <Text className="font-sans-medium text-[11px] text-ink">{row.label}</Text>
                <Text className="font-sans-bold text-[11px] text-ink">
                  {formatCount(row.views)} xem ({percent}%)
                </Text>
              </View>
              <View
                accessibilityRole="progressbar"
                accessibilityLabel={row.label}
                accessibilityValue={{ min: 0, max: 100, now: percent }}
                className="h-2 overflow-hidden rounded-full bg-[#F1F3F5]"
              >
                <LinearGradient
                  colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
                  style={[styles.bar, { width: `${percent}%` }]}
                />
              </View>
            </View>
          );
        })}
      </StatisticsSection>
      <StatisticsSection title="Khung giờ khách xem nhiều nhất" icon="statsClock">
        <View className="flex-row gap-2">
          {analytics.hours.map((hour) => (
            <View
              key={hour.label}
              className="flex-1 items-center gap-1.5 rounded-[14px] border border-[#E9ECEF]/70 bg-[#F8F9FA] px-1 py-3"
            >
              <Text className="font-sans text-[10px] text-muted">{hour.label}</Text>
              <Text className={`font-sans-black text-xs ${hour.peak ? 'text-primary' : 'text-ink'}`}>
                {formatCount(hour.views)} lượt
              </Text>
              <Text
                className={`text-[9px] ${hour.peak ? 'font-sans-bold text-[#009977]' : 'font-sans text-muted'}`}
              >
                {hour.caption}
              </Text>
            </View>
          ))}
        </View>
      </StatisticsSection>
    </>
  );
}
const styles = StyleSheet.create({ bar: { height: 8, borderRadius: 8 } });
