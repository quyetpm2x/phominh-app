import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';

export function StatusPhotoActions({
  onCamera,
  onLibrary,
  busy,
}: {
  onCamera: () => void;
  onLibrary: () => void;
  busy: boolean;
}) {
  return (
    <>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={onCamera}
          style={[styles.action, styles.camera]}
        >
          <LinearGradient
            pointerEvents="none"
            colors={['#FF4B2B1A', '#FF416C1A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fill}
          />
          <CustomIcon name="statusCamera" size={24} />
          <Text className="font-sans-black" style={styles.cameraTitle}>
            Chụp tại chỗ
          </Text>
          <Text className="font-sans-medium" style={styles.reward}>
            +15đ uy tín
          </Text>
        </Pressable>
        <Pressable accessibilityRole="button" disabled={busy} onPress={onLibrary} style={styles.action}>
          <CustomIcon name="statusGallery" size={24} />
          <Text className="font-sans-bold" style={styles.title}>
            Chọn từ thư viện
          </Text>
          <Text className="font-sans-medium" style={styles.subtitle}>
            {busy ? 'Đang chọn ảnh…' : 'Tải ảnh có sẵn'}
          </Text>
        </Pressable>
      </View>
      <Text className="font-sans" style={styles.hint}>
        Chụp ảnh trực tiếp tại hiện trường để được cộng điểm uy tín cao hơn.
      </Text>
    </>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  action: {
    flex: 1,
    borderRadius: 19.556,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: { borderColor: '#FF416C66' },
  fill: { ...StyleSheet.absoluteFill, borderRadius: 17.556 },
  title: { fontSize: 13, lineHeight: 19.5, color: '#1A1A1A', textAlign: 'center' },
  cameraTitle: { fontSize: 13, lineHeight: 19.5, color: '#FF416C' },
  subtitle: { fontSize: 10, lineHeight: 15, color: '#4A4A4A' },
  reward: { fontSize: 10, lineHeight: 15, color: '#FF416CCC' },
  hint: { fontSize: 11.5, lineHeight: 18.688, textAlign: 'center', color: '#4A4A4A' },
});
