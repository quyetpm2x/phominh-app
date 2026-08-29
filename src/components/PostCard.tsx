import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, Share, Text, View } from 'react-native';

import { colors } from '../constants/design-tokens';
import type { UIPost } from '../mocks/phoMinh';
import { Chip } from './ui/Chip';
import { HighlightedText } from './ui/HighlightedText';
import { PhotoPlaceholder } from './ui/PhotoPlaceholder';
import { PostAvatar, PostMetaRow, PostPhotos, Waveform } from './PostCardParts';

const TAG_COLOR: Record<UIPost['tagColor'], 'green' | 'gold' | 'red' | 'gray'> = {
  green: 'green',
  gold: 'gold',
  red: 'red',
  gray: 'gray',
};

// Màu dải viền trái của biến thể "full" — KHÔNG dùng chung TAG_COLOR/tagColor (map thẳng theo tên
// màu, ra sai ý mockup 2026-08-26: mockup dùng dải HỒNG cho bài merchant "Cô Hoa Bún Chả", dải CAM
// cho bài đời sống "Bác Tuấn T4" — ngược với tagColor cũ đang gán 'gray'/'gold' theo postType).
// Tách hàm riêng theo đúng ý mockup: khẩn cấp luôn đỏ, còn lại tuỳ isShop (quán=hồng, đời sống=cam).
function getStripColor(post: UIPost): string {
  if (post.tagColor === 'red') return colors.danger.DEFAULT;
  return post.isShop ? colors.primary.DEFAULT : colors.accent.DEFAULT;
}

const CARD_RADIUS = 16; // = rounded-2xl
const STRIP_WIDTH = 5;

interface PostCardProps {
  post: UIPost;
  onVote?: () => void;
  canVote?: boolean;
  onConfirmUrgent?: () => void;
}

