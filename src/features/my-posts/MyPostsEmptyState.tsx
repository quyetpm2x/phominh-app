import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { GradientSubmitButton } from '../../components/ui/GradientSubmitButton';
import { colors } from '../../constants/design-tokens';

const suggestions = [
  { icon: 'location-outline', label: 'Tìm quán ăn ngon, hỏi địa điểm gần đây' },
  { icon: 'shirt-outline', label: 'Pass đồ dùng, thanh lý đồ cũ' },
  { icon: 'search-outline', label: 'Tìm bạn chơi thể thao, kết nối hàng xóm' },
] as const;

export function MyPostsEmptyState({ onCompose }: { onCompose: () => void }) {
  return (
    <View className="w-full max-w-[368px] self-center px-6 pb-8 pt-8">
      <View className="mb-8 self-center">
        <LinearGradient colors={['#FBE1E5', '#F8F9FA']} style={styles.illustration}>
          <Ionicons name="receipt-outline" size={44} color={colors.primary.DEFAULT} />
        </LinearGradient>
        <View className="absolute -bottom-1 -right-1 h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-primary">
          <Ionicons name="add" size={16} color="white" />
        </View>
      </View>
      <Text accessibilityRole="header" className="text-center font-sans-black text-lg leading-7 text-ink">
        Bạn chưa có bài viết nào
      </Text>
      <Text className="mt-2.5 text-center font-sans text-[13px] leading-[22px] text-[#4A4A4A]">
        Chia sẻ tin tức, thanh lý đồ đạc, tìm đồ rơi hoặc hỏi han cộng đồng người xung quanh bạn ngay hôm nay!
      </Text>
      <View className="mb-6 mt-6 gap-2 rounded-[22px] border border-[#E9ECEF] bg-white p-3.5">
        <Text className="mb-1 font-sans-bold text-[11px] text-[#4A4A4A]">GỢI Ý CHỦ ĐỀ THƯỜNG GẶP</Text>
        {suggestions.map(({ icon, label }) => (
          <View key={icon} className="flex-row items-center gap-2 rounded-[10px] bg-[#F8F9FA] px-2 py-2.5">
            <Ionicons name={icon} size={17} color={colors.primary.DEFAULT} />
            <Text className="flex-1 font-sans text-xs leading-[18px] text-ink">{label}</Text>
          </View>
        ))}
      </View>
      <GradientSubmitButton
        label="Đăng bài đầu tiên ngay"
        disabled={false}
        loading={false}
        compact
        vertical
        leadingIcon={<Ionicons name="create-outline" size={20} color="white" />}
        onPress={onCompose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  illustration: {
    width: 96,
    height: 96,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#F0D6DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
