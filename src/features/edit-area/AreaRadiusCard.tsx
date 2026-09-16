import { StyleSheet, Text, View } from 'react-native';
import { LegalCard } from '../legal/LegalCard';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { RadiusSlider } from '../../components/ui/RadiusSlider';
export function AreaRadiusCard({
  radius,
  color,
  onChange,
}: {
  radius: number;
  color: string;
  onChange: (value: number) => void;
}) {
  return (
    <LegalCard style={styles.card}>
      <View style={styles.heading}>
        <View style={[styles.icon, { backgroundColor: `${color}1A` }]}>
          <CustomIcon name="editAreaRadius" size={14} color={color} />
        </View>
        <Text className="font-sans-bold" style={styles.title}>
          Điều chỉnh bán kính nhận tin
        </Text>
        <Text className="font-sans-black" style={[styles.value, { color, backgroundColor: `${color}1A` }]}>
          {radius.toFixed(1)} km
        </Text>
      </View>
      <RadiusSlider
        variant="settings"
        valueKm={radius}
        onChange={onChange}
        minKm={0.5}
        maxKm={5}
        stepKm={0.1}
        color={color}
      />
      <View style={styles.labels}>
        {['0.5 km (Ngõ xóm)', '2.5 km (Phường)', '5.0 km (Quận)'].map((label) => (
          <Text key={label} className="font-sans-bold" style={styles.label}>
            {label}
          </Text>
        ))}
      </View>
    </LegalCard>
  );
}
const styles = StyleSheet.create({
  card: { gap: 0 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { width: 28, height: 28, borderRadius: 7.778, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 12, lineHeight: 16, color: '#1A1A1A' },
  value: {
    fontSize: 12,
    lineHeight: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  labels: { flexDirection: 'row', justifyContent: 'space-between', gap: 4 },
  label: { flexShrink: 1, fontSize: 10, lineHeight: 15, color: '#4A4A4A' },
});
