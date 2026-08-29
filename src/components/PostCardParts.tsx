import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Text, View } from 'react-native';

import { colors } from '../constants/design-tokens';
import type { UIPost } from '../mocks/phoMinh';
import { Avatar } from './ui/Avatar';
import { PhotoPlaceholder } from './ui/PhotoPlaceholder';

// Tách khỏi PostCard.tsx (vượt 250 dòng sau khi làm lại giao diện theo mockup 2026-08-26) — các
// mảnh nhỏ dùng riêng cho biến thể "full" của PostCard.

// Vòng viền quanh avatar: gradient hồng-cam cho quán (isShop), viền màu nhạt cho người thường —
// badge góc dưới đổi theo (sao cho quán / khiên xác thực cho người dùng thường). Không có
// `authorAvatarUrl` thật ở NearbyPost nên luôn dùng bong bóng chữ cái, không bịa ảnh đại diện.
export function PostAvatar({ post }: { post: UIPost }) {
  const badgeColor = post.isShop ? colors.primary.DEFAULT : colors.accent.DEFAULT;
  const badgeIcon = post.isShop ? 'star' : 'shield-checkmark';

  return (
    <View className="relative">
      {post.isShop ? (
        <LinearGradient
          colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
          style={{ width: 44, height: 44, borderRadius: 22, padding: 2 }}
        >
          <View className="flex-1 overflow-hidden rounded-full bg-white">
            <Avatar initial={post.initial} color={post.avatarColor} size={40} radius={20} />
          </View>
        </LinearGradient>
      ) : (
        <View
          style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: `${post.avatarColor}40` }}
          className="items-center justify-center"
        >
          <Avatar initial={post.initial} color={post.avatarColor} size={38} radius={19} />
        </View>
      )}
      <View
        style={{ backgroundColor: badgeColor }}
        className="absolute -bottom-0.5 -right-0.5 h-4 w-4 items-center justify-center rounded-full"
      >
        <Ionicons name={badgeIcon} size={9} color="#fff" />
      </View>
    </View>
  );
}

// Hàng mô tả dưới tên: badge uy tín (post.badge — dữ liệu thật) · thời gian đăng · khoảng cách.
export function PostMetaRow({ post }: { post: UIPost }) {
  return (
    <View className="mt-0.5 flex-row flex-wrap items-center gap-1">
      {post.badge ? (
        <>
          {/* Không thêm icon riêng — post.badge (dữ liệu thật, vd "🌱 Người mới") đã tự có emoji
              làm icon sẵn từ backend (DEFAULT_BADGE_LABEL), thêm Ionicons vào sẽ bị lặp 2 icon. */}
          <Text className="font-sans-bold text-[11px] text-primary">{post.badge}</Text>
          <Text className="text-[11px] text-muted">·</Text>
        </>
      ) : null}
      <View className="flex-row items-center gap-0.5">
        <Ionicons name="time" size={11} color={colors.accent.DEFAULT} />
        <Text className="font-sans-semibold text-[11px] text-accent">{post.timeAgo}</Text>
      </View>
      <Text className="text-[11px] text-muted">·</Text>
      <View className="flex-row items-center gap-0.5">
        <Ionicons name="navigate" size={10} color={colors.primary.DEFAULT} />
        <Text className="font-sans-bold text-[11px] text-ink">{post.distance}</Text>
      </View>
    </View>
  );
}

export function PostPhotos({
  count,
  hasVideo,
  imageUrl,
  mediaNote,
}: {
  count: number;
  hasVideo?: boolean;
  imageUrl?: string | null;
  mediaNote?: string;
}) {
  if (count === 0) return null;
  if (count === 1) {
    return (
      <View className="relative mx-3.5 mb-3.5 overflow-hidden rounded-xl" style={{ aspectRatio: 16 / 10 }}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={{ flex: 1 }} resizeMode="cover" />
        ) : (
          <PhotoPlaceholder icon={hasVideo ? 'video' : 'photo'} style={{ flex: 1 }} />
        )}
        {mediaNote ? (
          <View className="absolute bottom-2 left-2 flex-row items-center gap-1 rounded-lg bg-ink/60 px-2 py-1">
            <Ionicons name="camera" size={11} color={colors.accent.DEFAULT} />
            <Text className="text-[10px] font-sans-medium text-white/90">{mediaNote}</Text>
          </View>
        ) : null}
      </View>
    );
  }
  const shown = Math.min(count, 3);
  const extra = count - 3;
  return (
    <View className="px-3.5 pb-3 flex-row gap-1.5">
      {Array.from({ length: shown }).map((_, i) => (
        <View key={i} className="flex-1 h-24 rounded-[10px] overflow-hidden">
          <PhotoPlaceholder style={{ flex: 1 }} label={i === shown - 1 && extra > 0 ? `+${extra}` : undefined} />
        </View>
      ))}
    </View>
  );
}

export function Waveform() {
  const bars = [6, 12, 18, 10, 16, 8, 14, 9, 17, 11];
  return (
    <View className="flex-1 flex-row items-center gap-0.5 h-[22px]">
      {bars.map((h, i) => (
        <View key={i} style={{ width: 2, height: h, borderRadius: 1, backgroundColor: colors.muted.light }} />
      ))}
    </View>
  );
}
