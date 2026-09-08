import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../src/components/ui/Button';
import { CustomIcon } from '../../../src/components/ui/CustomIcon';
import { colors } from '../../../src/constants/design-tokens';
import { usePostInteractions } from '../../../src/features/home/postInteractions';
import { usePostDetail } from '../../../src/features/post/usePostDetail';
import { AudienceBreakdown } from '../../../src/features/post-statistics/AudienceBreakdown';
import { DEMO_ANALYTICS, getPostMetrics } from '../../../src/features/post-statistics/data';
import { PeakHoursChart } from '../../../src/features/post-statistics/PeakHoursChart';
import { ReachDistribution } from '../../../src/features/post-statistics/ReachDistribution';
import { StatisticsMetrics } from '../../../src/features/post-statistics/StatisticsMetrics';
import { StatisticsPostPreview } from '../../../src/features/post-statistics/StatisticsPostPreview';
import { PostShareSheet } from '../../../src/features/share/PostShareSheet';
import { LOCAL_USER_ID } from '../../../src/lib/personalProfile';

export default function PostStatisticsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const detail = usePostDetail(id);
  const { liked, comments } = usePostInteractions();
  const { post, signedIn } = detail;
  const back = () => (router.canGoBack() ? router.back() : router.replace('/home'));
  if (signedIn === null)
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color={colors.primary.DEFAULT} />
      </SafeAreaView>
    );
  if (!signedIn) return <Redirect href="/(auth)/welcome" />;
  if (!post || post.authorId !== LOCAL_USER_ID)
    return (
      <SafeAreaView className="flex-1 justify-center gap-4 bg-white px-5">
        <Text className="text-center font-sans text-ink">
          {post ? 'Bạn chỉ có thể xem thống kê bài viết của chính mình.' : 'Bài viết không tồn tại.'}
        </Text>
        <Button label="Quay lại" onPress={back} />
      </SafeAreaView>
    );
  const analytics = DEMO_ANALYTICS[post.id];
  const metrics = getPostMetrics(post, liked[post.id] ? 1 : 0, comments[post.id]?.length ?? 0);
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
      <View className="flex-row items-center gap-3 border-b border-[#E9ECEF]/80 px-4 py-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          onPress={back}
          className="h-9 w-9 items-center justify-center rounded-full bg-[#F1F3F5]/60"
        >
          <CustomIcon name="statsBack" size={16} />
        </Pressable>
        <View className="flex-1">
          <Text accessibilityRole="header" className="font-sans-black text-base text-[#1A1A1A]">
            Thống kê bài viết
          </Text>
          <Text className="font-sans text-[11px] leading-[17px] text-[#4A4A4A]">
            Phân tích lượt tiếp cận & tương tác
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Chia sẻ bài viết"
          onPress={detail.share}
          className="h-9 w-9 items-center justify-center rounded-full bg-[#F1F3F5]/60"
        >
          <CustomIcon name="statsShare" size={16} />
        </Pressable>
      </View>
      <ScrollView className="flex-1 bg-[#F1F3F5]/20" contentContainerStyle={styles.content}>
        <StatisticsPostPreview post={post} analytics={analytics} />
        <StatisticsMetrics metrics={metrics} analytics={analytics} />
        {analytics ? (
          <>
            <ReachDistribution analytics={analytics} views={metrics.views} />
            <PeakHoursChart analytics={analytics} />
            <AudienceBreakdown residents={analytics.residents} />
          </>
        ) : (
          <Text className="font-sans text-sm text-muted">Chưa có dữ liệu phân tích cho bài viết này.</Text>
        )}
      </ScrollView>
      <PostShareSheet
        post={detail.shareOpen ? post : null}
        onClose={() => detail.setShareOpen(false)}
        areaLabel={analytics?.area}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ content: { padding: 16, gap: 16, paddingBottom: 32 } });
