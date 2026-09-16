import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, type Region } from 'react-native-maps';

import { colors } from '../../constants/design-tokens';
import { CustomIcon, type CustomIconProps } from './CustomIcon';

interface MapAreaPickerProps {
  place: string;
  initialRegion: Region;
  radiusKm: number;
  pinColor?: string;
  variant?: 'default' | 'home' | 'settings';
  pinIcon?: CustomIconProps['name'];
  targetCenter?: { latitude: number; longitude: number };
  onLocateStart?: () => void;
  onLocateEnd?: () => void;
  pinLabel?: string;
  onCenterChange: (lat: number, lng: number) => void;
}

// Keep the pin fixed while the map moves beneath it; the selected point is the map center.
export function MapAreaPicker({
  place,
  initialRegion,
  radiusKm,
  pinColor = colors.primary.DEFAULT,
  variant = 'default',
  pinLabel = 'NHÀ Ở ĐÂY?',
  onCenterChange,
  pinIcon = 'editAreaHome',
  targetCenter,
  onLocateStart,
  onLocateEnd,
}: MapAreaPickerProps) {
  const [center, setCenter] = useState({
    latitude: initialRegion.latitude,
    longitude: initialRegion.longitude,
  });
  const [locating, setLocating] = useState(false);
  const locatingRef = useRef(false);
  const mapRef = useRef<MapView>(null);
  const home = variant === 'home';
  const settings = variant === 'settings';
  useEffect(() => {
    if (!targetCenter) return;
    mapRef.current?.animateToRegion({ ...initialRegion, ...targetCenter }, 300);
    // initialRegion only provides the initial zoom.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetCenter?.latitude, targetCenter?.longitude]);

  const handleRegionChangeComplete = (region: Region) => {
    setCenter({ latitude: region.latitude, longitude: region.longitude });
    onCenterChange(region.latitude, region.longitude);
  };

  const recenterToMyLocation = async () => {
    if (locatingRef.current) return;
    locatingRef.current = true;
    setLocating(true);
    onLocateStart?.();
    try {
      let permission = await Location.getForegroundPermissionsAsync();
      if (!permission.granted && permission.canAskAgain)
        permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Chưa có quyền vị trí',
          'Bạn vẫn có thể kéo bản đồ để chọn vị trí hoặc bật quyền vị trí trong Cài đặt.',
          [
            { text: 'Để sau', style: 'cancel' },
            {
              text: 'Mở Cài đặt',
              onPress: () => {
                void Linking.openSettings().catch(() =>
                  Alert.alert('Không thể mở Cài đặt', 'Vui lòng mở Cài đặt của thiết bị.'),
                );
              },
            },
          ],
        );
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const region = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        latitudeDelta: initialRegion.latitudeDelta,
        longitudeDelta: initialRegion.longitudeDelta,
      };
      mapRef.current?.animateToRegion(region, 400);
      handleRegionChangeComplete(region);
    } catch {
      Alert.alert('Không lấy được vị trí', 'Vui lòng kiểm tra GPS hoặc kéo bản đồ để chọn vị trí.');
    } finally {
      locatingRef.current = false;
      setLocating(false);
      onLocateEnd?.();
    }
  };

  return (
    <View className="flex-1 overflow-hidden">
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation
        showsMyLocationButton={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        <Circle
          center={center}
          radius={radiusKm * 1000}
          fillColor={`${pinColor}1a`}
          strokeColor={`${pinColor}99`}
          strokeWidth={1.5}
        />
      </MapView>
      {settings ? (
        <>
          <View pointerEvents="none" style={styles.radiusBadge}>
            <View style={styles.greenDot} />
            <Text className="font-sans-bold" style={styles.radiusText}>
              Bán kính: {radiusKm.toFixed(1)} km
            </Text>
          </View>
          <View pointerEvents="none" style={[styles.settingsHalo, { backgroundColor: `${pinColor}40` }]}>
            <View style={[styles.settingsPin, { backgroundColor: pinColor }]}>
              <CustomIcon name={pinIcon} size={16} color="#FFF" />
            </View>
          </View>
        </>
      ) : home ? (
        <>
          <View
            pointerEvents="none"
            className="absolute top-6 self-center overflow-hidden rounded-full border border-white/10"
          >
            <BlurView
              intensity={30}
              tint="dark"
              experimentalBlurMethod="dimezisBlurView"
              style={StyleSheet.absoluteFill}
            />
            <View className="bg-[#1C1917]/80 rounded-full px-5 py-3">
              <Text className="font-sans-bold text-[11px] leading-[16.5px] text-white">
                KÉO BẢN ĐỒ ĐỂ DỊCH{'\n'}CHUYỂN GHIM
              </Text>
            </View>
          </View>
          <View pointerEvents="none" style={styles.homePin}>
            <View
              style={styles.pinLabel}
              className="rounded-[10px] border border-white bg-white/95 px-4 py-2 shadow-lg"
            >
              <Text numberOfLines={1} className="font-sans-black text-[11px] text-ink">
                {pinLabel}
              </Text>
            </View>
            <CustomIcon name="homePin" size={60} color={pinColor} />
          </View>
        </>
      ) : (
        <>
          <View className="absolute left-4 right-4 top-3.5 h-[46px] rounded-[13px] bg-white justify-center px-4 shadow-sm">
            <Text className="text-sm text-ink" numberOfLines={1}>
              {place}
            </Text>
          </View>
          <View pointerEvents="none" style={[styles.dot, { backgroundColor: pinColor }]} />
        </>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Về vị trí hiện tại"
        accessibilityState={{ disabled: locating, busy: locating }}
        disabled={locating}
        onPress={recenterToMyLocation}
        style={settings ? styles.settingsLocate : home ? styles.homeLocate : styles.locate}
      >
        {locating ? (
          <ActivityIndicator color={pinColor} />
        ) : settings ? (
          <>
            <CustomIcon name="editAreaLocate" size={14} color={pinColor} />
            <Text className="font-sans-bold" style={styles.locateText}>
              Vị trí hiện tại
            </Text>
          </>
        ) : (
          <Ionicons name="locate" size={home ? 24 : 20} color={home ? pinColor : colors.ink.DEFAULT} />
        )}
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  map: { flex: 1 },
  radiusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEFB3',
    backgroundColor: '#F8F9FAE6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 7.5,
  },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00BC7D' },
  radiusText: { fontSize: 11, lineHeight: 16.5, color: '#1A1A1A' },
  settingsHalo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsPin: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  settingsLocate: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8F9FAE6',
    borderWidth: 1,
    borderColor: '#E9ECEFB3',
    borderRadius: 8.333,
  },
  locateText: { fontSize: 12, lineHeight: 16, color: '#1A1A1A' },
  // The SVG's pin tip is aligned with the actual selected map coordinate.
  homePin: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 180,
    height: 60,
    marginLeft: -90,
    marginTop: -56.25,
    alignItems: 'center',
  },
  pinLabel: { position: 'absolute', bottom: 68 },
  dot: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 16,
    height: 16,
    marginLeft: -8,
    marginTop: -8,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#fff',
  },
  locate: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeLocate: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
});
