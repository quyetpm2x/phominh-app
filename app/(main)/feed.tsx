import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getFixedAreas, type FixedArea } from '../../src/api/client';
import type { NearbyPost } from '../../src/api/endpoints/posts';
import { colors } from '../../src/constants/design-tokens';
import { CreateSheet } from '../../src/components/feed/CreateSheet';
import { FeedBody } from '../../src/components/feed/FeedBody';
import { UnderlineTabs, type UnderlineTabOption } from '../../src/components/ui/UnderlineTabs';
import { usePosts } from '../../src/hooks/usePosts';
import { formatDistance } from '../../src/utils/formatDistance';
import { formatExpiry, formatTimeAgo } from '../../src/lib/format';
import { filterByPostType, sortNearbyPosts } from '../../src/lib/postListFilters';
import { type AreaKey, type PostTag, type UIPost } from '../../src/mocks/phoMinh';
import { useFilterStore } from '../../src/stores/filterStore';
import { usePendingPostStore } from '../../src/stores/pendingPostStore';

const AREA_LABELS: Record<AreaKey, string> = { home: 'Nhà', work: 'Chỗ làm', nearby: 'Quanh đây' };
const NEARBY_RADIUS_KM = 1.5;
const POST_TYPE_TAG: Record<NearbyPost['postType'], { label: PostTag; color: UIPost['tagColor'] }> = {
  life: { label: 'Đời sống', color: 'gray' },
  merchant: { label: 'Cửa hàng', color: 'gold' },
  emergency: { label: 'Khẩn cấp', color: 'red' },
};

function toUIPost(p: NearbyPost, area: AreaKey): UIPost {
  return {
    id: p.id,
    area,
    variant: 'full',
    author: p.authorDisplayName,
    initial: p.authorDisplayName.charAt(0).toUpperCase(),
    avatarColor: colors.primary.DEFAULT,
    badge: p.authorBadge,
    tag: POST_TYPE_TAG[p.postType].label,
    tagColor: POST_TYPE_TAG[p.postType].color,
    text: p.content,
    photos: p.imageUrl ? 1 : 0,
    imageUrl: p.imageUrl,
    distance: formatDistance(p.distanceMeters),
    timeAgo: formatTimeAgo(p.createdAt),
    createdAt: p.createdAt,
    expiresAt: p.expiresAt,
    lat: p.lat,
    lng: p.lng,
    votes: p.voteCount,
    comments: p.commentCount,
    expiry: formatExpiry(p.expiresAt),
    mediaNote: p.imageUrl ? 'ảnh chụp tại chỗ' : '',
  };
}

