import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { MessageAvatar } from './MessageAvatar';
import { findResident, openResidentProfile } from '../resident-profile/resident';
import type { MessageContact } from './data';
export function ChatHeader({ contact, onMenu }: { contact: MessageContact; onMenu: () => void }) {
  const hoa = contact.id === 'hoa';
  const profile = findResident(contact.id);
  return (
    <View style={styles.header}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quay lại tin nhắn"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/messages'))}
          style={styles.back}
        >
          <CustomIcon name="residentBack" size={18} />
        </Pressable>
        <MessageAvatar contact={contact} size={40} online highlighted={contact.merchant} />
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text numberOfLines={1} className="font-sans-black" style={styles.name}>
              {contact.name}
            </Text>
            {contact.merchant && (
              <Text className="font-sans-black" style={styles.badge}>
                QUÁN QUEN
              </Text>
            )}
          </View>
          <View style={styles.titleRow}>
            <CustomIcon name="residentPin" size={10} />
            <Text numberOfLines={1} className="font-sans-semibold" style={styles.status}>
              {hoa ? 'Cách bạn 150m · ' : ''}Đang hoạt động
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Gọi điện"
          onPress={() => Alert.alert('Gọi điện', 'Chức năng gọi điện chưa được kết nối.')}
          style={[styles.action, styles.call]}
        >
          <CustomIcon name="chatCall" size={16} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tùy chọn hội thoại"
          onPress={onMenu}
          style={styles.action}
        >
          <CustomIcon name="chatMore" size={16} />
        </Pressable>
      </View>
      {hoa && (
        <View style={styles.verification}>
          <CustomIcon name="chatVerified" size={14} />
          <Text className="font-sans" style={styles.verificationText}>
            Đã xác minh cư dân Bậc 4 ·
          </Text>
          <View style={styles.trust}>
            <CustomIcon name="chatTrust" size={11} />
            <Text className="font-sans-bold" style={styles.trustText}>
              Tin cậy 98.5%
            </Text>
          </View>
          {profile && (
            <Pressable
              accessibilityRole="button"
              onPress={() => openResidentProfile(contact.id)}
              style={styles.shop}
            >
              <Text className="font-sans-bold" style={styles.shopText}>
                Xem quán
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  header: { backgroundColor: '#FFFFFFF2', borderBottomWidth: 1, borderColor: '#E9ECEF' },
  row: { paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  back: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F3F5CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  copy: { flex: 1, marginLeft: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { flexShrink: 1, fontSize: 15, lineHeight: 22.5, color: '#1A1A1A' },
  badge: {
    fontSize: 9,
    lineHeight: 13.5,
    color: '#FF416C',
    backgroundColor: '#FF416C1A',
    paddingHorizontal: 4,
    borderRadius: 2.222,
    overflow: 'hidden',
  },
  status: { flexShrink: 1, fontSize: 11, lineHeight: 16.5, color: '#009966' },
  action: {
    width: 32,
    height: 32,
    borderRadius: 8.889,
    backgroundColor: '#F1F3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  call: { backgroundColor: '#FF416C1A' },
  verification: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#E9ECEF99',
    backgroundColor: '#F1F3F566',
  },
  verificationText: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  trust: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#00BC7D26',
    borderWidth: 1,
    borderColor: '#00BC7D33',
    borderRadius: 100,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  trustText: { fontSize: 10, lineHeight: 15, color: '#009966' },
  shop: { marginLeft: 'auto' },
  shopText: { color: '#FF416C', fontSize: 11, lineHeight: 16.5 },
});
