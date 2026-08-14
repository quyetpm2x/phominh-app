import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage } from '../../../src/api/client';
import { PostStyleTools } from '../../../src/components/PostStyleTools';
import { TextInput } from '../../../src/components/ui/TextInput';
import { fontSizeToStyle, type PostFontSize } from '../../../src/constants/post-style-presets';
import { usePost, useUpdatePost } from '../../../src/hooks/usePost';

// Sửa bài đăng của chính mình (mục 33) — chỉ sửa nội dung + style, KHÔNG cho đổi ảnh/vị trí/loại
// bài (xem UpdatePostDto ở backend vì sao).
export default function EditPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: post, isLoading } = usePost(id);
  const updatePost = useUpdatePost(id);

  const [content, setContent] = useState('');
  const [textColor, setTextColor] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<PostFontSize | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!post) return;
    setContent(post.content);
    setTextColor(post.textColor);
    setBackgroundColor(post.backgroundColor);
    setFontSize(post.fontSize);
  }, [post]);

  const onSave = async () => {
    if (!content.trim() || updatePost.isPending) return;
    setError(null);
    try {
      await updatePost.mutateAsync({
        content: content.trim(),
        textColor: textColor ?? undefined,
        backgroundColor: backgroundColor ?? undefined,
        fontSize: fontSize ?? undefined,
      });
      router.back();
    } catch (err) {
      setError(await extractErrorMessage(err));
    }
  };

  if (isLoading || !post) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center justify-between px-3.5 border-b border-border bg-white">
        <Pressable onPress={() => router.back()}>
          <Text className="text-[15px] text-ink">‹ Huỷ</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Sửa bài đăng</Text>
        <Pressable
          onPress={() => void onSave()}
          disabled={!content.trim() || updatePost.isPending}
          className={`h-8 rounded-lg px-3.5 items-center justify-center ${content.trim() ? 'bg-ink' : 'bg-border'}`}
        >
          <Text className={`font-sans-semibold text-xs ${content.trim() ? 'text-white' : 'text-muted'}`}>Lưu</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="p-3.5">
        {error ? <Text className="mb-2 text-xs text-danger">{error}</Text> : null}
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Nội dung bài đăng…"
          multiline
          maxLength={2000}
          style={[
            { minHeight: 90, color: textColor ?? undefined, backgroundColor: backgroundColor ?? undefined },
            fontSizeToStyle(fontSize),
          ]}
        />

        <PostStyleTools
          textColor={textColor}
          backgroundColor={backgroundColor}
          fontSize={fontSize}
          onTextColorChange={setTextColor}
          onBackgroundColorChange={setBackgroundColor}
          onFontSizeChange={setFontSize}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
