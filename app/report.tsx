import { BlurView } from 'expo-blur';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/ui/Button';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { GradientSubmitButton } from '../src/components/ui/GradientSubmitButton';
import { colors } from '../src/constants/design-tokens';
import { ReportPostPreview } from '../src/features/report/ReportPostPreview';
import { ReportReasonList } from '../src/features/report/ReportReasonList';
import { useReportPost } from '../src/features/report/useReportPost';

export default function ReportScreen() {
  const params = useLocalSearchParams<{ postId?: string | string[] }>();
  const postId = Array.isArray(params.postId) ? params.postId[0] : params.postId;
  const scroll = useRef<ScrollView>(null);
  const revealDetails = useRef(false);
  const detailsFocused = useRef(false);
  const { post, signedIn, reason, setReason, details, setDetails, submit } = useReportPost(postId);
  const back = () => (router.canGoBack() ? router.back() : router.replace('/home'));
  if (signedIn === null)
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color={colors.primary.DEFAULT} />
      </SafeAreaView>
    );
  if (!signedIn) return <Redirect href="/(auth)/welcome" />;
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View className="min-h-[57px] flex-row items-center justify-between border-b border-[#E9ECEF]/80 px-5 pb-4 pt-1">
          <BlurView pointerEvents="none" intensity={12} tint="light" style={StyleSheet.absoluteFill} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            onPress={back}
            className="h-9 w-9 items-center justify-center rounded-full bg-[#F1F3F5]/60"
          >
            <CustomIcon name="reportBack" size={16} />
          </Pressable>
          <Text accessibilityRole="header" className="font-sans-black text-base text-[#1A1A1A]">
            Báo cáo bài đăng
          </Text>
          <View className="h-9 w-9" />
        </View>
        {post ? (
          <>
            <ScrollView
              ref={scroll}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() => {
                if (revealDetails.current) {
                  revealDetails.current = false;
                  scroll.current?.scrollToEnd({ animated: true });
                }
              }}
              onLayout={() => {
                if (detailsFocused.current) scroll.current?.scrollToEnd({ animated: true });
              }}
              className="flex-1 bg-[#F1F3F5]/20"
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >
              <ReportPostPreview post={post} />
              <View className="gap-1">
                <Text className="font-sans-black text-[17px] leading-[25.5px] text-[#1A1A1A]">
                  Chọn lý do báo cáo
                </Text>
                <Text className="font-sans text-xs leading-[18px] text-[#4A4A4A]">
                  Báo cáo của bạn sẽ được kiểm duyệt trong 24h. Thông tin hoàn toàn ẩn danh.
                </Text>
              </View>
              <ReportReasonList
                value={reason}
                onChange={(next) => {
                  revealDetails.current = next === 'other' && reason !== 'other';
                  if (next !== 'other') {
                    detailsFocused.current = false;
                    Keyboard.dismiss();
                  }
                  setReason(next);
                }}
                details={details}
                onDetailsChange={setDetails}
                onDetailsFocus={() => {
                  detailsFocused.current = true;
                  scroll.current?.scrollToEnd({ animated: true });
                }}
                onDetailsBlur={() => {
                  detailsFocused.current = false;
                }}
              />
            </ScrollView>
            <View className="gap-2 border-t border-[#E9ECEF]/80 bg-white/90 px-5 py-5">
              <BlurView pointerEvents="none" intensity={12} tint="light" style={StyleSheet.absoluteFill} />
              <GradientSubmitButton
                label="Gửi báo cáo"
                compact
                disabled={false}
                loading={false}
                onPress={submit}
                leadingIcon={<CustomIcon name="reportSend" size={16} color="white" />}
              />
              <Text className="text-center font-sans-medium text-[11px] leading-[16.5px] text-[#4A4A4A]">
                Chúng tôi sẽ bảo mật danh tính người báo cáo
              </Text>
            </View>
          </>
        ) : (
          <View className="flex-1 justify-center gap-4 px-5">
            <Text className="text-center font-sans text-ink">Không tìm thấy bài đăng cần báo cáo.</Text>
            <Button label="Quay lại" onPress={back} />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 24, gap: 24 },
});
