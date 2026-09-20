import { ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FilterChip } from '../../components/ui/Chip';
import { balanceFilters, type BalanceFilter } from './balanceHistory';
export function BalanceFilters({
  value,
  onChange,
}: {
  value: BalanceFilter;
  onChange: (value: BalanceFilter) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={styles.container}
    >
      {balanceFilters.map((filter, index) => (
        <LinearGradient
          key={filter.key}
          colors={value === filter.key ? ['#FF416C', '#FF4B2B'] : ['#F1F3F5', '#F1F3F5']}
          style={[styles.gradient, { width: [71.711, 104.469, 94.031, 81.625, 88.953][index] }]}
        >
          <FilterChip
            label={filter.label}
            selected={value === filter.key}
            filled
            accessibilityRole="tab"
            accessibilityState={{ selected: value === filter.key }}
            onPress={() => onChange(filter.key)}
            style={styles.chip}
          />
        </LinearGradient>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    backgroundColor: '#FFFFFF80',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF99',
  },
  content: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  gradient: { borderRadius: 40, flexShrink: 0 },
  chip: {
    height: 28,
    paddingVertical: 0,
    paddingHorizontal: 16,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
});
