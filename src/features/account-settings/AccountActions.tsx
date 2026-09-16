import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { LegalCard } from '../legal/LegalCard';
import { accountHeading } from './AccountSecurity';
export function AccountActions({ onLogout, onDelete }: { onLogout: () => void; onDelete: () => void }) {
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" className="font-sans-black" style={accountHeading}>
        TÁC VỤ TÀI KHOẢN
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Đăng xuất"
        onPress={onLogout}
        style={styles.logout}
      >
        <View style={styles.icon}>
          <CustomIcon name="accountLogout" size={18} />
        </View>
        <View style={styles.copy}>
          <Text className="font-sans-bold" style={styles.title}>
            Đăng xuất
          </Text>
          <Text className="font-sans" style={styles.subtitle}>
            Đăng xuất khỏi thiết bị hiện tại
          </Text>
        </View>
        <CustomIcon name="accountChevron" size={14} />
      </Pressable>
      <LegalCard style={styles.danger}>
        <View style={styles.heading}>
          <View style={[styles.icon, styles.warning]}>
            <CustomIcon name="accountWarning" size={18} />
          </View>
          <View style={styles.copy}>
            <Text className="font-sans-bold" style={[styles.title, styles.red]}>
              Xoá vĩnh viễn tài khoản
            </Text>
            <Text className="font-sans" style={styles.description}>
              Toàn bộ dữ liệu điểm uy tín, số dư ví thưởng và các bài viết khu phố đã chia sẻ sẽ bị xoá vĩnh
              viễn không thể khôi phục.
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tiếp tục yêu cầu xoá tài khoản"
          onPress={onDelete}
          style={styles.deleteButton}
        >
          <View style={styles.deleteIcon}>
            <CustomIcon name="accountDelete" size={14} />
          </View>
          <Text className="font-sans-bold" style={styles.deleteText}>
            Tiếp tục yêu cầu xoá tài khoản
          </Text>
          <CustomIcon name="accountArrow" size={14} />
        </Pressable>
      </LegalCard>
    </View>
  );
}
const styles = StyleSheet.create({
  section: { gap: 10 },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 18.542,
    backgroundColor: '#FFF',
  },
  icon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 2 },
  title: { fontSize: 13.5, lineHeight: 20.25, color: '#1A1A1A' },
  subtitle: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  danger: { gap: 12, backgroundColor: '#E639460D', borderColor: '#E6394633', shadowOpacity: 0, elevation: 0 },
  heading: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  warning: { backgroundColor: '#E639461A' },
  red: { color: '#E63946' },
  description: { fontSize: 11, lineHeight: 17.875, color: '#4A4A4A' },
  deleteButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12.222,
    backgroundColor: '#E63946',
  },
  deleteIcon: {
    width: 24,
    height: 24,
    borderRadius: 6.667,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF33',
  },
  deleteText: { flex: 1, fontSize: 13, lineHeight: 19.5, color: '#1A1A1A' },
});
