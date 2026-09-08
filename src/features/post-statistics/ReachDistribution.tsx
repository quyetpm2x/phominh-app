import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/design-tokens';
import { distanceCounts, type PostAnalytics } from './data';
import { StatisticsSection } from './StatisticsSection';

export function ReachDistribution({ analytics, views }: { analytics: PostAnalytics; views: number }) {
  const counts = distanceCounts(views, analytics);
  return (
    <StatisticsSection
      title="Phân bổ cự ly tiếp cận"
      icon="statsRadius"
      accessory={
        <Text className="rounded-full bg-primary/10 px-2 py-0.5 font-sans-bold text-[11px] text-primary">
          Bán kính {analytics.radius}
        </Text>
      }
    >
      {analytics.distances.map((row, index) => (
        <View key={row.label} className="gap-1.5">
          <View className="flex-row flex-wrap items-center justify-between gap-1">
            <Text className="font-sans-bold text-[11.5px] leading-[17px] text-[#4A4A4A]">{row.label}</Text>
            <Text className="font-sans-black text-[11.5px] leading-[17px] text-[#1A1A1A]">
              {row.percent}% ({counts[index]} lượt)
            </Text>
          </View>
          <View
            accessibilityRole="progressbar"
            accessibilityLabel={row.label}
            accessibilityValue={{ min: 0, max: 100, now: row.percent }}
            className="h-2.5 overflow-hidden rounded-full bg-[#F1F3F5]"
          >
            {index === 0 ? (
              <LinearGradient
                colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
                style={[styles.bar, { width: `${row.percent}%` }]}
              />
            ) : (
              <View style={[styles.bar, { width: `${row.percent}%`, backgroundColor: row.color }]} />
            )}
          </View>
        </View>
      ))}
    </StatisticsSection>
  );
}
const styles = StyleSheet.create({ bar: { height: 10, borderRadius: 10 } });
