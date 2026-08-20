import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { extractErrorMessage } from '../api/client';
import { useCreateComment } from '../hooks/useComments';
import { TextInput } from './ui/TextInput';
import { FilterChip } from './ui/Chip';

interface CommentComposerProps {
  postId: string;
  replyingTo: { commentId: string; authorName: string } | null;
  onCancelReply: () => void;
}

export function CommentComposer({ postId, replyingTo, onCancelReply }: CommentComposerProps) {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [error, setError] = useState<string | null>(null);
  const createComment = useCreateComment(postId);

  const onSend = async () => {
    if (!content.trim() || createComment.isPending) return;
    setError(null);
    try {
      await createComment.mutateAsync({
        content: content.trim(),
        visibility,
        parentCommentId: replyingTo?.commentId,
      });
      setContent('');
      onCancelReply();
    } catch (err) {
      setError(await extractErrorMessage(err));
    }
  };

  return (
    <View className="border-t border-border px-3.5 pt-2.5 pb-3 bg-white">
      {replyingTo && (
        <View className="mb-2 flex-row items-center justify-between rounded-lg bg-cream-surface px-2.5 py-1.5">
          <Text className="text-xs text-muted">Đang trả lời {replyingTo.authorName}</Text>
          <Pressable onPress={onCancelReply} hitSlop={8}>
            <Text className="text-xs text-muted-light">✕</Text>
          </Pressable>
        </View>
      )}
      <View className="flex-row gap-1.5">
        <FilterChip label="Công khai" selected={visibility === 'public'} onPress={() => setVisibility('public')} />
        <FilterChip label="Chỉ chủ bài thấy" selected={visibility === 'private'} onPress={() => setVisibility('private')} />
      </View>
      {error ? <Text className="mt-1.5 text-xs text-danger">{error}</Text> : null}
      <View className="mt-2 flex-row items-center gap-2.5">
        <View className="flex-1">
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder={replyingTo ? `Trả lời ${replyingTo.authorName}…` : 'Viết bình luận…'}
          />
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
