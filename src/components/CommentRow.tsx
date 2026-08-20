import { Pressable, Text, View } from 'react-native';

import { Avatar } from './ui/Avatar';
import { TextInput } from './ui/TextInput';

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  initial: string;
  color: string;
  content: string;
  timeAgo: string;
  isPinned: boolean;
  voteCount: number;
  hasVoted: boolean;
  replies: Comment[];
}

interface CommentRowProps {
  comment: Comment;
  isReply: boolean;
  currentUserId?: string;
  editingId: string | null;
  draft: string;
  onDraftChange: (v: string) => void;
  onStartEdit: (id: string, content: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string) => void;
  onOpenMenu: (id: string) => void;
  onVote: (commentId: string) => void;
  onReply?: (commentId: string, authorName: string) => void;
}

// 1 dòng bình luận — dùng chung cho cả bình luận gốc và reply (isReply chỉ đổi avatar nhỏ hơn +
// ẩn nút "Trả lời", vì reply lồng nhau chỉ hỗ trợ 1 cấp, không cho trả lời 1 reply — xem CommentList).
export function CommentRow({
  comment: c,
  isReply,
  currentUserId,
  editingId,
  draft,
  onDraftChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onOpenMenu,
  onVote,
  onReply,
}: CommentRowProps) {
  return (
    <View className="flex-row gap-2.5">
      <Avatar initial={c.initial} color={c.color} size={isReply ? 26 : 32} radius={10} />
      <View className="flex-1">
        <View className="flex-row items-baseline gap-1.5">
          <Text className="font-sans-semibold text-[13px] text-ink">{c.authorName}</Text>
          {c.isPinned ? <Text className="text-[11px] text-primary">· đã ghim</Text> : null}
          <Text className="text-[11px] text-muted-light">{c.timeAgo}</Text>
          <View className="flex-1" />
          <Pressable onPress={() => onOpenMenu(c.id)} hitSlop={8}>
            <Text className="text-muted text-xs">•••</Text>
          </Pressable>
        </View>
        {editingId === c.id ? (
          <View className="mt-1 gap-1.5">
            <TextInput value={draft} onChangeText={onDraftChange} placeholder="Sửa bình luận…" />
            <View className="flex-row gap-2">
              <Pressable onPress={onCancelEdit} className="px-2.5 py-1 rounded-lg border border-border">
                <Text className="text-xs text-muted">Hủy</Text>
              </Pressable>
              <Pressable onPress={() => onSaveEdit(c.id)} className="px-2.5 py-1 rounded-lg bg-ink">
                <Text className="text-xs text-white">Lưu</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Text className="mt-0.5 text-[13.5px] leading-[20px] text-ink/85">{c.content}</Text>
        )}
        <View className="mt-1 flex-row items-center gap-3.5">
          <Pressable
            onPress={() => onVote(c.id)}
            disabled={c.hasVoted || c.authorId === currentUserId}
            hitSlop={6}
            className="self-start flex-row items-center gap-1"
          >
            <Text className={`text-[11px] ${c.hasVoted ? 'text-primary' : 'text-muted-light'}`}>▲</Text>
            <Text
              className={`text-[11px] ${c.hasVoted ? 'text-primary font-sans-semibold' : 'text-muted-light'}`}
            >
              Hữu ích{c.voteCount > 0 ? ` · ${c.voteCount}` : ''}
            </Text>
          </Pressable>
          {!isReply && onReply && (
            <Pressable onPress={() => onReply(c.id, c.authorName)} hitSlop={6}>
              <Text className="text-[11px] text-muted-light">Trả lời</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
