import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';

export function InviteHero() {
  return (
    <View style={styles.shadow}>
      <LinearGradient colors={['#FF416C', '#FF4B2B', '#FF416C']} locations={[0, 0.5, 1]} style={styles.card}>
        <View className="h-16 w-16 items-center justify-center rounded-[18px] border border-white/30 bg-white/20">
          <CustomIcon name="inviteGift" size={25} />
        </View>
        <View className="mt-3 rounded-full border border-white/25 bg-white/20 px-3 py-1">
          <Text className="font-sans-black text-[11px] tracking-[0.55px] text-white">
            THƯỞNG KHÔNG GIỚI HẠN
          </Text>
        </View>
        <Text
          accessibilityRole="header"
          className="mt-2 text-center font-sans-black text-[24px] leading-[33px] tracking-[-0.6px] text-white"
        >
          Tặng bạn 20.000đ{'\n'}khi mời hàng xóm mới
        </Text>
        <Text className="mt-1.5 text-center font-sans-medium text-xs leading-4 text-white/80">
          Người được mời cũng nhận ngay <Text className="font-sans-black text-white">10.000đ</Text>
          {'\n'}sau khi hoàn tất đăng bài đầu tiên.
        </Text>
      </LinearGradient>
    </View>
  );
}
const styles = StyleSheet.create({
  shadow: {
    borderRadius: 31,
    shadowColor: '#FF416C',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  card: { borderRadius: 31, overflow: 'hidden', padding: 24, alignItems: 'center' },
});
