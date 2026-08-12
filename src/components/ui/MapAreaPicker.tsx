import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import MapView, { Circle, type Region } from 'react-native-maps';

import { colors } from '../../constants/design-tokens';

interface MapAreaPickerProps {
  place: string;
  initialRegion: Region;
  radiusKm: number;
  pinColor?: string;
  onCenterChange: (lat: number, lng: number) => void;
}

// Bản đồ thật thay MapPlaceholder — pin CỐ ĐỊNH giữa màn hình, user kéo BẢN ĐỒ bên dưới di
// chuyển (kiểu chọn điểm đón của Grab/Uber), không dùng Marker kéo-thả vì marker trôi theo bản đồ
// khó canh giữa chính xác bằng cố định pin + đọc lại tâm bản đồ sau khi kéo xong.
export function MapAreaPicker({ place, initialRegion, radiusKm, pinColor = colors.primary.DEFAULT, onCenterChange }: MapAreaPickerProps) {
  // Vòng tròn bán kính vẽ theo toạ độ bản đồ (không phải toạ độ màn hình) nên phải tự cập nhật tâm
  // theo đúng vị trí pin hiện tại mỗi khi kéo xong — nếu giữ nguyên initialRegion, vòng tròn sẽ đứng
  // yên tại chỗ cũ trong khi pin (cố định màn hình) và bản đồ di chuyển, lệch nhau ngay sau lần kéo đầu.
  const [center, setCenter] = useState({ latitude: initialRegion.latitude, longitude: initialRegion.longitude });
  const mapRef = useRef<MapView>(null);

  const handleRegionChangeComplete = (region: Region) => {
    setCenter({ latitude: region.latitude, longitude: region.longitude });
    onCenterChange(region.latitude, region.longitude);
  };

  const recenterToMyLocation = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const pos = await Location.getCurrentPositionAsync({});
    const region: Region = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      latitudeDelta: 0.06,
      longitudeDelta: 0.06,
    };
    mapRef.current?.animateToRegion(region, 400);
    setCenter({ latitude: region.latitude, longitude: region.longitude });
    onCenterChange(region.latitude, region.longitude);
  };

  return (
    <View className="flex-1 overflow-hidden">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        onRegionChangeComplete={handleRegionChangeComplete}
        // Chấm xanh dương chuẩn hệ điều hành đánh dấu vị trí GPS THẬT, tách biệt hẳn với chấm màu
        // pinColor ở giữa màn hình (đó là điểm ĐANG CHỌN cho khu vực, di chuyển theo bản đồ khi kéo).
        showsUserLocation
        showsMyLocationButton={false}
      >
        <Circle
          center={center}
          radius={radiusKm * 1000}
          fillColor={`${pinColor}1a`}
          strokeColor={`${pinColor}99`}
          strokeWidth={1.5}
        />
      </MapView>

      <View className="absolute left-4 right-4 top-3.5 h-[46px] rounded-[13px] bg-white items-start justify-center px-4 shadow-sm">
        <Text className="text-sm text-ink" numberOfLines={1}>
          {place}
        </Text>
      </View>

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 16,
          height: 16,
          marginLeft: -8,
          marginTop: -8,
          borderRadius: 8,
          backgroundColor: pinColor,
          borderWidth: 3,
          borderColor: '#fff',
        }}
      />

      <Pressable
        onPress={recenterToMyLocation}
        className="absolute right-3.5 bottom-3.5 w-11 h-11 rounded-full bg-white items-center justify-center shadow-sm"
      >
        <Ionicons name="locate" size={20} color={colors.ink.DEFAULT} />
      </Pressable>
    </View>
  );
}
