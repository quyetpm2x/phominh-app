import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientButton } from '../../../src/components/ui/Button';
import { usePostDraftStore } from '../../../src/stores/postDraftStore';

function formatClock(ms: number): string {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// on.review — xem lại ảnh vừa chụp, không sửa/không thay ảnh trong máy được (mục 20).
export default function ReviewScreen() {
  const { photoUri, lat, lng, capturedAt, clearPhoto } = usePostDraftStore();
  const [addressText, setAddressText] = useState('Đang tìm địa chỉ…');

  useEffect(() => {
    if (lat === null || lng === null) return;
    (async () => {
      try {
        const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
        const r = results[0];
        const line = [r?.street, r?.district || r?.subregion || r?.city].filter(Boolean).join(', ');
        setAddressText(line || 'Không xác định được địa chỉ');
      } catch {
        setAddressText('Không xác định được địa chỉ');
      }
    })();
  }, [lat, lng]);

  // Vào thẳng màn này (không qua camera trước), hoặc draft vừa bị reset() sau khi đăng bài thành
  // công ở confirm.tsx — màn này vẫn còn nằm trong stack điều hướng phía sau lúc đó. Dùng
  // useFocusEffect (chỉ chạy khi màn THỰC SỰ đang hiển thị), không phải useEffect thường — useEffect
  // thường chạy bất cứ khi nào photoUri đổi dù màn đang bị che phía sau, gây điều hướng lung tung
  // giữa lúc confirm.tsx cũng đang tự điều hướng sang Feed (2 lệnh router.replace đua nhau, màn hình
  // bị flash qua camera 1 nhịp trước khi tới đúng Feed).
  useFocusEffect(
    useCallback(() => {
      if (!photoUri) {
        router.replace('/post/create/camera');
      }
    }, [photoUri]),
  );

  if (!photoUri) {
    return null;
  }

  const onRetake = () => {
    clearPhoto();
    router.replace('/post/create/camera');
  };

  return (
    <SafeAreaView className="flex-1 bg-ink">
      <View className="h-[46px] flex-row items-center justify-between px-4">
        <Pressable onPress={onRetake}>
          <Text className="text-white text-[14.5px]">Chụp lại</Text>
        </Pressable>
        <Text className="text-white font-sans-semibold text-[13.5px]">Ảnh vừa chụp</Text>
        <View className="w-14" />
      </View>

      <Image
        source={{ uri: photoUri }}
        style={{ flex: 1, margin: 12, borderRadius: 16 }}
        resizeMode="cover"
      />

      <View className="px-4 -mt-2 mb-1">
        <Text className="text-center text-[11.5px] text-white/60">
          {capturedAt ? `ảnh chụp lúc ${formatClock(capturedAt)} · ` : ''}
          {addressText}
        </Text>
      </View>

      <View className="px-4 pt-2 pb-6">
        <View className="rounded-xl bg-white/10 border border-white/[.18] px-3.5 py-2.5">
          <Text className="text-[12.5px] leading-[19px] text-[#e9e6df]">
            Ảnh này gắn cứng với thời điểm và toạ độ vừa chụp. Không sửa được, không thay bằng ảnh trong máy.
          </Text>
        </View>
        <View className="mt-3">
          <GradientButton label="Dùng ảnh này" onPress={() => router.push('/post/create/caption')} />
        </View>
      </View>
    </SafeAreaView>
  );
}
