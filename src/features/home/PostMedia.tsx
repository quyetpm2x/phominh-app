import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { colors } from '../../constants/design-tokens';
import { PHOTOS } from './data';
import type { FeedPost } from './types';
interface Props {
  post: FeedPost;
  onOpenGallery: () => void;
}
export function PostMedia({ post, onOpenGallery }: Props) {
  const { width } = useWindowDimensions();
  const mediaWidth = Math.max(220, width - 70);
  return (
    <View className="mx-4 mb-4">
      {post.merchant ? (
        <View className="overflow-hidden rounded-[20px] border border-border/80">
          <View style={{ height: mediaWidth * 0.66 }} className="flex-row gap-1">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Xem ảnh bún chả"
              onPress={onOpenGallery}
              style={styles.mainPhoto}
            >
              <Image source={PHOTOS.food} style={styles.fill} resizeMode="cover" />
              <LinearGradient
                colors={['#00000033', '#00000000', '#00000099']}
                style={StyleSheet.absoluteFillObject}
              />
              <View className="absolute left-2.5 top-2.5 flex-row items-center gap-1 rounded-lg border border-white/10 bg-black/60 px-2 py-1">
                <CustomIcon name="feedPhotoCamera" size={12} />
                <Text className="font-sans-medium text-[9px] text-white">11:20 vừa chụp</Text>
              </View>
              <LinearGradient colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]} style={styles.price}>
                <CustomIcon name="feedPrice" size={11} />
                <Text className="font-sans-black text-[11px] text-white">35.000đ / suất</Text>
              </LinearGradient>
            </Pressable>
            <View style={styles.sidePhotos}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Xem ảnh chả nướng"
                onPress={onOpenGallery}
                style={styles.flex}
              >
                <Image source={PHOTOS.grill} style={styles.fill} resizeMode="cover" />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Xem thêm ảnh của quán"
                onPress={onOpenGallery}
                style={styles.flex}
              >
                <Image source={PHOTOS.restaurant} style={styles.fill} resizeMode="cover" />
                <View className="absolute inset-0 items-center justify-center bg-black/55">
                  <Text className="font-sans-black text-lg text-white">+3</Text>
                  <Text className="font-sans-semibold text-[9px] text-white/80">ảnh nữa</Text>
                </View>
              </Pressable>
            </View>
          </View>
          <View className="flex-row flex-wrap items-center justify-between gap-1 border-t border-border bg-white px-2 py-2">
            <View className="flex-row items-center gap-1">
              <CustomIcon name="feedPhotos" size={13} />
              <Text className="font-sans text-[10px] text-[#4A4A4A]">
                Tổng cộng <Text className="font-sans-semibold">5 ảnh</Text> thực tế
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <CustomIcon name="feedVerified" size={13} />
              <Text className="font-sans-semibold text-[10px] text-[#00D492]">Đã kiểm định vị trí</Text>
            </View>
          </View>
        </View>
      ) : (
        <View className="flex-row gap-2">
          {post.photos.map((photo, i) => (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityLabel={i === 0 ? 'Xem góc ngõ chính' : 'Xem lối tránh ngách 68'}
              onPress={onOpenGallery}
              style={{ height: mediaWidth * 0.56 }}
              className="flex-1 overflow-hidden rounded-[14px]"
            >
              <Image source={photo} style={styles.fill} resizeMode="cover" />
              <View className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-1">
                <Text className="font-sans-medium text-[9px] text-white">
                  {i === 0 ? 'Góc ngõ chính' : 'Lối tránh ngách 68'}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: StyleSheet.absoluteFillObject,

  mainPhoto: { flex: 2, overflow: 'hidden' },

  sidePhotos: { flex: 1, gap: 4 },

  flex: { flex: 1 },

  price: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },
});
