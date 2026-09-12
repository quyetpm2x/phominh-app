import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { GradientSubmitButton } from '../../components/ui/GradientSubmitButton';
import { colors } from '../../constants/design-tokens';
import type { FeedPost } from '../home/types';
import { ExtensionPlans } from './ExtensionPlans';
import { ExtensionSuccessContent } from './ExtensionSuccessContent';
import { usePostExtension } from './usePostExtension';

interface Props {
  post: FeedPost | null;
  onClose: () => void;
  onViewPost?: (id: string) => void;
}
export function PostExtensionSheet({ post, onClose, onViewPost }: Props) {
  const { hours, setHours, boost, setBoost, result, remaining, close, confirm, navigate, flush } =
    usePostExtension(post, onClose, onViewPost);
  const remainingLabel =
    remaining === undefined
      ? 'Chưa có thông tin'
      : remaining <= 0
        ? 'Đã hết hạn'
        : remaining < 1
          ? `${Math.ceil(remaining * 60)} phút`
          : `${remaining} giờ`;
  return (
    <BottomSheet
      visible={post !== null}
      onClose={close}
      onDismiss={flush}
      variant={result ? 'dialog' : 'actions'}
    >
      {result ? (
        <ExtensionSuccessContent
          result={result}
          onViewPost={() => navigate('feed')}
          onProfile={() => navigate('profile')}
          localPost={Boolean(onViewPost)}
        />
      ) : (
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View className="flex-row items-center gap-2.5">
            <LinearGradient
              colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
              style={styles.headerIcon}
            >
              <CustomIcon name="extendHeader" size={18} />
            </LinearGradient>
            <View className="flex-1">
              <Text accessibilityRole="header" className="font-sans-black text-base leading-6 text-[#1A1A1A]">
                Gia hạn thời gian hiển thị
              </Text>
              <Text className="font-sans text-[11px] leading-[17px] text-[#4A4A4A]">
                Giữ tin nổi bật trên bảng tin khu vực
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Đóng gia hạn"
              onPress={close}
              className="h-8 w-8 items-center justify-center rounded-full bg-[#F1F3F5]/60"
            >
              <CustomIcon name="menuClose" size={14} />
            </Pressable>
          </View>
          <View className="flex-row items-center gap-2.5 rounded-[18px] border border-[#FE9A00]/20 bg-[#FE9A00]/10 p-3.5">
            <CustomIcon name="extendWarning" size={18} />
            <View className="flex-1">
              <Text className="font-sans-black text-xs leading-[18px] text-[#1A1A1A]">
                Tin sẽ hết hạn sau: <Text className="text-[#E17100]">{remainingLabel}</Text>
              </Text>
              <Text className="font-sans text-[10.5px] leading-4 text-[#4A4A4A]">
                Gia hạn để tiếp tục tiếp cận hàng xóm xung quanh
              </Text>
            </View>
          </View>
          <ExtensionPlans
            selected={hours}
            onSelect={(value) => {
              setHours(value);
            }}
          />
          <View className="flex-row items-center gap-2.5 rounded-[17px] border border-[#E9ECEF]/60 bg-[#F1F3F5]/40 p-3">
            <View className="h-8 w-8 items-center justify-center rounded-[9px] bg-primary/10">
              <CustomIcon name="extendBoost" size={16} />
            </View>
            <View className="flex-1">
              <Text className="font-sans-black text-[12.5px] leading-[19px] text-[#1A1A1A]">
                Đẩy tin lên đầu bảng tin
              </Text>
              <Text className="font-sans text-[10.5px] leading-4 text-[#4A4A4A]">
                Tăng gấp 2.5x lượt người xem trong 1 giờ đầu
              </Text>
            </View>
            <Pressable
              accessibilityRole="switch"
              accessibilityLabel="Đẩy tin lên đầu bảng tin"
              accessibilityState={{ checked: boost }}
              hitSlop={10}
              onPress={() => {
                setBoost((value) => !value);
              }}
              className={`h-6 w-10 justify-center rounded-full px-0.5 ${boost ? 'bg-primary' : 'bg-[#D1D5DB]'}`}
            >
              <View className={`h-5 w-5 rounded-full bg-white ${boost ? 'self-end' : 'self-start'}`} />
            </Pressable>
          </View>
          <View className="flex-row items-center gap-2.5 rounded-[17px] border border-[#00BC7D]/20 bg-[#00BC7D]/10 p-3">
            <CustomIcon name="extendGift" size={16} />
            <Text className="flex-1 font-sans text-[11px] leading-[17px] text-[#4A4A4A]">
              Tính năng đang được hỗ trợ{' '}
              <Text className="font-sans-bold text-[#009966]">hoàn toàn miễn phí</Text> cho tất cả cư dân.
            </Text>
          </View>
          <GradientSubmitButton
            label={`Xác nhận gia hạn (+${hours} Giờ)`}
            disabled={!post}
            loading={false}
            compact
            vertical
            rounded
            leadingIcon={<CustomIcon name="extendConfirm" size={18} />}
            onPress={confirm}
          />
        </ScrollView>
      )}
    </BottomSheet>
  );
}
const styles = StyleSheet.create({
  content: { gap: 20, paddingBottom: 4 },
  headerIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
