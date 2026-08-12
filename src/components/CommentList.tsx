import { Text, View } from 'react-native';

import { Avatar } from './ui/Avatar';

export interface Comment {
  id: string;
  authorName: string;
  initial: string;
  color: string;
  content: string;
  timeAgo: string;
}

interface CommentListProps {
  comments: Comment[];
}

// Danh sách bình luận trong màn chi tiết bài — dựng bằng View thường (không FlatList) vì luôn nằm
// trong một ScrollView cha (tránh lỗi list-trong-list của React Native).
export function CommentList({ comments }: CommentListProps) {
  return (
    <View className="gap-3.5">
      {comments.map((c) => (
        <View key={c.id} className="flex-row gap-2.5">
          <Avatar initial={c.initial} color={c.color} size={32} radius={10} />
          <View className="flex-1">
            <View className="flex-row items-baseline gap-1.5">
              <Text className="font-sans-semibold text-[13px] text-ink">{c.authorName}</Text>
              <Text className="text-[11px] text-muted-light">{c.timeAgo}</Text>
            </View>
            <Text className="mt-0.5 text-[13.5px] leading-[20px] text-ink/85">{c.content}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
