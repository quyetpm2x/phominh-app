import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { BackHandler, Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { CaptureIconButton } from './CaptureControls';
import type { CapturedPhoto } from './capturePhoto';
import { Button } from '../../components/ui/Button';

export function CapturePhotoReview({
  photo,
  onRetake,
  onContinue,
}: {
  photo: CapturedPhoto;
  onRetake: () => void;
  onContinue: () => void;
}) {
  const insets = useSafeAreaInsets();
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        onRetake();
        return true;
      });
      return () => subscription.remove();
    }, [onRetake]),
  );
  const time =
    photo.capturedAt === null
      ? null
      : new Date(photo.capturedAt).toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <Image
        source={{ uri: photo.uri }}
        accessibilityLabel="Xem lại ảnh"
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        pointerEvents="none"
        colors={['#00000099', 'transparent', '#000000D9']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.badges, { top: Math.max(80, insets.top + 21) }]}>
        {photo.place && (
          <View style={styles.locationShadow}>
            <View style={styles.location}>
              <BlurView pointerEvents="none" intensity={12} tint="dark" style={StyleSheet.absoluteFill} />
              <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.pin}>
                <CustomIcon name="reviewLocation" size={12} />
              </LinearGradient>
              <View style={styles.address}>
                <View style={styles.streetRow}>
                  <Text numberOfLines={1} className="font-sans-black" style={styles.street}>
                    {photo.place.street}
                  </Text>
                  <View style={styles.dot} />
                </View>
                <Text numberOfLines={1} className="font-sans-medium" style={styles.area}>
                  {photo.place.area || 'Đã ghi nhận tọa độ'}
                </Text>
              </View>
              {photo.place.accuracy !== null && (
                <>
                  <View style={styles.divider} />
                  <Text className="font-sans-bold" style={styles.accuracy}>
                    ~{Math.round(photo.place.accuracy)}m
                  </Text>
                </>
              )}
            </View>
          </View>
        )}
        <View style={styles.verification}>
          <BlurView pointerEvents="none" intensity={4} tint="dark" style={StyleSheet.absoluteFill} />
          {photo.place && <CustomIcon name="reviewVerified" size={12} />}
          <Text className="font-sans-medium" style={styles.verificationText}>
            {photo.source === 'library'
              ? 'Ảnh từ thư viện · Chưa xác thực tại chỗ'
              : photo.place
                ? `Đã gắn toạ độ & thời gian thực (${time})`
                : `Ảnh chụp lúc ${time} · Chưa có tọa độ`}
          </Text>
        </View>
      </View>
      <View style={[styles.back, { top: Math.max(24, insets.top) }]}>
        <CaptureIconButton icon="captureClose" label="Quay lại chụp ảnh" round onPress={onRetake} />
      </View>
      <View style={[styles.footer, { paddingBottom: Math.max(24, insets.bottom + 14) }]}>
        <Button
          label="Đăng ảnh"
          onPress={onContinue}
          style={styles.continue}
          leadingIcon={
            <LinearGradient pointerEvents="none" colors={['#FF416C', '#FF4B2B']} style={styles.buttonFill} />
          }
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  badges: { position: 'absolute', left: 16, right: 16, alignItems: 'center', gap: 6 },
  locationShadow: {
    borderRadius: 12.639,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 25 },
    maxWidth: '100%',
  },
  location: {
    overflow: 'hidden',
    minHeight: 45.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 7,
    gap: 8,
    borderRadius: 12.639,
    borderWidth: 1,
    borderColor: '#FFFFFF26',
    backgroundColor: '#000000B3',
  },
  pin: { width: 24, height: 24, borderRadius: 6.667, justifyContent: 'center', alignItems: 'center' },
  address: { width: 124, flexShrink: 1 },
  streetRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  street: { flexShrink: 1, fontSize: 12, lineHeight: 15, color: '#FFF' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00D492' },
  area: { fontSize: 10, lineHeight: 12.5, color: '#FFFFFFB3' },
  divider: { width: 1, height: 16, backgroundColor: '#FFFFFF33', marginHorizontal: 1 },
  accuracy: {
    minWidth: 42,
    textAlign: 'center',
    paddingHorizontal: 5,
    fontSize: 10,
    lineHeight: 15,
    color: '#00D492',
    backgroundColor: '#00BC7D33',
    borderRadius: 4.167,
    overflow: 'hidden',
  },
  verification: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    backgroundColor: '#00000066',
  },
  verificationText: { fontSize: 9.5, lineHeight: 14.25, color: '#FFFFFFCC' },
  back: { position: 'absolute', left: 20 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24 },
  continue: { borderRadius: 14.583 },
  buttonFill: { ...StyleSheet.absoluteFill, borderRadius: 14.583 },
});
