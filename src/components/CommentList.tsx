import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ActionSheetMenu, type ActionSheetItem } from './ui/ActionSheetMenu';
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
}

interface CommentListProps {
  comments: Comment[];
  currentUserId?: string;
  postAuthorId: string;
  onEdit: (commentId: string, newContent: string) => void;
  onDelete: (commentId: string) => void;
  onTogglePin: (commentId: string, isPinned: boolean) => void;
  onReport: (commentId: string, content: string) => void;
}

// Danh sách bình luận trong màn chi tiết bài — dựng bằng View thường (không FlatList) vì luôn nằm
// trong một ScrollView cha (tránh lỗi list-trong-list của React Native).
export function CommentList({
  comments,
  currentUserId,
  postAuthorId,
  onEdit,
  onDelete,
  onTogglePin,
  onReport,
}: CommentListProps) {
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const menuComment = comments.find((c) => c.id === menuFor);
  const menuItems = menuComment ? buildMenuItems(menuComment) : [];

  function buildMenuItems(c: Comment): ActionSheetItem[] {
    const isOwn = c.authorId === currentUserId;
    const isPostOwner = postAuthorId === currentUserId;
    const editItems: ActionSheetItem[] = isOwn
      ? [
          {
            label: 'Sửa bình luận',
            onPress: () => {
              setEditingId(c.id);
              setDraft(c.content);
            },
          },
          { label: 'Xoá bình luận', destructive: true, onPress: () => onDelete(c.id) },
        ]
      : [];
    const pinItem: ActionSheetItem[] =
      isPostOwner && !isOwn
        ? [{ label: c.isPinned ? 'Bỏ ghim' : 'Ghim lên đầu', onPress: () => onTogglePin(c.id, !c.isPinned) }]
        : [];
    const reportItem: ActionSheetItem[] = isOwn
      ? []
      : [{ label: 'Báo cáo', destructive: true, onPress: () => onReport(c.id, c.content) }];
    return [...editItems, ...pinItem, ...reportItem];
  }

  return (
    <View className="gap-3.5">
      {comments.map((c) => (
        <View key={c.id} className="flex-row gap-2.5">
          <Avatar initial={c.initial} color={c.color} size={32} radius={10} />
          <View className="flex-1">
            <View className="flex-row items-baseline gap-1.5">
              <Text className="font-sans-semibold text-[13px] text-ink">{c.authorName}</Text>
              {c.isPinned ? <Text className="text-[11px] text-primary">· đã ghim</Text> : null}
              <Text className="text-[11px] text-muted-light">{c.timeAgo}</Text>
              <View className="flex-1" />
              <Pressable onPress={() => setMenuFor(c.id)} hitSlop={8}>
                <Text className="text-muted text-xs">•••</Text>
              </Pressable>
            </View>
            {editingId === c.id ? (
              <View className="mt-1 gap-1.5">
                <TextInput value={draft} onChangeText={setDraft} placeholder="Sửa bình luận…" />
                <View className="flex-row gap-2">
                  <Pressable onPress={() => setEditingId(null)} className="px-2.5 py-1 rounded-lg border border-border">
                    <Text className="text-xs text-muted">Hủy</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      if (draft.trim()) onEdit(c.id, draft.trim());
                      setEditingId(null);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-ink"
                  >
                    <Text className="text-xs text-white">Lưu</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Text className="mt-0.5 text-[13.5px] leading-[20px] text-ink/85">{c.content}</Text>
            )}
          </View>
        </View>
      ))}

      <ActionSheetMenu visible={menuFor !== null} onClose={() => setMenuFor(null)} items={menuItems} />
    </View>
  );
}
