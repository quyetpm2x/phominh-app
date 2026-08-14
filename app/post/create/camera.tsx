import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientButton } from '../../../src/components/ui/Button';
import { usePostDraftStore } from '../../../src/stores/postDraftStore';

function formatClock(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// isCam — chụp ảnh tại chỗ, không chọn được từ thư viện (mục 19 tai-lieu-chi-tiet-chuc-nang.md).
// Nén ngay sau khi chụp (mục 21) + gắn GPS thật lúc bấm chụp, không phải lúc mở màn (mục 19 DTO
// backend: "GPS THẬT lúc bấm đăng").
export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);
  const [overlayText, setOverlayText] = useState('Đang định vị…');
  const cameraRef = useRef<CameraView>(null);
  const setPhoto = usePostDraftStore((s) => s.setPhoto);

  useEffect(() => {
    if (!permission?.granted) return;
    (async () => {
      try {
        const pos = await Location.getCurrentPositionAsync({});
        setOverlayText(`${pos.coords.latitude.toFixed(4)} N, ${pos.coords.longitude.toFixed(4)} E · ${formatClock(new Date())}`);
      } catch {
        setOverlayText('Không lấy được vị trí');
      }
    })();
  }, [permission?.granted]);

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const [photo, pos] = await Promise.all([
        cameraRef.current.takePictureAsync(),
        Location.getCurrentPositionAsync({}),
      ]);
      if (!photo) return;

      // Nén/resize ngay sau khi chụp cho điều kiện 4G không ổn định (mục 2 tài liệu FE).
      const compressed = await ImageManipulator.manipulateAsync(photo.uri, [{ resize: { width: 1080 } }], {
        compress: 0.7,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      setPhoto(compressed.uri, pos.coords.latitude, pos.coords.longitude, pos.mocked ?? false);
      router.push('/post/create/review');
    } finally {
      setCapturing(false);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-ink items-center justify-center">
        <ActivityIndicator color="#fff" />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-ink items-center justify-center px-6 gap-4">
        <Text className="text-white text-center text-sm leading-[22px]">
          Cần quyền camera để chụp ảnh trực tiếp cho bài đăng.
        </Text>
        <GradientButton label="Cho phép dùng camera" onPress={() => void requestPermission()} />
        <Pressable onPress={() => router.replace('/(main)/feed')}>
          <Text className="text-white/60 text-[13.5px]">Huỷ</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-ink">
      <View className="h-11 flex-row items-center justify-between px-4">
        <Pressable onPress={() => router.replace('/(main)/feed')}>
          <Text className="text-white text-[15px]">Huỷ</Text>
        </Pressable>
        <Text className="text-white font-sans-semibold text-[13.5px]">Chụp ảnh tại chỗ</Text>
        <View className="w-9" />
      </View>

      <View className="flex-1">
        <CameraView ref={cameraRef} style={{ flex: 1 }} />
        <View
          pointerEvents="none"
          className="absolute left-4 right-4 top-4 rounded-xl bg-white/10 border border-white/20 px-3.5 py-2.5"
        >
          <Text className="text-[12.5px] leading-[19px] text-[#e9e6df]">
            Không chọn được ảnh từ thư viện. Ảnh phải chụp ngay lúc này để không ai đăng lại ảnh cũ như tin mới.
          </Text>
        </View>
        <View pointerEvents="none" className="absolute left-4 bottom-4 rounded-md bg-ink/55 px-2 py-1">
          <Text className="font-mono-medium text-[10.5px] text-[#e9e6df]">{overlayText}</Text>
        </View>
      </View>

      <View className="h-[150px] items-center justify-center">
        {capturing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Pressable
            onPress={() => void handleCapture()}
            className="w-[74px] h-[74px] rounded-full border-4 border-white bg-cream"
          />
        )}
      </View>
    </SafeAreaView>
  );
}
