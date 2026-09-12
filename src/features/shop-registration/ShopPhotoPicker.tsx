import { Ionicons } from '@expo/vector-icons';
import type { ImagePickerAsset } from 'expo-image-picker';
import { Image, Pressable, Text, View } from 'react-native';
import { colors } from '../../constants/design-tokens';

export function ShopPhotoPicker({
  photos,
  onAdd,
  onRemove,
  busy,
}: {
  photos: ImagePickerAsset[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  busy: boolean;
}) {
  return (
    <View className="gap-2">
      <Text className="font-sans-bold text-[13px] text-ink">Ảnh đại diện hoặc biển hiệu quán</Text>
      {photos.length > 0 ? (
        <View className="flex-row flex-wrap gap-2">
          {photos.map((photo, index) => (
            <View key={`${photo.uri}-${index}`}>
              <Image
                source={{ uri: photo.uri }}
                className="h-20 w-20 rounded-xl"
                accessibilityLabel={`Ảnh quán ${index + 1}`}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Xoá ảnh ${index + 1}`}
                onPress={() => onRemove(index)}
                className="absolute right-0 top-0 rounded-full bg-white p-1"
                hitSlop={8}
              >
                <Ionicons name="close" size={16} color={colors.ink.DEFAULT} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
      {photos.length < 5 ? (
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={onAdd}
          className="items-center gap-2 rounded-[20px] border-2 border-[#E9ECEF] bg-white px-3 py-4"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Ionicons name="camera-outline" size={22} color={colors.primary.DEFAULT} />
          </View>
          <Text className="text-center font-sans-bold text-[13px] text-ink">
            {busy ? 'Đang chọn ảnh...' : 'Tải ảnh biển hiệu / không gian quán'}
          </Text>
          <Text className="font-sans text-xs text-muted">Tối đa 5 ảnh, dung lượng dưới 5MB</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
