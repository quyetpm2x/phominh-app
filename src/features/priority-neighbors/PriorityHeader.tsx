import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
export function PriorityHeader({ count, onAdd }: { count: number; onAdd: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Quay lại"
        style={styles.button}
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/settings'))}
      >
        <CustomIcon name="priorityBack" size={18} />
      </Pressable>
      <View style={styles.copy}>
        <Text accessibilityRole="header" className="font-sans-black" style={styles.title}>
          Người quen
        </Text>
        <Text className="font-sans-medium" style={styles.subtitle}>
          Bảng tin riêng khu phố • {count} người
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Thêm người quen ưu tiên"
        style={[styles.button, styles.add]}
        onPress={onAdd}
      >
        <CustomIcon name="priorityPerson" size={18} />
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 11.1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: { backgroundColor: '#FF416C' },
  copy: { flex: 1, alignItems: 'center' },
  title: { fontSize: 17, lineHeight: 25.5, color: '#1A1A1A' },
  subtitle: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
});
