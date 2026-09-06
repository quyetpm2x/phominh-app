import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, type Region } from 'react-native-maps';

import { colors } from '../../constants/design-tokens';
import { CustomIcon } from './CustomIcon';

interface MapAreaPickerProps {
  place: string;
  initialRegion: Region;
  radiusKm: number;
  pinColor?: string;
  variant?: 'default' | 'home';
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
}: MapAreaPickerProps) {
  const [center, setCenter] = useState({
    latitude: initialRegion.latitude,
    longitude: initialRegion.longitude,
  });
  const [locating, setLocating] = useState(false);
  const locatingRef = useRef(false);
  const mapRef = useRef<MapView>(null);
  const home = variant === 'home';

  const handleRegionChangeComplete = (region: Region) => {
    setCenter({ latitude: region.latitude, longitude: region.longitude });
    onCenterChange(region.latitude, region.longitude);
  };

  const recenterToMyLocation = async () => {
    if (locatingRef.current) return;
    locatingRef.current = true;
    setLocating(true);
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
      {home ? (
        <>
          <View
            pointerEvents="none"
            className="absolute top-6 self-center overflow-hidden rounded-full border border-white/10"
          >
            <BlurView
              intensity={30}
              tint="dark"
              experimentalBlurMethod="dimezisBlurView"
              style={StyleSheet.absoluteFillObject}
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
        style={home ? styles.homeLocate : styles.locate}
      >
        {locating ? (
          <ActivityIndicator color={pinColor} />
        ) : (
          <Ionicons name="locate" size={home ? 24 : 20} color={home ? pinColor : colors.ink.DEFAULT} />
        )}
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  map: { flex: 1 },
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
