import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { CustomIcon } from '../../components/ui/CustomIcon';
import type { PersonalProfile } from '../../lib/personalProfile';
export function ProfileHeader({ profile, onEdit }: { profile: PersonalProfile; onEdit: () => void }) {
  return (
    <View style={styles.header}>
      <View>
        <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.avatarBorder}>
          <View style={styles.avatarRing}>
            <Avatar
              initial={profile.fullName.charAt(0) || 'P'}
              imageUrl={profile.avatarUri}
              size={90}
              radius={25}
            />
          </View>
        </LinearGradient>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Đổi ảnh đại diện"
          onPress={onEdit}
          style={styles.cameraPosition}
        >
          <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.cameraBadge}>
            <CustomIcon name="meCamera" size={14} color="white" />
          </LinearGradient>
        </Pressable>
      </View>
      <Text className="font-sans-black" style={styles.name}>
        {profile.fullName || 'Thành viên Phố Mình'}
      </Text>
      <Text className="font-sans-medium" style={styles.meta}>
        Tham gia 8 tháng · 42 bài đã chia sẻ
      </Text>
      <View style={styles.badges}>
        <View style={styles.badge}>
          <CustomIcon name="meShield" size={14} />
          <Text className="font-sans-bold" style={styles.badgeText}>
            Xác thực SĐT
          </Text>
        </View>
        <View style={[styles.badge, styles.activeBadge]}>
          <CustomIcon name="meStar" size={14} />
          <Text className="font-sans-bold" style={styles.badgeText}>
            Hàng xóm tích cực
          </Text>
        </View>
      </View>
      <Pressable accessibilityRole="button" onPress={onEdit} style={styles.edit}>
        <CustomIcon name="meEdit" size={14} />
        <Text className="font-sans-bold" style={styles.editText}>
          Chỉnh sửa hồ sơ
        </Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  // HomeScreen supplies the status-bar safe area (48px in the design).
  header: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    paddingHorizontal: 16,
    paddingBottom: 23,
  },
  avatarBorder: {
    padding: 3,
    borderRadius: 26.667,
    shadowColor: '#FF416C',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  avatarRing: { borderRadius: 25, boxShadow: '0 0 0 2px white' },
  cameraPosition: { position: 'absolute', bottom: -6, right: -6 },
  cameraBadge: {
    width: 32,
    height: 32,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: 14,
    fontSize: 22,
    lineHeight: 33,
    letterSpacing: -0.55,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  meta: { marginTop: 2, fontSize: 12, lineHeight: 18, color: '#4A4A4A' },
  badges: { flexDirection: 'row', gap: 8, marginTop: 14 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#FF4B2B33',
    backgroundColor: '#FF4B2B1A',
  },
  activeBadge: { backgroundColor: '#FF4B2B26', borderColor: '#FF4B2B4D' },
  badgeText: { color: '#FF4B2B', fontSize: 11, lineHeight: 16.5 },
  edit: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#E9ECEFCC',
    backgroundColor: '#F1F3F5',
  },
  editText: { fontSize: 12, lineHeight: 18, color: '#1A1A1A' },
});
