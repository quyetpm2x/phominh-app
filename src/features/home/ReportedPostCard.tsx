import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { colors } from '../../constants/design-tokens';
import type { FeedPost } from './types';

interface Props {
  post: FeedPost;
  blocked: boolean;
  reduced: boolean;
  onBlock: () => void;
  onReduce: () => void;
  onUndoBlock: () => void;
  onUndoReduce: () => void;
  onManage: () => void;
}
export function ReportedPostCard({
  post,
  blocked,
  reduced,
  onBlock,
  onReduce,
  onUndoBlock,
  onUndoReduce,
  onManage,
}: Props) {
  if (blocked || reduced)
    return (
      <View style={styles.confirmation}>
        <View className="flex-row items-center gap-2.5">
          <View className="h-9 w-9 items-center justify-center rounded-[10px] border border-[#E9ECEF]/60 bg-[#F1F3F5]">
            <CustomIcon name={blocked ? 'preferenceHidden' : 'reportedTopic'} size={18} color="#1A1A1A" />
          </View>
          <View className="flex-1">
            <Text
              accessibilityRole="header"
              numberOfLines={1}
              className="font-sans-black text-[13px] leading-[19.5px] text-[#1A1A1A]"
            >
              {blocked
                ? `Đã ẩn tất cả bài từ ${post.name}`
                : `Đã giảm đề xuất chủ đề ${post.merchant ? 'Quán ăn' : 'Khu dân cư'}`}
            </Text>
            <Text numberOfLines={1} className="font-sans text-[11px] leading-[16.5px] text-[#4A4A4A]">
              {blocked
                ? 'Sẽ không xuất hiện trên dòng tin của bạn'
                : 'Ưu tiên các bài viết thuộc chủ đề khác'}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={blocked ? `Hoàn tác ẩn bài từ ${post.name}` : 'Hoàn tác giảm đề xuất chủ đề'}
            onPress={blocked ? onUndoBlock : onUndoReduce}
            className="flex-row items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5"
          >
            <CustomIcon name="preferenceUndo" size={12} />
            <Text className="font-sans-black text-[11.5px] text-primary">Hoàn tác</Text>
          </Pressable>
        </View>
        <View className="flex-row flex-wrap items-center justify-between gap-2 border-t border-[#E9ECEF]/50 pt-2">
          <View className="flex-row items-center gap-1">
            <CustomIcon name="preferenceReceipt" size={12} />
            <Text className="font-sans-bold text-[11px] text-[#009966]">Đã ghi nhận báo cáo</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={onManage}
            hitSlop={8}
            className="flex-row items-center gap-0.5"
          >
            <Text className="font-sans-semibold text-[11px] text-[#4A4A4A]">Quản lý danh sách</Text>
            <CustomIcon name="preferenceChevron" size={10} />
          </Pressable>
        </View>
      </View>
    );
  return (
    <View style={[styles.card]}>
      <View className="flex-row items-center gap-3 border-b border-[#E9ECEF]/60 pb-3.5">
        <View className="h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
          <CustomIcon name="reportedHide" size={20} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text
              accessibilityRole="header"
              className="font-sans-black text-sm tracking-[-0.35px] text-[#1A1A1A]"
            >
              Đã ẩn bài viết
            </Text>
            <View className="h-1.5 w-1.5 rounded-full bg-primary" />
          </View>
          <Text
            style={styles.subtitle}
            className="font-sans-medium text-[11.5px] leading-[17.25px] text-[#4A4A4A]"
          >
            Giảm ưu tiên nội dung tương tự trên dòng tin
          </Text>
        </View>
      </View>
      <View className="gap-2 pt-3">
        <Text className="pl-0.5 font-sans-bold text-[11px] tracking-[0.55px] text-[#4A4A4A]">
          TÙY CHỈNH THÊM
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: blocked }}
          disabled={blocked}
          onPress={onBlock}
          className="flex-row items-center gap-2.5 rounded-2xl border border-[#E9ECEF]/60 bg-[#F1F3F5]/30 px-3.5 py-2.5"
        >
          <View className="h-7 w-7 items-center justify-center rounded-lg bg-[#F1F3F5]">
            <CustomIcon name="reportedAuthor" size={14} />
          </View>
          <View className="flex-1">
            <Text className="font-sans-bold text-xs leading-[18px] text-[#1A1A1A]">
              {blocked ? `Đã ẩn tất cả bài từ ${post.name}` : `Ẩn tất cả bài từ ${post.name}`}
            </Text>
            <Text className="font-sans text-[10.5px] leading-[15.75px] text-[#4A4A4A]">
              {post.merchant
                ? 'Không bao giờ thấy bài của quán này nữa'
                : 'Không bao giờ thấy bài của người này nữa'}
            </Text>
          </View>
          <CustomIcon name="reportedChevron" size={12} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: reduced }}
          disabled={reduced}
          onPress={onReduce}
          className="flex-row items-center gap-2.5 rounded-2xl border border-[#E9ECEF]/60 bg-[#F1F3F5]/30 px-3.5 py-2.5"
        >
          <View className="h-7 w-7 items-center justify-center rounded-lg bg-[#F1F3F5]">
            <CustomIcon name="reportedTopic" size={14} />
          </View>
          <View className="flex-1">
            <Text className="font-sans-bold text-xs leading-[18px] text-[#1A1A1A]">
              {reduced ? 'Đã giảm' : 'Giảm'} đề xuất chủ đề {post.merchant ? 'Quán ăn' : 'Khu dân cư'}
            </Text>
            <Text className="font-sans text-[10.5px] leading-[15.75px] text-[#4A4A4A]">
              {post.merchant
                ? 'Ưu tiên các bài viết sinh hoạt khu dân cư'
                : 'Ưu tiên các bài viết thuộc chủ đề khác'}
            </Text>
          </View>
          <CustomIcon name="reportedChevron" size={12} />
        </Pressable>
        <View className="flex-row items-center gap-2.5 rounded-2xl border border-[#00BC7D]/20 bg-[#00BC7D]/5 px-3.5 py-2.5">
          <View className="h-7 w-7 items-center justify-center rounded-lg bg-[#00BC7D]/10">
            <CustomIcon name="reportedStatus" size={14} />
          </View>
          <View className="flex-1">
            <Text className="font-sans-bold text-xs leading-[18px] text-[#007A55]">
              Đã gửi báo cáo bài viết
            </Text>
            <Text className="font-sans text-[10.5px] leading-[15.75px] text-[#4A4A4A]">
              Đội ngũ kiểm duyệt đang xem xét nội dung này
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  confirmation: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E9ECEFB3',
    borderRadius: 20,
    padding: 15,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  card: {
    backgroundColor: 'white',
    borderWidth: 0,
    borderLeftWidth: 4,
    borderColor: colors.primary.DEFAULT,
    borderStyle: 'dashed',
    borderRadius: 31,
    paddingLeft: 20,
    paddingRight: 17,
    paddingVertical: 17,
  },
  subtitle: { maxWidth: 187 },
});