// Giao diện "full" làm lại theo mockup 2026-08-26 (avatar viền tròn, hàng badge có icon, action row
// gộp 1 hàng, nút liên hệ/chi tiết). Mockup có vài chi tiết KHÔNG có dữ liệu thật đứng sau nên đã bỏ
// thay vì bịa: giá tiền/suất (không có field `price`), badge "Đã kiểm duyệt" (không có cơ chế duyệt
// ảnh nào), nhãn "Hàng xóm N năm" (không có field tuổi tài khoản) — pill cạnh tên chỉ dùng `isFaved`
// thật có sẵn. Nút "..." giờ mở thật màn báo cáo bài (report/post.tsx) thay vì chỉ trang trí. Nút
// "Liên hệ quán"/"Xem chi tiết" đều mở chi tiết bài (`NearbyPost` không có `merchantContact` — field
// đó chỉ có ở `PostDetail`, gọi trực tiếp SĐT ngay từ feed sẽ cần thêm 1 API riêng, ngoài phạm vi).
export function PostCard({ post, onVote, canVote = true, onConfirmUrgent }: PostCardProps) {
  const open = () => router.push(`/post/${post.id}`);
  const onReport = () => router.push({ pathname: '/report/post', params: { postId: post.id } });
  const onShare = () => {
    void Share.share({ message: `${post.text}\n\nXem trên Phố Mình: phominh://post/${post.id}` });
  };

  if (post.variant === 'compact') {
    return (
      <Pressable onPress={open} className="rounded-2xl border border-border bg-white p-3 flex-row gap-3">
        <PhotoPlaceholder style={{ width: 86, height: 86, borderRadius: 12 }} />
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="font-sans-semibold text-[13.5px] text-ink">{post.author}</Text>
            <Chip label={post.tag} color={TAG_COLOR[post.tagColor]} />
          </View>
          <HighlightedText
            text={post.text}
            numberOfLines={2}
            className="mt-1 text-[13px] leading-[19px] text-ink/85"
          />
          <Text className="mt-1.5 font-mono-medium text-[11px] text-muted">
            {post.distance} · {post.timeAgo}
          </Text>
        </View>
      </Pressable>
    );
  }

  const cardBody = (
    <View>
      <View className="flex-row items-start justify-between gap-2 p-3.5 pb-2.5">
          <View className="flex-1 flex-row items-center gap-2.5">
            <PostAvatar post={post} />
            <View className="flex-1">
              <View className="flex-row flex-wrap items-center gap-1.5">
                <Text className="font-sans-bold text-[15px] text-ink">{post.author}</Text>
                {/* Đúng 1 pill quan hệ cạnh tên theo mockup (không kèm thêm chip loại bài như bản
                    trước — mockup không có 2 pill chồng nhau ở đây). isShop → "Quán" (thật, không
                    bịa "quen" vì không có field đo mức độ quen), else isFaved → "Người quen". */}
                {post.isShop ? (
                  <Chip label="Quán" color="green" />
                ) : post.isFaved ? (
                  <Chip label="Người quen" color="green" />
                ) : null}
              </View>
              <PostMetaRow post={post} />
            </View>
          </View>
          <Pressable onPress={onReport} className="-mr-1 -mt-1 rounded-full p-1.5 active:bg-cream-surface">
            <Ionicons name="ellipsis-vertical" size={16} color={colors.muted.DEFAULT} />
          </Pressable>
        </View>

        <Pressable onPress={open}>
          <HighlightedText text={post.text} className="px-3.5 pb-3 text-[14.5px] leading-[22px] text-ink/90" />
        </Pressable>

        {post.hasVoice ? (
          <View className="mx-3.5 mb-3 flex-row items-center gap-2.5 rounded-xl bg-cream-dark border border-border-soft px-3 py-2.5">
            <View className="w-8 h-8 rounded-full bg-ink items-center justify-center">
              <Ionicons name="play" size={13} color="#fff" />
            </View>
            <Waveform />
            <Text className="font-mono-medium text-[11px] text-muted">{post.voiceLen}</Text>
          </View>
        ) : null}

        <PostPhotos count={post.photos} hasVideo={post.hasVideo} imageUrl={post.imageUrl} mediaNote={post.mediaNote} />

        {post.isUrgent ? (
          <View className="mx-3.5 mb-3 flex-row items-center gap-2.5 rounded-[11px] bg-danger-50 border border-danger-100 px-3 py-2.5">
            <Text className="flex-1 text-xs leading-[18px] text-danger-text">
              {post.confirmCount} người đã xác nhận · bấm nếu bạn cũng thấy đúng vậy
            </Text>
            <Pressable onPress={onConfirmUrgent} className="h-[30px] rounded-lg bg-danger px-2.5 items-center justify-center">
              <Text className="font-sans-semibold text-xs text-white">Tôi cũng thấy</Text>
            </Pressable>
          </View>
        ) : null}

        <View className="mx-3.5 mb-3 mt-0.5 flex-row items-center justify-between rounded-xl bg-cream-surface/60 px-1.5 py-1.5">
          <View className="flex-row items-center">
            <Pressable
              onPress={onVote}
              disabled={post.hasVoted || !canVote}
              className={`flex-row items-center gap-1.5 rounded-full px-2.5 py-1.5 active:bg-white ${!canVote ? 'opacity-50' : ''}`}
            >
              <Ionicons
                name={post.hasVoted ? 'thumbs-up' : 'thumbs-up-outline'}
                size={16}
                color={post.hasVoted ? colors.primary.DEFAULT : colors.muted.DEFAULT}
              />
              <Text className={`font-sans-bold text-xs ${post.hasVoted ? 'text-primary' : 'text-ink'}`}>{post.votes}</Text>
            </Pressable>
            <Pressable onPress={open} className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1.5 active:bg-white">
              <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.muted.DEFAULT} />
              <Text className="font-sans-semibold text-xs text-muted">{post.comments}</Text>
            </Pressable>
            <Pressable onPress={onShare} className="rounded-full p-2 active:bg-white">
              <Ionicons name="share-social-outline" size={16} color={colors.muted.DEFAULT} />
            </Pressable>
          </View>

          {post.isShop ? (
            <Pressable onPress={open} className="active:scale-95">
              <LinearGradient
                colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: 30,
                  paddingHorizontal: 14,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Ionicons name="call" size={12} color="#fff" />
                <Text className="font-sans-bold text-[11.5px] text-white">Liên hệ quán</Text>
              </LinearGradient>
            </Pressable>
          ) : (
            <Pressable
              onPress={open}
              className="h-[30px] flex-row items-center gap-1 rounded-[10px] border border-border bg-white px-3 active:scale-95"
            >
              <Text className="font-sans-bold text-[11.5px] text-ink">Xem chi tiết</Text>
              <Ionicons name="arrow-forward" size={11} color={colors.muted.DEFAULT} />
            </Pressable>
          )}
        </View>

        <Text className="px-3.5 pb-2.5 font-mono-medium text-[10px] text-muted-light">
          {post.expiry} · {post.displayMode === 'real_name' ? 'Tên thật' : 'Bí danh'}
        </Text>
    </View>
  );

  // "Viền lộ qua nền" — KHÔNG trông chờ overflow-hidden clip 1 dải màu mỏng theo đúng góc bo tròn
  // (đã thử, không đáng tin cậy trên thiết bị thật, độ cong bị mất). Thay bằng 2 lớp tự bo góc độc
  // lập (cùng kỹ thuật viền gradient avatar quán/ô mã OTP): View NGOÀI nền màu dải, bo đủ 4 góc; View
  // TRONG nền trắng thụt vào từ trái đúng STRIP_WIDTH, bo góc trái NHỎ hơn (CARD_RADIUS-STRIP_WIDTH)
  // để dải màu tự "hiện ra" cong đều 2 đầu, góc phải bo đủ CARD_RADIUS để khớp cạnh phải không thụt.
  return (
    <View style={{ borderRadius: CARD_RADIUS, backgroundColor: getStripColor(post) }} className="overflow-hidden border border-border">
      <View
        style={{
          marginLeft: STRIP_WIDTH,
          borderTopLeftRadius: CARD_RADIUS - STRIP_WIDTH,
          borderBottomLeftRadius: CARD_RADIUS - STRIP_WIDTH,
          borderTopRightRadius: CARD_RADIUS,
          borderBottomRightRadius: CARD_RADIUS,
        }}
        className="overflow-hidden bg-white"
      >
        {cardBody}
      </View>
    </View>
  );
}
