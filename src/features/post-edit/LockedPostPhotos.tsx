import { Image, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import type { FeedPost } from '../home/types';

export function LockedPostPhotos({ photos }: Pick<FeedPost, 'photos'>) {
  return (
    <View className="gap-2">
      <View className="flex-row flex-wrap items-center justify-between gap-1.5">
        <Text className="font-sans-bold text-xs tracking-[0.6px] text-[#4A4A4A]">
          HÌNH ẢNH ĐÍNH KÈM ({photos.length})
        </Text>
        <View className="flex-row items-center gap-1">
          <CustomIcon name="editLock" size={12} />
          <Text className="font-sans text-[11px] text-[#4A4A4A]">Không thể thay đổi ảnh sau khi đăng</Text>
        </View>
      </View>
      <View className="flex-row flex-wrap gap-2.5">
        {photos.map((photo, index) => (
          <View
            key={index}
            style={styles.photo}
            className="overflow-hidden rounded-[20px] border border-[#E9ECEF] opacity-85"
          >
            <Image
              source={photo}
              accessibilityLabel={`Ảnh đính kèm ${index + 1}`}
              resizeMode="cover"
              style={StyleSheet.absoluteFill}
            />
            {index === 0 ? (
              <View className="absolute bottom-1.5 left-1.5 rounded-sm bg-black/60 px-1.5 py-0.5">
                <Text className="font-sans-bold text-[9.5px] text-white">Ảnh bìa</Text>
              </View>
            ) : null}
          </View>
        ))}
        {photos.length === 0 ? (
          <Text className="font-sans text-xs text-[#4A4A4A]">Bài viết này không có ảnh đính kèm.</Text>
        ) : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({ photo: { width: '31.3%', aspectRatio: 1 } });