// isFeed — header + pill khu vực + chế độ Bản đồ/Danh sách, đúng theo Phố Mình.dc.html. Data thật:
// Nhà/Chỗ làm lấy toạ độ từ FixedArea đã lưu (area-home.tsx/area-work.tsx), Quanh đây lấy GPS sống.
export default function FeedScreen() {
  const { justPosted } = useLocalSearchParams<{ justPosted?: string }>();
  const [area, setArea] = useState<AreaKey>('home');
  const [mapOn, setMapOn] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [favToast, setFavToast] = useState(false);
  const [postedToast, setPostedToast] = useState(!!justPosted);

  const pendingPosts = usePendingPostStore((s) => s.pendingPosts);
  const [fixedAreas, setFixedAreas] = useState<FixedArea[] | null>(null);
  const [nearbyPoint, setNearbyPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyPlace, setNearbyPlace] = useState('Đang định vị…');

  useEffect(() => {
    void getFixedAreas()
      .then(setFixedAreas)
      .catch(() => setFixedAreas([]));
  }, []);

  useEffect(() => {
    if (area !== 'nearby' || nearbyPoint) return;
    (async () => {
      try {
        const pos = await Location.getCurrentPositionAsync({});
        const point = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setNearbyPoint(point);
        const results = await Location.reverseGeocodeAsync({ latitude: point.lat, longitude: point.lng });
        const r = results[0];
        setNearbyPlace([r?.street, r?.district || r?.subregion || r?.city].filter(Boolean).join(', ') || 'Quanh đây');
      } catch {
        setNearbyPlace('Không lấy được vị trí');
      }
    })();
  }, [area, nearbyPoint]);

  const homeArea = fixedAreas?.find((a) => a.label === 'home');
  const workArea = fixedAreas?.find((a) => a.label === 'work');

  const filterStore = useFilterStore();

  const active = useMemo(() => {
    const override = filterStore.radiusOverrideKm;
    if (area === 'home' && homeArea) {
      return { lat: homeArea.lat, lng: homeArea.lng, radiusKm: override ?? homeArea.radiusKm, place: homeArea.addressText };
    }
    if (area === 'work' && workArea) {
      return { lat: workArea.lat, lng: workArea.lng, radiusKm: override ?? workArea.radiusKm, place: workArea.addressText };
    }
    if (area === 'nearby' && nearbyPoint) {
      return { lat: nearbyPoint.lat, lng: nearbyPoint.lng, radiusKm: override ?? NEARBY_RADIUS_KM, place: nearbyPlace };
    }
    return null;
  }, [area, homeArea, workArea, nearbyPoint, nearbyPlace, filterStore.radiusOverrideKm]);

  const { data: nearbyPosts, isLoading } = usePosts(
    active
      ? { lat: active.lat, lng: active.lng, radiusKm: active.radiusKm }
      : { lat: Number.NaN, lng: Number.NaN, radiusKm: 0 },
  );

  const areaPosts = useMemo(() => {
    const filtered = filterByPostType(nearbyPosts ?? [], filterStore.postTypes);
    const sorted = sortNearbyPosts(filtered, filterStore.sortMode);
    return sorted.map((p) => toUIPost(p, area));
  }, [nearbyPosts, area, filterStore.postTypes, filterStore.sortMode]);

  const AREA_OPTIONS: UnderlineTabOption<AreaKey>[] = (['home', 'work', 'nearby'] as AreaKey[]).map((key) => ({
    key,
    label: AREA_LABELS[key],
  }));

  const missingAreaMessage =
    area === 'work' && fixedAreas && !workArea ? 'Chưa đặt khu vực "Chỗ làm" — vào Hồ sơ để đặt.' : null;

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <View className="px-5 pt-0.5 bg-cream border-b border-border">
        <View className="h-10 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="w-[26px] h-[26px] rounded-[9px] bg-primary items-center justify-center">
              <Text className="font-sans-bold text-white text-sm">P</Text>
            </View>
            <View>
              <Text className="font-sans-bold text-sm text-ink leading-4">Phố Mình</Text>
              <View className="flex-row items-center gap-1.5">
                <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                <Text className="text-[11.5px] text-muted" numberOfLines={1}>
                  {active ? `${active.place} · ${active.radiusKm} km` : '...'}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={() => router.push('/messages')}
              className="w-[30px] h-[30px] rounded-[9px] border border-strong bg-white items-center justify-center"
            >
              <Ionicons name="chatbubble-outline" size={15} color={colors.ink.DEFAULT} />
            </Pressable>
            <Pressable
              onPress={() => setMapOn((v) => !v)}
              className="h-[30px] rounded-[9px] border border-strong bg-white px-2.5 items-center justify-center"
            >
              <Text className="font-sans-semibold text-xs text-ink">{mapOn ? 'Danh sách' : 'Bản đồ'}</Text>
            </Pressable>
          </View>
        </View>
        <View className="pt-2.5">
          <UnderlineTabs options={AREA_OPTIONS} value={area} onChange={setArea} />
        </View>
      </View>

      <FeedBody
        mapOn={mapOn}
        missingAreaMessage={missingAreaMessage}
        active={active}
        isLoading={isLoading}
        area={area}
        areaPosts={areaPosts}
        pendingPosts={pendingPosts}
        favToast={favToast}
        setFavToast={setFavToast}
        postedToast={postedToast}
        setPostedToast={setPostedToast}
        setSheetOpen={setSheetOpen}
      />

      <CreateSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} />
    </SafeAreaView>
  );
}
