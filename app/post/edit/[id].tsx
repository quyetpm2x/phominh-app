import { Redirect, router, Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../src/components/ui/Button';
import { colors } from '../../../src/constants/design-tokens';
import { EditPostForm } from '../../../src/features/post-edit/EditPostForm';
import { usePostDetail } from '../../../src/features/post/usePostDetail';
import { LOCAL_USER_ID } from '../../../src/lib/personalProfile';

export default function EditPostScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { post, signedIn } = usePostDetail(id);
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
          {post ? 'Bạn chỉ có thể chỉnh sửa bài viết của chính mình.' : 'Bài viết không tồn tại.'}
        </Text>
        <Button
          label="Quay lại"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
        />
      </SafeAreaView>
    );
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-[#F8F9FA]">
      <Stack.Screen options={{ gestureEnabled: false }} />
      <EditPostForm key={post.id} post={post} />
    </SafeAreaView>
  );
}
