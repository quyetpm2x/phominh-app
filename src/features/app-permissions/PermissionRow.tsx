import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import type { PermissionState } from '../../hooks/useDevicePermissions';
import type { PermissionItem } from './data';
export function PermissionRow({
  item,
  permission,
  pending,
  disabled,
  last,
  onPress,
}: {
  item: PermissionItem;
  permission: PermissionState | null;
  pending: boolean;
  disabled: boolean;
  last: boolean;
  onPress: () => void;
}) {
  const granted = permission?.granted;
  const label = permission?.limited ? 'Giới hạn' : granted ? 'Đã cấp' : 'Cấp quyền';
  return (
    <View style={[styles.row, !last && styles.divider]}>
      <View style={[styles.icon, { backgroundColor: item.background }]}>
        <CustomIcon name={item.icon} size={18} />
      </View>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text className="font-sans-bold" style={styles.title}>
            {item.title}
          </Text>
          {item.badge ? (
            <Text
              className="font-sans-bold"
              style={[styles.badge, { backgroundColor: item.background, color: item.badgeColor }]}
            >
              {item.badge}
            </Text>
          ) : null}
        </View>
        <Text className="font-sans" style={styles.subtitle}>
          {item.subtitle}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${item.title}: ${label}`}
        accessibilityState={{ disabled, busy: pending }}
        disabled={disabled}
        style={[styles.action, granted && styles.granted]}
        onPress={onPress}
      >
        {pending ? (
          <ActivityIndicator size="small" color={granted ? '#009966' : '#FFF'} />
        ) : (
          <>
            {granted ? <CustomIcon name="appPermissionCheck" size={14} /> : null}
            <Text className="font-sans-bold" style={[styles.actionText, granted && styles.grantedText]}>
              {label}
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { minHeight: 65.75, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#E9ECEF99' },
  icon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  title: { fontSize: 13.5, lineHeight: 20.25, color: '#1A1A1A' },
  badge: {
    fontSize: 10,
    lineHeight: 15,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2.2,
    overflow: 'hidden',
  },
  subtitle: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  action: {
    minWidth: 83.5,
    height: 32,
    borderRadius: 8.4,
    backgroundColor: '#FF416C',
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  granted: { backgroundColor: '#00BC7D1A' },
  actionText: { fontSize: 11, lineHeight: 16.5, color: '#FFF' },
  grantedText: { color: '#009966' },
});
