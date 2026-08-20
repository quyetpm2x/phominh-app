import { useState } from 'react';
import { View } from 'react-native';

import { ActionSheetMenu, type ActionSheetItem } from './ui/ActionSheetMenu';
import { CommentRow, type Comment } from './CommentRow';

export type { Comment } from './CommentRow';

interface CommentListProps {
  comments: Comment[];
  currentUserId?: string;
  postAuthorId: string;
  onEdit: (commentId: string, newContent: string) => void;
  onDelete: (commentId: string) => void;
  onTogglePin: (commentId: string, isPinned: boolean) => void;
  onReport: (commentId: string, content: string) => void;
  onVote: (commentId: string) => void;
  onReply: (commentId: string, authorName: string) => void;
}

// Danh sách bình luận trong màn chi tiết bài — dựng bằng View thường (không FlatList) vì luôn nằm
// trong một ScrollView cha (tránh lỗi list-trong-list của React Native). Reply lồng nhau 1 cấp,
// thụt lề dưới đúng bình luận gốc.
export function CommentList({
  comments,
  currentUserId,
  postAuthorId,
  onEdit,
  onDelete,
  onTogglePin,
  onReport,
  onVote,
  onReply,
}: CommentListProps) {
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const allComments = comments.flatMap((c) => [c, ...c.replies]);
  const menuComment = allComments.find((c) => c.id === menuFor);
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

  const sharedRowProps = {
    currentUserId,
    editingId,
    draft,
    onDraftChange: setDraft,
    onStartEdit: (id: string, content: string) => {
      setEditingId(id);
      setDraft(content);
    },
    onCancelEdit: () => setEditingId(null),
    onSaveEdit: (id: string) => {
      if (draft.trim()) onEdit(id, draft.trim());
      setEditingId(null);
    },
    onOpenMenu: setMenuFor,
    onVote,
  };

  return (
    <View className="gap-3.5">
      {comments.map((c) => (
        <View key={c.id} className="gap-3">
          <CommentRow comment={c} isReply={false} onReply={onReply} {...sharedRowProps} />
          {c.replies.length > 0 && (
            <View className="ml-[42px] gap-3">
              {c.replies.map((r) => (
                <CommentRow key={r.id} comment={r} isReply {...sharedRowProps} />
              ))}
            </View>
          )}
        </View>
      ))}

      <ActionSheetMenu visible={menuFor !== null} onClose={() => setMenuFor(null)} items={menuItems} />
    </View>
  );
}
