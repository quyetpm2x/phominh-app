import { CameraView } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../src/components/ui/Button';
import {
  CaptureControls,
  CaptureIconButton,
  type CaptureCategory,
} from '../src/features/capture/CaptureControls';
import { CaptureLocation } from '../src/features/capture/CaptureLocation';
import { useCaptureCamera } from '../src/features/capture/useCaptureCamera';
import { CapturePhotoReview } from '../src/features/capture/CapturePhotoReview';
import type { CapturePlace } from '../src/features/capture/capturePhoto';
import { useNewPostDraft } from '../src/features/new-post/draft';

export default function CaptureScreen() {
  const { origin } = useLocalSearchParams<{ origin?: string }>();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const [place, setPlace] = useState<CapturePlace | null>(null);
  const camera = useCaptureCamera(cameraRef, place);
  const [category, setCategory] = useState<CaptureCategory>('TIN TỨC XÓM');
  const headerTop = Math.max(48, insets.top);
  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/home');
  };
  if (camera.photo)
    return (
      <CapturePhotoReview
        photo={camera.photo}
        onRetake={camera.retake}
        onContinue={() => {
          if (!camera.photo) return;
          if (origin === 'status') {
            const state = useNewPostDraft.getState();
            state.update({
              photos: [
                camera.photo,
                ...state.draft.photos.filter((photo) => photo.uri !== camera.photo?.uri),
              ].slice(0, 6),
              category,
            });
          } else useNewPostDraft.getState().start(camera.photo, category);
          router.push('/new-post');
        }}
      />
    );
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      {camera.active && (
        <CameraView
          key={camera.facing}
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={camera.facing}
          flash={camera.flash ? 'on' : 'off'}
          mode="picture"
          onCameraReady={() => camera.setReady(true)}
          onMountError={() => camera.setError('Không thể mở camera trên thiết bị này.')}
        />
      )}
      <LinearGradient
        pointerEvents="none"
        colors={['#00000099', 'transparent', '#000000CC']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.header, { paddingTop: headerTop }]}>
        <CaptureIconButton icon="captureClose" label="Đóng camera" round onPress={close} />
        {!camera.photo && (
          <CaptureIconButton
            icon="captureFlash"
            label={camera.flash ? 'Tắt flash' : 'Bật flash'}
            selected={camera.flash}
            disabled={!camera.ready || camera.facing === 'front'}
            round
            onPress={() => camera.setFlash(!camera.flash)}
          />
        )}
      </View>
      <CaptureLocation top={headerTop + 46} onLocation={setPlace} />
      {!camera.photo && !camera.active && (
        <View style={styles.permission}>
          {camera.available === null || !camera.permission ? (
            <ActivityIndicator color="#FF416C" />
          ) : (
            <>
              <Text className="font-sans-bold" style={styles.permissionTitle}>
                {camera.error ??
                  (camera.available ? 'Cho phép truy cập camera' : 'Thiết bị không có camera khả dụng')}
              </Text>
              <Text className="font-sans" style={styles.permissionText}>
                {camera.available
                  ? 'Phố Mình cần camera để chụp ảnh đăng bài trực tiếp.'
                  : 'Bạn có thể chọn ảnh từ thư viện hoặc chụp trên điện thoại thật.'}
              </Text>
              {!camera.permission.granted && camera.available && (
                <Button
                  label={camera.permission.canAskAgain ? 'Cho phép camera' : 'Mở Cài đặt'}
                  onPress={() => void camera.grantAccess()}
                />
              )}
              {camera.error && camera.permission.granted && (
                <Button label="Thử lại camera" onPress={() => camera.setError(null)} />
              )}
            </>
          )}
        </View>
      )}
      <CaptureControls
        category={category}
        onCategory={setCategory}
        onCapture={() => void camera.takePhoto()}
        onGallery={() => void camera.choosePhoto()}
        onFlip={camera.flip}
        busy={camera.busy}
        ready={camera.ready && camera.active}
        bottom={insets.bottom}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  header: { paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between' },
  permission: { position: 'absolute', top: '28%', left: 24, right: 24, gap: 16 },
  permissionTitle: { fontSize: 18, lineHeight: 26, textAlign: 'center', color: '#FFF' },
  permissionText: { fontSize: 13, lineHeight: 20, textAlign: 'center', color: '#FFFFFFB3' },
});
