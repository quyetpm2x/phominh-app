import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { extractErrorMessage } from '../api/client';
import { useCreateComment } from '../hooks/useComments';
import { TextInput } from './ui/TextInput';
import { FilterChip } from './ui/Chip';

interface CommentComposerProps {
  postId: string;
}

export function CommentComposer({ postId }: CommentComposerProps) {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [error, setError] = useState<string | null>(null);
  const createComment = useCreateComment(postId);

  const onSend = async () => {
    if (!content.trim() || createComment.isPending) return;
    setError(null);
    try {
      await createComment.mutateAsync({ content: content.trim(), visibility });
      setContent('');
    } catch (err) {
      setError(await extractErrorMessage(err));
    }
  };

  return (
    <View className="border-t border-border px-3.5 pt-2.5 pb-3 bg-white">
      <View className="flex-row gap-1.5">
        <FilterChip label="Công khai" selected={visibility === 'public'} onPress={() => setVisibility('public')} />
        <FilterChip label="Chỉ chủ bài thấy" selected={visibility === 'private'} onPress={() => setVisibility('private')} />
      </View>
      {error ? <Text className="mt-1.5 text-xs text-danger">{error}</Text> : null}
      <View className="mt-2 flex-row items-center gap-2.5">
        <View className="flex-1">
          <TextInput value={content} onChangeText={setContent} placeholder="Viết bình luận…" />
        </View>
        <Pressable
          onPress={() => void onSend()}
          disabled={createComment.isPending}
          className="w-10 h-10 rounded-full bg-ink items-center justify-center"
        >
          <Text className="text-white">↑</Text>
        </Pressable>
      </View>
    </View>
  );
}
