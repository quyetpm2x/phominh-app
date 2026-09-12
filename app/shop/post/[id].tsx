import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../src/components/ui/Button';
import { CustomIcon } from '../../../src/components/ui/CustomIcon';
import { usePostDetail } from '../../../src/features/post/usePostDetail';
import { PostExtensionSheet } from '../../../src/features/post-extension/PostExtensionSheet';
import { useRemainingPostHours } from '../../../src/features/post-extension/useRemainingPostHours';
import { PostShareSheet } from '../../../src/features/share/PostShareSheet';
import { SHOP_POSTS } from '../../../src/features/shop/data';
import { SHOP_POST_ANALYTICS } from '../../../src/features/shop/postDetails';
import { ShopActionButton } from '../../../src/features/shop/ShopActionButton';
import { ShopPostAudience } from '../../../src/features/shop/ShopPostAudience';
import { ShopPostConversion } from '../../../src/features/shop/ShopPostConversion';

export default function ShopPostDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Array.isArray(id) ? id[0] : id;
  const shopPost = SHOP_POSTS.find((item) => item.id === postId);
  const detail = usePostDetail(postId);
  const [extending, setExtending] = useState(false);
  const hours = useRemainingPostHours(detail.post ?? null, true);
  const back = () =>
    router.canGoBack() ? router.back() : router.replace({ pathname: '/home', params: { tab: 'shop' } });
  if (detail.signedIn === null)
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </SafeAreaView>
    );
  if (!detail.signedIn) return <Redirect href="/(auth)/welcome" />;
  if (!shopPost || !detail.post)
    return (
      <SafeAreaView className="flex-1 justify-center gap-4 px-5">
        <Text className="text-center font-sans text-ink">Bài viết không tồn tại.</Text>
        <Button label="Quay lại" onPress={back} />
      </SafeAreaView>
    );
  const analytics = SHOP_POST_ANALYTICS[postId];
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-[#F8F9FA]">
      <View className="flex-row items-center gap-3 border-b border-[#E9ECEF] px-4 py-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          onPress={back}
          className="h-9 w-9 items-center justify-center rounded-full border border-[#E9ECEF] bg-white"
        >
          <CustomIcon name="statsBack" size={18} />
        </Pressable>
        <View className="flex-1 gap-0.5">
          <Text accessibilityRole="header" className="font-sans-black text-base text-ink">
            Chi tiết hiệu quả bài
          </Text>
          <Text className="font-sans text-[11px] text-muted">
            Đăng lúc {analytics?.postedAt ?? shopPost.time}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Chia sẻ bài viết"
          onPress={detail.share}
          className="h-9 w-9 items-center justify-center rounded-full border border-[#E9ECEF] bg-white"
        >
          <CustomIcon name="statsShare" size={18} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View className="flex-row items-center gap-3 rounded-[20px] border border-[#E9ECEF] bg-white p-3.5">
          <Image
            source={shopPost.image}
            accessibilityLabel={shopPost.title}
            className="h-16 w-16 rounded-[14px]"
          />
          <View className="flex-1 gap-2">
            <View className="flex-row flex-wrap items-center gap-2">
              <Text className="rounded bg-[#E9F9F3] px-1.5 py-0.5 font-sans-bold text-[10px] text-[#009977]">
                {shopPost.pinned ? '• Đang ghim ưu tiên' : 'Bài thường'}
              </Text>
              {shopPost.pinned && hours !== undefined ? (
                <Text className="font-sans text-[10px] text-muted">Còn {hours}h ghim</Text>
              ) : null}
            </View>
            <Text numberOfLines={2} className="font-sans-bold text-[13px] text-ink">
              {detail.post.text.split('\n')[0]}
            </Text>
          </View>
        </View>
        <ShopPostConversion post={shopPost} />
        <ShopPostAudience post={shopPost} />
      </ScrollView>
      <View className="flex-row gap-3 px-4 pb-3 pt-2">
        <ShopActionButton
          role="button"
          label="Chỉnh sửa bài"
          icon="create-outline"
          tone="neutral"
          onPress={() => router.push({ pathname: '/post/edit/[id]', params: { id: postId } })}
        />
        <ShopActionButton
          role="button"
          label={shopPost.pinned ? 'Gia hạn ghim' : 'Gia hạn bài'}
          icon="pin-outline"
          tone="gradient"
          onPress={() => setExtending(true)}
        />
      </View>
      <PostExtensionSheet
        post={extending ? detail.post : null}
        onClose={() => setExtending(false)}
        onViewPost={() => setExtending(false)}
      />
      <PostShareSheet
        post={detail.shareOpen ? detail.post : null}
        onClose={() => detail.setShareOpen(false)}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ content: { padding: 16, gap: 20, paddingBottom: 24 } });
