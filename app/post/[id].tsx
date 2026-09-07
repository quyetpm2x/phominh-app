import { getPostMenuItems } from '../../src/features/post/postMenu';
import { usePostInteractions } from '../../src/features/home/postInteractions';
import { BlurView } from 'expo-blur';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type TextInput as NativeTextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionSheetMenu } from '../../src/components/ui/ActionSheetMenu';
import { Avatar } from '../../src/components/ui/Avatar';
import { BottomSheet } from '../../src/components/ui/BottomSheet';
import { Button } from '../../src/components/ui/Button';
import { CustomIcon } from '../../src/components/ui/CustomIcon';
import { TextInput } from '../../src/components/ui/TextInput';
import { colors } from '../../src/constants/design-tokens';
import { PHOTOS } from '../../src/features/home/data';
import { PostComments } from '../../src/features/post/PostComments';
import { PostDetailContent } from '../../src/features/post/PostDetailContent';
import { usePostDetail } from '../../src/features/post/usePostDetail';

export default function PostDetailScreen() {
  const params = useLocalSearchParams<{ id: string; comments?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const detail = usePostDetail(id);
  const input = useRef<NativeTextInput>(null);
  const scroll = useRef<ScrollView>(null);
  const commentsOpened = useRef(false);
  const scrollToNewComment = useRef(false);
  const { width, height } = useWindowDimensions();
  useEffect(() => {
    commentsOpened.current = false;
  }, [id]);
  const sendComment = () => {
    if (!detail.draft.trim()) return;
    scrollToNewComment.current = true;
    detail.sendComment();
  };
  const { post, signedIn, profile } = detail;
  const back = () => (router.canGoBack() ? router.back() : router.replace('/home'));
  if (signedIn === null)
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color={colors.primary.DEFAULT} />
      </SafeAreaView>
    );
  if (!signedIn) return <Redirect href="/(auth)/welcome" />;
  if (!post)
    return (
      <SafeAreaView className="flex-1 justify-center gap-4 bg-white px-5">
        <Text className="text-center font-sans text-ink">Bài đăng không tồn tại hoặc đã được xoá.</Text>
        <Button label="Về trang chủ" onPress={() => router.replace('/home')} />
      </SafeAreaView>
    );
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View className="h-14 flex-row items-center justify-between border-b border-[#F5F5F4] bg-white/90 px-3">
          <BlurView intensity={12} tint="light" style={StyleSheet.absoluteFillObject} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            onPress={back}
            className="h-10 w-10 items-center justify-center"
          >
            <CustomIcon name="postBack" size={24} />
          </Pressable>
          <Text accessibilityRole="header" className="font-sans-black text-[17px] text-[#1C1917]">
            Bài đăng
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tuỳ chọn bài đăng"
            onPress={() => detail.setMenuOpen(true)}
            className="h-10 w-10 items-center justify-center"
          >
            <CustomIcon name="postMore" size={24} />
          </Pressable>
        </View>
        <ScrollView
          ref={scroll}
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            if (scrollToNewComment.current) {
              scrollToNewComment.current = false;
              scroll.current?.scrollToEnd({ animated: true });
            }
          }}
        >
          <PostDetailContent
            post={post}
            useful={Boolean(detail.useful[post.id])}
            onUseful={() => detail.toggleUseful(post.id)}
            onContact={detail.contact}
            onImage={() => detail.setGalleryOpen(true)}
          />
          <View
            onLayout={(event) => {
              if (params.comments === 'true' && !commentsOpened.current) {
                commentsOpened.current = true;
                scroll.current?.scrollTo({ y: event.nativeEvent.layout.y, animated: false });
              }
            }}
          >
            <PostComments
              rows={detail.rows}
              count={detail.commentCount}
              liked={detail.likedComments}
              onLike={(commentId) =>
                detail.setLikedComments((previous) => ({ ...previous, [commentId]: !previous[commentId] }))
              }
              onReply={(name) => {
                detail.setReplyTo(name);
                input.current?.focus();
              }}
            />
          </View>
        </ScrollView>
        <View className="border-t border-[#F5F5F4] bg-white/95 px-4 py-3">
          {detail.replyTo ? (
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="flex-1 font-sans text-xs text-[#57534D]">Trả lời {detail.replyTo}</Text>
              <Pressable accessibilityRole="button" onPress={() => detail.setReplyTo(null)} hitSlop={8}>
                <Text className="font-sans-bold text-xs text-primary">Huỷ</Text>
              </Pressable>
            </View>
          ) : null}
          <View className="flex-row items-center gap-3">
            <Avatar
              initial={profile.fullName.charAt(0) || 'P'}
              size={36}
              radius={18}
              imageUrl={profile.avatarUri ?? Image.resolveAssetSource(PHOTOS.me).uri}
            />
            <View className="min-h-11 flex-1 flex-row items-center rounded-xl border border-[#F5F5F4] bg-[#FAFAF9] pr-4">
              <TextInput
                ref={input}
                accessibilityLabel="Viết bình luận"
                placeholder="Viết bình luận..."
                placeholderTextColor="#292524"
                value={detail.draft}
                onChangeText={detail.setDraft}
                maxLength={300}
                style={styles.input}
                returnKeyType="send"
                onSubmitEditing={sendComment}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Gửi bình luận"
                accessibilityState={{ disabled: !detail.draft.trim() }}
                disabled={!detail.draft.trim()}
                onPress={sendComment}
                hitSlop={10}
              >
                <Text className="font-sans-black text-[13px] text-primary">GỬI</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      <ActionSheetMenu
        visible={detail.menuOpen}
        onClose={() => detail.setMenuOpen(false)}
        title="Tuỳ chọn bài viết"
        subtitle={`Bài đăng của ${post.name}`}
        items={getPostMenuItems({
          saved: Boolean(detail.saved[post.id]),
          onSave: () => detail.setSaved((previous) => ({ ...previous, [post.id]: !previous[post.id] })),
          onShare: () => void detail.share(),
          onReport: () => router.push({ pathname: '/report', params: { postId: post.id } }),
          onHide: () => {
            usePostInteractions.getState().setHidden((previous) => [...previous, post.id]);
            back();
          },
        })}
      />
      <BottomSheet visible={detail.galleryOpen} onClose={() => detail.setGalleryOpen(false)}>
        <ScrollView horizontal pagingEnabled contentContainerStyle={styles.gallery}>
          {post.photos.map((photo, index) => (
            <Image
              key={index}
              source={photo}
              style={{ width: Math.max(1, width - 40), height: Math.min(350, height * 0.6) }}
              resizeMode="contain"
            />
          ))}
        </ScrollView>
        <Button label="Đóng" variant="outline" onPress={() => detail.setGalleryOpen(false)} />
      </BottomSheet>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1, backgroundColor: '#F8F9FA' },
  input: {
    flex: 1,
    height: 44,
    fontSize: 14,
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontFamily: 'BeVietnamPro_400Regular',
  },
  gallery: { paddingBottom: 16 },
});
