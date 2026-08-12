import { router } from 'expo-router';
import { Text, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';

import { colors } from '../../constants/design-tokens';
import type { UIPost } from '../../mocks/phoMinh';

interface PostsMapViewProps {
  center: { lat: number; lng: number };
  place: string;
  posts: UIPost[];
}

// Bản đồ ghim thật cho chế độ Bản đồ ở Feed (Tầng 2 task 12) — dùng lại đúng react-native-maps đã
// chạy tốt ở MapAreaPicker.tsx (area-home/area-work), không phải bản giả lưới ô vuông nữa.
export function PostsMapView({ center, place, posts }: PostsMapViewProps) {
  const region: Region = { latitude: center.lat, longitude: center.lng, latitudeDelta: 0.02, longitudeDelta: 0.02 };
  const pinnable = posts.filter((p): p is UIPost & { lat: number; lng: number } => p.lat != null && p.lng != null);

  return (
    <View className="flex-1 overflow-hidden">
      <MapView style={{ flex: 1 }} initialRegion={region} showsUserLocation showsMyLocationButton={false}>
        {pinnable.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            pinColor={colors.primary.DEFAULT}
            title={p.author}
            description={p.text}
            onCalloutPress={() => router.push(`/post/${p.id}`)}
          />
        ))}
      </MapView>

      <View className="absolute left-4 right-4 top-3.5 h-[46px] rounded-[13px] bg-white items-start justify-center px-4 shadow-sm">
        <Text className="text-sm text-ink" numberOfLines={1}>
          {place}
        </Text>
      </View>
    </View>
  );
}
