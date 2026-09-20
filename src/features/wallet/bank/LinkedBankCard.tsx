import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Clipboard, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { CustomIcon } from '../../../components/ui/CustomIcon';
import { bankCardGlow } from './bank-card-glow';

export function LinkedBankCard({ onRemove }: { onRemove: () => void }) {
  const copy = async () => {
    try {
      if (Platform.OS === 'web') await navigator.clipboard.writeText('190388294012');
      else Clipboard.setString('190388294012');
      Alert.alert('Đã sao chép số tài khoản');
    } catch {
      Alert.alert('Chưa sao chép được', 'Vui lòng thử lại.');
    }
  };
  return (
    <LinearGradient colors={['#1E293B', '#0F172A', '#020617']} style={s.card}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <SvgXml xml={bankCardGlow} width="100%" height="100%" preserveAspectRatio="none" />
      </View>
      <View style={s.header}>
        <View style={s.identity}>
          <View style={s.logo}>
            <CustomIcon name="bankLogo" size={20} />
          </View>
          <View>
            <Text className="font-sans-black" style={s.name}>
              Techcombank
            </Text>
            <Text className="font-sans-medium" style={s.description}>
              Ngân hàng TMCP Kỹ Thương
            </Text>
          </View>
        </View>
        <View style={s.badge}>
          <CustomIcon name="bankDefault" size={12} />
          <Text className="font-sans-bold" style={s.badgeText}>
            Mặc định
          </Text>
        </View>
      </View>
      <View style={s.chipRow}>
        <LinearGradient colors={['#FFD230', '#FEE685', '#FFB900']} style={s.chip}>
          <View style={s.chipInner}>
            <View style={s.chipDivider} />
          </View>
        </LinearGradient>
        <CustomIcon name="bankCard" size={20} />
      </View>
      <View style={s.numberBlock}>
        <Text className="font-sans-bold" style={s.numberLabel}>
          SỐ TÀI KHOẢN
        </Text>
        <View style={s.header}>
          <Text selectable style={s.number}>
            1903 8829 4012
          </Text>
          <Pressable
            onPress={copy}
            accessibilityRole="button"
            accessibilityLabel="Sao chép số tài khoản"
            hitSlop={12}
          >
            <CustomIcon name="bankCopy" size={10.5} />
          </Pressable>
        </View>
      </View>
      <View style={s.footer}>
        <View>
          <Text className="font-sans-bold" style={s.ownerLabel}>
            CHỦ TÀI KHOẢN
          </Text>
          <Text className="font-sans-black" style={s.owner}>
            NGUYEN VAN QUYET
          </Text>
        </View>
        <Pressable
          onPress={onRemove}
          accessibilityRole="button"
          accessibilityLabel="Gỡ liên kết Techcombank"
          style={s.remove}
        >
          <CustomIcon name="bankDelete" size={10.5} />
        </Pressable>
      </View>
    </LinearGradient>
  );
}
const s = StyleSheet.create({
  card: {
    padding: 20,
    gap: 20,
    borderRadius: 30.667,
    borderWidth: 1,
    borderColor: '#31415880',
    overflow: 'hidden',
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 14, lineHeight: 17.5, color: '#FFF' },
  description: { fontSize: 10, lineHeight: 15, color: '#90A1B9' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#00D4924D',
    backgroundColor: '#00BC7D33',
  },
  badgeText: { fontSize: 10, lineHeight: 15, color: '#5EE9B5' },
  chipRow: { paddingTop: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chip: {
    width: 40,
    height: 28,
    borderRadius: 5.667,
    borderWidth: 1,
    borderColor: '#FE9A0066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipInner: { width: 28, height: 16, borderWidth: 1, borderColor: '#E1710066', opacity: 0.6 },
  chipDivider: { width: 12, height: 14, borderRightWidth: 1, borderColor: '#E1710066' },
  numberBlock: { gap: 4 },
  numberLabel: { fontSize: 10, lineHeight: 15, letterSpacing: 1, color: '#90A1B9' },
  number: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 1.8,
    color: '#FFF',
  },
  footer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#FFFFFF1A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  ownerLabel: { fontSize: 9, lineHeight: 13.5, letterSpacing: 0.45, color: '#90A1B9' },
  owner: { fontSize: 12, lineHeight: 16, letterSpacing: 0.3, color: '#FFF' },
  remove: {
    width: 32,
    height: 32,
    borderRadius: 8.444,
    backgroundColor: '#FB2C3633',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
