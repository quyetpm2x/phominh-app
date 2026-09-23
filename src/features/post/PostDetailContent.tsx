import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { HighlightedText } from '../../components/ui/HighlightedText';
import { colors } from '../../constants/design-tokens';
import type { FeedPost } from '../home/types';
import { openResidentProfile } from '../resident-profile/resident';

interface Props {
  post: FeedPost;
  useful: boolean;
  onUseful: () => void;
  onContact: () => void;
  onImage: () => void;
}
export function PostDetailContent({ post, useful, onUseful, onContact, onImage }: Props) {
  return (
    <View className="border-b border-[#F5F5F4] bg-white pb-5">
      <View className="flex-row items-center justify-between gap-3 p-5">
        <Avatar
          initial={post.name.charAt(0)}
          size={48}
          radius={24}
          imageUrl={Image.resolveAssetSource(post.avatar).uri}
        />
        <View className="flex-1 gap-1">
          <Text
            accessibilityRole="link"
            accessibilityLabel={`Xem hồ sơ ${post.name}`}
            onPress={() => openResidentProfile(post.authorId)}
            className="font-sans-bold text-[15px] leading-[22.5px] text-[#1C1917]"
          >
            {post.name}
          </Text>
          <View className="flex-row flex-wrap items-center gap-2">
            <View className="rounded-sm bg-primary/10 px-1.5 py-0.5">
              <Text className="font-sans-black text-[9px] text-primary">
                {post.merchant ? 'CHỦ QUÁN' : 'HÀNG XÓM'}
              </Text>
            </View>
            <Text className="font-sans-medium text-[11px] text-[#A6A09B]">
              {post.id === 'hoa' ? '10 phút trước' : post.time}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1 rounded-lg border border-[#F5F5F4] bg-[#FAFAF9] px-3 py-2">
          <CustomIcon name="postDistance" size={11} />
          <Text className="font-sans-bold text-[11px] text-[#57534D]">{post.distance}</Text>
        </View>
      </View>
      <HighlightedText
        text={post.text.replace(/==/g, '')}
        className="px-5 pb-4 font-sans-medium text-[15px] leading-[24.375px] text-[#44403B]"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Phóng to ảnh bài đăng"
        onPress={onImage}
        className="mx-5 overflow-hidden rounded-[20px] border border-[#F5F5F4]"
      >
        <Image source={post.photos[0]} resizeMode="cover" style={styles.photo} />
      </Pressable>
      <View className="mx-5 mt-5 items-start gap-2 flex-row justify-between flex-wrap">
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: useful }}
          onPress={onUseful}
          className="flex-row items-center gap-2 rounded-xl border border-[#F5F5F4] bg-[#FAFAF9] px-4 py-3"
        >
          <CustomIcon name="postUseful" size={20} color={useful ? colors.primary.DEFAULT : '#57534D'} />
          <Text className="font-sans-bold text-sm" style={useful ? styles.selected : styles.label}>
            Hữu ích ({(post.id === 'hoa' ? 12 : post.likes) + (useful ? 1 : 0)})
          </Text>
        </Pressable>
        {post.merchant ? (
          <View className="flex-row flex-wrap gap-2">
            <Pressable accessibilityRole="button" accessibilityLabel="Gọi điện cho quán" onPress={onContact}>
              <LinearGradient colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]} style={styles.call}>
                <CustomIcon name="postPhone" size={20} />
                <Text className="font-sans-bold text-sm text-white">Gọi 090...</Text>
              </LinearGradient>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Liên hệ quán qua Zalo"
              onPress={onContact}
              style={styles.zalo}
            >
              <CustomIcon name="postZalo" size={20} />
              <Text className="font-sans-bold text-sm text-white">Zalo</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  photo: { width: '100%', aspectRatio: 4 / 3 },
  selected: { color: colors.primary.DEFAULT },
  label: { color: '#57534D' },
  call: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 17,
    paddingVertical: 12,
    shadowColor: colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  zalo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0068FF',
    shadowColor: '#2B7FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
