import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../../components/ui/CustomIcon';
import { LegalCard } from '../../legal/LegalCard';

export function WithdrawalRecipient() {
  const changeBank = () => router.push('/bank-accounts');
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text className="font-sans-black" style={styles.label}>
          TÀI KHOẢN THỤ HƯỞNG
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Thay đổi tài khoản thụ hưởng"
          onPress={changeBank}
          hitSlop={8}
        >
          <Text className="font-sans-bold" style={styles.change}>
            Thay đổi
          </Text>
        </Pressable>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Tài khoản thụ hưởng Techcombank, thay đổi ngân hàng"
        onPress={changeBank}
      >
        <LegalCard style={styles.card}>
          <LinearGradient colors={['#0F172B', '#1D293D']} style={styles.logo}>
            <CustomIcon name="withdrawBank" size={20} />
          </LinearGradient>
          <View style={styles.copy}>
            <View style={styles.nameRow}>
              <Text className="font-sans-black" style={styles.name}>
                Techcombank
              </Text>
              <Text className="font-sans-bold" style={styles.badge}>
                Mặc định
              </Text>
            </View>
            <Text style={styles.account}>1903 8829 4012</Text>
            <Text className="font-sans-semibold" style={styles.owner}>
              NGUYEN VAN QUYET
            </Text>
          </View>
          <CustomIcon name="withdrawChevron" size={14} />
        </LegalCard>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 8 },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 12, lineHeight: 16, letterSpacing: 0.6, color: '#4A4A4A' },
  change: { fontSize: 11, lineHeight: 16.5, color: '#FF416C' },
  card: { padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12.222,
    borderWidth: 1,
    borderColor: '#314158',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  name: { fontSize: 14, lineHeight: 20, color: '#1A1A1A' },
  badge: {
    paddingHorizontal: 5,
    borderRadius: 2.222,
    borderWidth: 1,
    borderColor: '#00BC7D33',
    backgroundColor: '#00BC7D1A',
    fontSize: 9,
    lineHeight: 13.5,
    color: '#00D492',
    overflow: 'hidden',
  },
  account: { fontFamily: 'JetBrainsMono_700Bold', fontSize: 12, lineHeight: 16, color: '#4A4A4A' },
  owner: { fontSize: 10, lineHeight: 15, color: '#4A4A4A' },
});
