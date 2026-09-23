import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Avatar } from '../../components/ui/Avatar';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { HighlightedText } from '../../components/ui/HighlightedText';
import type { FeedPost } from '../home/types';
import { usePostInteractions } from '../home/postInteractions';

export function ResidentPostCard({ post, onMenu }: { post: FeedPost; onMenu: () => void }) {
  const liked = usePostInteractions((s) => Boolean(s.liked[post.id]));
  const comments = usePostInteractions((s) => s.comments[post.id]?.length ?? 0);
  const open = () => router.push({ pathname: '/post/[id]', params: { id: post.id } });
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar initial={post.name[0]} imageSource={post.avatar} size={40} radius={20} />
        <View style={styles.copy}>
          <View style={styles.nameRow}>
            <Text className="font-sans-bold" style={styles.name}>
              {post.name}
            </Text>
            <Text className="font-sans-bold" style={styles.badge}>
              {post.badge}
            </Text>
          </View>
          <Text className="font-sans" style={styles.meta}>
            {post.time} · {post.distance}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Tùy chọn bài của ${post.name}`}
          hitSlop={10}
          onPress={onMenu}
        >
          <CustomIcon name="residentPostMore" size={16} />
        </Pressable>
      </View>
      <HighlightedText
        text={post.text}
        highlightColor="#FF416C"
        className="px-4 pb-3 font-sans text-[13.5px] leading-[22px] text-[#1A1A1A]"
      />
      {post.photos[0] && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Xem chi tiết ảnh bài đăng"
          onPress={open}
          style={styles.media}
        >
          <Image
            source={post.id === 'hoa' ? require('../../../assets/resident-profile/food.png') : post.photos[0]}
            resizeMode="cover"
            style={styles.image}
          />
          {post.id === 'hoa' && (
            <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.price}>
              <Text className="font-sans-black" style={styles.priceText}>
                35.000đ / suất
              </Text>
            </LinearGradient>
          )}
          <View style={styles.photoLabel}>
            <CustomIcon name="residentCamera" size={11} />
            <Text className="font-sans" style={styles.photoText}>
              {post.merchant ? 'Ảnh chụp tại quán' : 'Ảnh bài đăng'}
            </Text>
          </View>
        </Pressable>
      )}
      <View style={styles.footer}>
        <View style={styles.reactions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Thích bài viết"
            accessibilityState={{ selected: liked }}
            onPress={() => usePostInteractions.getState().setLiked((s) => ({ ...s, [post.id]: !s[post.id] }))}
            style={styles.row}
          >
            <CustomIcon name="residentLike" size={14} />
            <Text className="font-sans-bold" style={styles.pink}>
              {post.likes + Number(liked)}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Xem bình luận"
            onPress={open}
            style={styles.row}
          >
            <CustomIcon name="residentComment" size={14} />
            <Text style={styles.meta}>{post.comments + comments}</Text>
          </Pressable>
        </View>
        <Pressable accessibilityRole="button" onPress={open} style={styles.row}>
          <Text className="font-sans-bold" style={styles.pink}>
            Xem chi tiết
          </Text>
          <CustomIcon name="residentDetail" size={11} />
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderLeftWidth: 5,
    borderColor: '#FF416C',
    borderRadius: 19.556,
    overflow: 'hidden',
  },
  header: { padding: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  copy: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  name: { fontSize: 14, lineHeight: 21, color: '#1A1A1A' },
  badge: {
    fontSize: 10,
    lineHeight: 15,
    color: '#FF416C',
    backgroundColor: '#FF416C1A',
    paddingHorizontal: 4,
  },
  meta: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  media: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F1F3F5',
  },
  image: { width: '100%', aspectRatio: 332 / 187 },
  price: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priceText: { fontSize: 11, lineHeight: 16.5, color: '#FFF' },
  photoLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#00000099',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 2.222,
  },
  photoText: { fontSize: 10, lineHeight: 15, color: '#FFFFFFE6' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#F1F3F566',
  },
  reactions: { flexDirection: 'row', gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pink: { fontSize: 12, lineHeight: 18, color: '#FF416C' },
});
