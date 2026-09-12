import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { GradientSubmitButton } from '../../components/ui/GradientSubmitButton';
import { DEMO_ANALYTICS } from '../post-statistics/data';
import { formatExtensionExpiry, type ExtensionResult } from './extensionResult';

interface Props {
  result: ExtensionResult;
  onViewPost: () => void;
  onProfile: () => void;
  localPost?: boolean;
}
export function ExtensionSuccessContent({ result, onViewPost, onProfile, localPost = false }: Props) {
  const analytics = DEMO_ANALYTICS[result.postId];
  const area = analytics
    ? `${analytics.area.replace('Khu vực ', '').split(',')[0]} (${analytics.radius})`
    : 'Khu vực của bạn';
  return (
    <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View className="h-20 w-20 mt-2 self-center items-center justify-center">
        <View pointerEvents="none" className="absolute h-[98px] w-[98px] rounded-full bg-[#00BC7D]/10" />
        <LinearGradient colors={['#00BC7D', '#00D5BE']} style={styles.success}>
          <CustomIcon name="extensionSuccess" size={30} />
        </LinearGradient>
      </View>
      <View className="gap-1.5">
        <Text
          accessibilityRole="header"
          className="text-center font-sans-black text-xl leading-[30px] text-[#1A1A1A]"
        >
          Gia hạn thành công!
        </Text>
        <Text className="text-center font-sans text-[12.5px] leading-[21px] text-[#4A4A4A]">
          Bài viết của bạn đã được gia hạn thêm{' '}
          <Text className="font-sans-bold text-[#1A1A1A]">+{result.hours} Giờ</Text> hiển thị và tiếp tục xuất
          hiện trên bảng tin khu phố.
        </Text>
      </View>
      <View className="gap-2.5 rounded-[20px] border border-[#E9ECEF]/70 bg-[#F1F3F5]/40 p-3.5">
        <View className="flex-row flex-wrap justify-between gap-2">
          <Text className="font-sans text-xs leading-[18px] text-[#4A4A4A]">Khu vực hiển thị:</Text>
          <Text className="font-sans-bold text-xs leading-[18px] text-[#1A1A1A]">{area}</Text>
        </View>
        <View className="flex-row flex-wrap justify-between gap-2">
          <Text className="font-sans text-xs leading-[18px] text-[#4A4A4A]">Thời gian hết hạn mới:</Text>
          <Text className="font-sans-black text-xs leading-[18px] text-[#009966]">
            {formatExtensionExpiry(result.expiresAt)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between border-t border-[#E9ECEF]/60 pt-2">
          <Text className="font-sans text-xs leading-[18px] text-[#4A4A4A]">Trạng thái:</Text>
          <View className="flex-row items-center gap-1">
            <View className="h-2 w-2 rounded-full bg-[#00BC7D]" />
            <Text className="font-sans-bold text-xs leading-[18px] text-[#009966]">Đang phát sóng</Text>
          </View>
        </View>
      </View>
      <View className="gap-2">
        <GradientSubmitButton
          label={localPost ? 'Xem bài viết' : 'Xem bài viết trên dòng tin'}
          disabled={false}
          loading={false}
          compact
          vertical
          rounded
          leadingIcon={<CustomIcon name="extensionFeed" size={16} />}
          onPress={onViewPost}
        />
        {!localPost ? (
          <Pressable
            accessibilityRole="button"
            onPress={onProfile}
            className="h-11 items-center justify-center rounded-full bg-[#F1F3F5]"
          >
            <Text className="font-sans-bold text-[13px] text-[#1A1A1A]">Về trang cá nhân</Text>
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  content: { gap: 20, paddingTop: 8, paddingBottom: 2 },
  success: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00BC7D',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
});
