import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/design-tokens';
import { WEEKLY_VIEWS } from './data';

const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
export function ShopViewsChart() {
  return (
    <View className="gap-4 rounded-[20px] border border-[#E9ECEF] bg-white p-4">
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-1 gap-0.5">
          <Text accessibilityRole="header" className="font-sans-bold text-[13px] text-[#1A1A1A]">
            Biểu đồ lượt xem theo ngày
          </Text>
          <Text className="font-sans text-[11px] text-[#4A4A4A]">Trung bình 488 lượt/ngày trong xóm</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <View className="h-2 w-2 rounded-full bg-primary" />
          <Text className="font-sans text-[10px] text-[#4A4A4A]">Tuần này</Text>
        </View>
      </View>
      <View className="flex-row items-end gap-4 border-b border-[#F1F3F5] pb-2">
        {WEEKLY_VIEWS.map((value, index) => (
          <View
            key={DAYS[index]}
            accessible
            accessibilityLabel={`${DAYS[index]}: ${value} lượt xem, dữ liệu mẫu`}
            className="flex-1 items-center gap-2"
          >
            <View
              style={styles.track}
              className="w-full justify-end overflow-hidden rounded-t-md bg-[#F8F9FA]"
            >
              {index === 4 ? (
                <LinearGradient
                  colors={[colors.accent.DEFAULT, colors.primary.DEFAULT]}
                  style={styles.peak}
                />
              ) : (
                <View
                  style={[
                    styles.bar,
                    index === 6 && styles.faded,
                    { height: (value / Math.max(...WEEKLY_VIEWS)) * 128 },
                  ]}
                />
              )}
            </View>
            <Text className={`font-sans-bold text-[10px] ${index === 4 ? 'text-primary' : 'text-[#4A4A4A]'}`}>
              {DAYS[index]}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 128 },
  peak: { height: 128, width: '100%' },
  bar: { backgroundColor: '#FF416C', opacity: 0.5 },
  faded: { opacity: 0.3 },
});
