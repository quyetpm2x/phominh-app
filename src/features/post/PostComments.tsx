import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import type { PostComment } from './data';

interface Props {
  rows: readonly PostComment[];
  count: number;
  liked: Record<string, boolean>;
  onLike: (id: string) => void;
  onReply: (name: string) => void;
}
export function PostComments({ rows, count, liked, onLike, onReply }: Props) {
  return (
    <>
      <View className="flex-row flex-wrap items-center justify-between gap-2 border-b border-[#F5F5F4] bg-[#FAFAF9] px-5 py-4">
        <View className="flex-row flex-wrap items-center gap-4">
          <Text className="font-sans-bold text-[13px] tracking-[0.65px] text-[#1C1917]">
            BÌNH LUẬN · {count}
          </Text>
          <View className="flex-row items-center gap-1.5">
            <View className="h-1.5 w-1.5 rounded-full bg-primary/50" />
            <Text className="font-sans-bold text-[10px] text-primary">ĐANG CẬP NHẬT</Text>
          </View>
        </View>
        <Text className="font-sans-bold text-[10px] italic text-[#A6A09B]">CHỦ BÀI KIỂM DUYỆT</Text>
      </View>
      {rows.map((comment) => (
        <View
          key={comment.id}
          className="flex-row items-start gap-3 border-b border-[#FAFAF9] bg-white p-5"
          style={comment.hidden ? styles.hidden : undefined}
        >
          <Avatar
            initial={comment.name.charAt(0)}
            size={36}
            radius={18}
            imageUrl={comment.avatar ? Image.resolveAssetSource(comment.avatar).uri : undefined}
          />
          <View className="flex-1 gap-1.5">
            <View className="flex-row flex-wrap items-center justify-between gap-1">
              <Text className="font-sans-bold text-[13px] text-[#1C1917]">{comment.name}</Text>
              <Text className="font-sans-medium text-[10px] text-[#A6A09B]">{comment.time}</Text>
            </View>
            <View className="rounded-b-[28px] rounded-tr-[28px] border border-[#F5F5F4]/50 bg-[#FAFAF9] p-3">
              <Text
                className={
                  comment.hidden
                    ? 'font-sans text-[13px] leading-[21px] italic text-[#A6A09B]'
                    : 'font-sans text-[13px] leading-[21px] text-[#44403B]'
                }
              >
                {comment.text}
              </Text>
            </View>
            {!comment.hidden ? (
              <View className="flex-row gap-4">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Thích bình luận của ${comment.name}`}
                  accessibilityState={{ selected: Boolean(liked[comment.id]) }}
                  hitSlop={8}
                  onPress={() => onLike(comment.id)}
                >
                  <Text
                    className={
                      liked[comment.id]
                        ? 'font-sans-black text-[11px] text-primary'
                        : 'font-sans-black text-[11px] text-[#A6A09B]'
                    }
                  >
                    {liked[comment.id] ? 'ĐÃ THÍCH' : 'THÍCH'}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Trả lời ${comment.name}`}
                  hitSlop={8}
                  onPress={() => onReply(comment.name)}
                >
                  <Text className="font-sans-black text-[11px] text-[#A6A09B]">TRẢ LỜI</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </View>
      ))}
      {rows.length === 0 ? (
        <Text className="bg-white p-5 text-center font-sans text-sm text-[#A6A09B]">
          Chưa có bình luận. Hãy là người đầu tiên chia sẻ!
        </Text>
      ) : null}
    </>
  );
}
const styles = StyleSheet.create({ hidden: { opacity: 0.6 } });
