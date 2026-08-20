import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage } from '../../src/api/client';
import { uploadPostImage } from '../../src/api/endpoints/posts';
import { useAddMenuPhoto, useDeleteMenuPhoto, useMenuPhotos } from '../../src/hooks/useMerchant';

// Quản lý ảnh Menu (tai-lieu-chuc-nang.md #42) — tải từ THƯ VIỆN (khác ảnh bài đăng phải chụp trực
// tiếp), tách khỏi feed real-time, không tính vào xếp hạng độ mới. Trước đây backend có sẵn route
// thêm ảnh nhưng KHÔNG màn hình mobile nào gọi tới.
export default function MenuPhotosScreen() {
  const { data: photos } = useMenuPhotos();
  const addPhoto = useAddMenuPhoto();
  const deletePhoto = useDeleteMenuPhoto();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (result.canceled || !result.assets[0]) return;

    setUploading(true);
    setError(null);
    try {
      const url = await uploadPostImage(result.assets[0].uri);
      await addPhoto.mutateAsync({ url });
    } catch (err) {
      setError(await extractErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Ảnh Menu</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        {error ? <Text className="mb-2.5 text-[12.5px] text-danger-text">{error}</Text> : null}

        <Pressable
          onPress={() => void onPick()}
          disabled={uploading}
          className="h-11 rounded-xl border border-dashed border-border bg-white items-center justify-center flex-row gap-2"
        >
          {uploading ? <ActivityIndicator size="small" /> : null}
          <Text className="font-sans-semibold text-sm text-ink">
            {uploading ? 'Đang tải lên…' : '+ Thêm ảnh từ thư viện'}
          </Text>
        </Pressable>

        <View className="mt-3.5 flex-row flex-wrap gap-2.5">
          {photos?.map((p) => (
            <View key={p.id} className="w-[31%] aspect-square rounded-xl overflow-hidden border border-border">
              <Image source={{ uri: p.url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              <Pressable
                onPress={() => void deletePhoto.mutateAsync(p.id)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 items-center justify-center"
              >
                <Text className="text-white text-xs">✕</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {photos?.length === 0 ? (
          <Text className="mt-4 text-center text-sm text-muted">Chưa có ảnh menu nào.</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
