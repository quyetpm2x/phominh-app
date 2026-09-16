import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { LegalCard } from '../legal/LegalCard';
import type { PersonalProfile } from '../../lib/personalProfile';
export function AccountIdentity({ profile }: { profile: PersonalProfile }) {
  return (
    <LegalCard style={styles.card}>
      <View>
        <Avatar
          initial={profile.fullName.charAt(0) || 'P'}
          imageUrl={profile.avatarUri}
          size={56}
          radius={28}
        />
        <View style={styles.online} />
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={1} className="font-sans-bold" style={styles.name}>
          {profile.fullName || 'Thành viên Phố Mình'}
        </Text>
        <Text numberOfLines={1} className="font-sans" style={styles.meta}>
          {profile.nickname ? `ID: @${profile.nickname.replace(/^@/, '')}` : 'Hồ sơ trên thiết bị này'}
        </Text>
        <View style={styles.badge}>
          <CustomIcon name="accountIdentity" size={10.5} color="#4A4A4A" />
          <Text className="font-sans-bold" style={styles.badgeText}>
            Chưa xác thực CCCD
          </Text>
        </View>
      </View>
    </LegalCard>
  );
}
const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 99.625 },
  copy: { flex: 1 },
  name: { fontSize: 15, lineHeight: 22.5, color: '#1A1A1A' },
  meta: { fontSize: 12, lineHeight: 18, color: '#4A4A4A' },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5.556,
    backgroundColor: '#F1F3F5',
  },
  badgeText: { fontSize: 10.5, lineHeight: 15.75, color: '#4A4A4A' },
  online: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#F8F9FA',
    borderRadius: 8,
    backgroundColor: '#00BC7D',
  },
});
