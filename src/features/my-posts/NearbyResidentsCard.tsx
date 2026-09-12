import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { GradientButton } from '../../components/ui/Button';
import { colors } from '../../constants/design-tokens';

export function NearbyResidentsCard({ onCompose }: { onCompose: () => void }) {
  return (
    <View className="gap-3 rounded-[30px] border border-primary/20 bg-[#FFF3F5] p-4">
      <View className="flex-row items-center gap-3">
        <View>
          <LinearGradient colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]} style={styles.icon}>
            <Ionicons name="people" size={26} color="white" />
          </LinearGradient>
          <View className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#00BC7D]" />
        </View>
        <View className="flex-1 gap-1">
          <View className="flex-row flex-wrap items-center gap-1">
            <Text className="rounded bg-[#E9F9F3] px-1.5 py-0.5 font-sans-black text-[10px] text-[#009977]">
              TRỰC TUYẾN
            </Text>
            <Text className="font-sans text-[10px] text-[#4A4A4A]">
              • Bán kính <Text className="font-sans-bold">1.5 km Duy Tân</Text>
            </Text>
          </View>
          <View className="flex-row items-baseline gap-2">
            <Text className="font-sans-black text-[27px] text-primary">2.450+</Text>
            <Text className="font-sans-bold text-xs text-[#1A1A1A]">cư dân lân cận</Text>
          </View>
        </View>
      </View>
      <View className="flex-row flex-wrap items-center justify-between gap-2 border-t border-primary/10 pt-3">
        <View className="flex-row items-center gap-1">
          <Ionicons name="sparkles" size={14} color={colors.primary.DEFAULT} />
          <Text className="font-sans text-[11px] text-[#4A4A4A]">Tiếp cận cộng đồng tức thì!</Text>
        </View>
        <GradientButton label="Đăng tin ngay" compact onPress={onCompose} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  icon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
