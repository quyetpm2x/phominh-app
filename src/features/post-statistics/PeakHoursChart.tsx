import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/design-tokens';
import type { PostAnalytics } from './data';
import { StatisticsSection } from './StatisticsSection';

export function PeakHoursChart({ analytics }: { analytics: PostAnalytics }) {
  return (
    <StatisticsSection
      title="Thời điểm xem nhiều nhất"
      icon="statsClock"
      tone="green"
      accessory={
        <Text className="font-sans-bold text-[11px] text-[#4A4A4A]">Cao điểm lúc {analytics.peak}</Text>
      }
    >
      <View
        accessible
        accessibilityLabel={`Biểu đồ lượt xem từ 08h đến 13h. Cao điểm lúc ${analytics.peak}. Dữ liệu mẫu.`}
        className="h-24 flex-row items-end gap-1.5 border-b border-[#E9ECEF]/60 pb-1"
      >
        {analytics.hours.map((hour) => (
          <View key={hour.label} className="flex-1 items-center justify-end gap-1">
            {hour.peak ? (
              <LinearGradient
                colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
                style={[styles.bar, { height: hour.height }]}
              />
            ) : (
              <View style={[styles.bar, { height: hour.height, backgroundColor: hour.color }]} />
            )}
            <Text
              className={`font-sans-bold text-[9px] leading-[14px] ${hour.peak ? 'text-primary' : 'text-[#4A4A4A]'}`}
            >
              {hour.label}
            </Text>
          </View>
        ))}
      </View>
    </StatisticsSection>
  );
}
const styles = StyleSheet.create({ bar: { width: '100%', borderTopLeftRadius: 6, borderTopRightRadius: 6 } });
