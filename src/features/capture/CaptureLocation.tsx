import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import type { CapturePlace } from './capturePhoto';

export function CaptureLocation({
  top,
  onLocation,
  variant = 'camera',
}: {
  top: number;
  onLocation: (place: CapturePlace | null) => void;
  variant?: 'camera' | 'status';
}) {
  const [label, setLabel] = useState('Bật vị trí để xác định nơi chụp');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const running = useRef(false);
  const mounted = useRef(false);
  const locate = useCallback(
    async (request: boolean) => {
      if (running.current) return;
      running.current = true;
      try {
        let permission = await Location.getForegroundPermissionsAsync();
        if (!permission.granted && request) {
          if (!permission.canAskAgain) {
            await Linking.openSettings();
            return;
          }
          permission = await Location.requestForegroundPermissionsAsync();
        }
        if (!permission.granted) return;
        if (mounted.current) setLabel('Đang xác định vị trí…');
        const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const [address] = await Location.reverseGeocodeAsync(position.coords);
        if (!mounted.current) return;
        setLabel(
          [address?.streetNumber, address?.street, address?.district ?? address?.city]
            .filter(Boolean)
            .join(' ') || 'Đã xác định vị trí chụp',
        );
        setAccuracy(position.coords.accuracy);
        onLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          measuredAt: position.timestamp,
          street: [address?.streetNumber, address?.street].filter(Boolean).join(' ') || 'Vị trí chụp ảnh',
          area: [address?.district, address?.city].filter(Boolean).join(', '),
        });
      } catch {
        if (mounted.current) {
          setLabel('Chạm để thử lại vị trí');
          setAccuracy(null);
          onLocation(null);
        }
      } finally {
        running.current = false;
      }
    },
    [onLocation],
  );
  useEffect(() => {
    mounted.current = true;
    void Promise.resolve().then(() => {
      if (mounted.current) return locate(false);
    });
    return () => {
      mounted.current = false;
    };
  }, [locate]);
  if (variant === 'status')
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}. Cập nhật vị trí`}
        onPress={() => void locate(true)}
        style={styles.statusCard}
      >
        <View style={styles.statusIcon}>
          <CustomIcon name="statusLocation" size={16} />
        </View>
        <View style={styles.statusCopy}>
          <Text numberOfLines={1} className="font-sans-bold" style={styles.statusTitle}>
            {label}
          </Text>
          <Text className="font-sans" style={styles.statusSubtitle}>
            GPS hiện tại · Định vị tự động
          </Text>
        </View>
        {accuracy !== null && (
          <Text className="font-sans-bold" style={styles.statusAccuracy}>
            ~{Math.round(accuracy)}m
          </Text>
        )}
      </Pressable>
    );
  return (
    <View pointerEvents="box-none" style={[styles.container, { top }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}. Cập nhật vị trí`}
        onPress={() => void locate(true)}
        style={styles.pill}
      >
        <BlurView pointerEvents="none" intensity={12} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[styles.dot, accuracy === null && styles.inactive]} />
        <CustomIcon name="captureLocation" size={14} />
        <Text numberOfLines={1} className="font-sans-bold" style={styles.label}>
          {label}
        </Text>
        {accuracy !== null && (
          <Text className="font-sans-semibold" style={styles.accuracy}>
            ~{Math.round(accuracy)}m
          </Text>
        )}
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18.333,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#F1F3F566',
    padding: 14,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 8.889,
    backgroundColor: '#FF416C1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCopy: { flex: 1 },
  statusTitle: { fontSize: 13, lineHeight: 19.5, color: '#1A1A1A' },
  statusSubtitle: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  statusAccuracy: {
    fontSize: 10.5,
    lineHeight: 15.75,
    color: '#009966',
    backgroundColor: '#00BC7D1A',
    borderRadius: 5.486,
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  container: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  pill: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#FFFFFF33',
    backgroundColor: '#000000A6',
    maxWidth: '100%',
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00D492', opacity: 0.55 },
  inactive: { backgroundColor: '#FFFFFF80' },
  label: { flexShrink: 1, fontSize: 12, lineHeight: 16, color: '#FFF' },
  accuracy: {
    fontSize: 11,
    lineHeight: 16.5,
    color: '#00D492',
    borderRadius: 5.667,
    backgroundColor: '#00BC7D33',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
});
