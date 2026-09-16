import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SettingsSection } from '../settings/SettingsSection';
import { CustomIcon } from '../../components/ui/CustomIcon';
import type { AreaSuggestion } from './useEditArea';
export function AreaSuggestions({
  items,
  selectedAddress,
  color,
  disabled,
  onSelect,
}: {
  items: AreaSuggestion[];
  selectedAddress?: string;
  color: string;
  disabled: boolean;
  onSelect: (item: AreaSuggestion) => void;
}) {
  return (
    <SettingsSection title="GỢI Ý ĐỊA CHỈ LÂN CẬN" gap={8} titleStyle={styles.heading}>
      {items.length ? (
        items.map((item, index) => {
          const selected =
            selectedAddress === item.title || selectedAddress === `${item.title}, ${item.subtitle}`;
          return (
            <Pressable
              key={`${item.title}-${index}`}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled }}
              disabled={disabled}
              onPress={() => onSelect(item)}
              style={[styles.row, index < items.length - 1 && styles.divider]}
            >
              <View style={[styles.icon, selected && { backgroundColor: `${color}1A` }]}>
                <CustomIcon
                  name={selected ? 'editAreaPin' : 'editAreaPlace'}
                  size={16}
                  color={selected ? color : '#4A4A4A'}
                />
              </View>
              <View style={styles.copy}>
                <Text className="font-sans-bold" style={styles.title}>
                  {item.title}
                </Text>
                <Text className="font-sans" style={styles.subtitle}>
                  {item.subtitle}
                </Text>
              </View>
              <CustomIcon
                name={selected ? 'editAreaSelected' : 'editAreaChevron'}
                size={selected ? 18 : 14}
                color={selected ? color : '#4A4A4A'}
              />
            </Pressable>
          );
        })
      ) : (
        <Text className="font-sans" style={styles.empty}>
          Không tìm thấy địa chỉ. Hãy thử từ khoá khác hoặc chọn trên bản đồ.
        </Text>
      )}
    </SettingsSection>
  );
}
const styles = StyleSheet.create({
  heading: { paddingLeft: 1.5, fontSize: 11, lineHeight: 16.5, letterSpacing: 0.55, color: '#4A4A4A' },
  row: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#E9ECEF' },
  icon: {
    backgroundColor: '#F1F3F599',
    width: 32,
    height: 32,
    borderRadius: 8.889,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  title: { fontSize: 12, lineHeight: 16, color: '#1A1A1A' },
  subtitle: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  empty: { padding: 16, color: '#4A4A4A', fontSize: 12, lineHeight: 18 },
});
