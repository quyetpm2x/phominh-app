import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage, getFixedAreas, type FixedArea } from '../../src/api/client';
import type { NearbyPost } from '../../src/api/endpoints/posts';
import { colors } from '../../src/constants/design-tokens';
import { NEARBY_RADIUS_KM } from '../../src/constants/geo';
import { AreaTabsBar, type AreaTabOption } from '../../src/components/feed/AreaTabsBar';
import { CreateSheet } from '../../src/components/feed/CreateSheet';
import { FeedBody } from '../../src/components/feed/FeedBody';
import { GradientText } from '../../src/components/ui/GradientText';
import { useMe } from '../../src/hooks/useMe';
import { usePosts } from '../../src/hooks/usePosts';
import { useCastPostVote } from '../../src/hooks/useVotes';
import { formatDistance } from '../../src/utils/formatDistance';
import { formatExpiry, formatTimeAgo } from '../../src/lib/format';
import { filterByPostType, sortNearbyPosts } from '../../src/lib/postListFilters';
import { type AreaKey, type PostTag, type UIPost } from '../../src/mocks/phoMinh';
import { useFilterStore } from '../../src/stores/filterStore';
import { usePendingPostStore } from '../../src/stores/pendingPostStore';

const AREA_LABELS: Record<AreaKey, string> = { home: 'Nhà', work: 'Chỗ làm', nearby: 'Quanh đây' };

const POST_TYPE_TAG: Record<NearbyPost['postType'], { label: PostTag; color: UIPost['tagColor'] }> = {
  life: { label: 'Đời sống', color: 'gray' },
  merchant: { label: 'Cửa hàng', color: 'gold' },
  emergency: { label: 'Khẩn cấp', color: 'red' },
};

function toUIPost(p: NearbyPost, area: AreaKey): UIPost {
  return {
    id: p.id,
    authorId: p.authorId,
    area,
    variant: 'full',
    author: p.authorDisplayName,
    initial: p.authorDisplayName.charAt(0).toUpperCase(),
    avatarColor: colors.primary.DEFAULT,
    badge: p.authorBadge,
    // Thiếu từ trước — PostCard.tsx dùng isShop để đổi viền avatar/nút liên hệ quán, không set thì
    // bài merchant thật không bao giờ hiện đúng kiểu. isUrgent CHƯA set: cần confirmCount thật từ
    // backend (NearbyPost chưa có field này) mới hiện đúng banner "N người đã xác nhận", set cứng
    // isUrgent=true lúc này sẽ hiện "undefined người đã xác nhận" — để nguyên tới khi backend bổ sung.
    isShop: p.postType === 'merchant',
    tag: POST_TYPE_TAG[p.postType].label,
    tagColor: POST_TYPE_TAG[p.postType].color,
    text: p.content,
    photos: p.imageUrl ? 1 : 0,
    imageUrl: p.imageUrl,
    distance: formatDistance(p.distanceMeters),
    timeAgo: formatTimeAgo(p.createdAt),
    createdAt: p.createdAt,
    expiresAt: p.expiresAt,
    displayMode: p.displayMode,
    lat: p.lat,
    lng: p.lng,
    votes: p.voteCount,
    hasVoted: p.hasVoted,
    comments: p.commentCount,
    expiry: formatExpiry(p.expiresAt),
    mediaNote: p.imageUrl ? 'ảnh chụp tại chỗ' : '',
  };
}

// isFeed — header + pill khu vực + chế độ Bản đồ/Danh sách, đúng theo Phố Mình.dc.html. Data thật:
// Nhà/Chỗ làm lấy toạ độ từ FixedArea đã lưu (area-home.tsx/area-work.tsx), Quanh đây lấy GPS sống.
export default function FeedScreen() {
  const { justPosted } = useLocalSearchParams<{ justPosted?: string }>();
  const [area, setArea] = useState<AreaKey>('nearby');
  const [mapOn, setMapOn] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [postedToast, setPostedToast] = useState(!!justPosted);

  const { data: me } = useMe();
  const castPostVote = useCastPostVote();
  const onVotePost = (postId: string) => {
    void castPostVote.mutateAsync(postId).catch(async (err) => {
      Alert.alert('Không vote được', await extractErrorMessage(err));
    });
  };

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

  const {
    data: nearbyPosts,
    isLoading,
    isRefetching,
    refetch,
  } = usePosts(
    active
      ? { lat: active.lat, lng: active.lng, radiusKm: active.radiusKm }
      : { lat: Number.NaN, lng: Number.NaN, radiusKm: 0 },
  );

  const areaPosts = useMemo(() => {
    const filtered = filterByPostType(nearbyPosts ?? [], filterStore.postTypes);
    const sorted = sortNearbyPosts(filtered, filterStore.sortMode);
    return sorted.map((p) => toUIPost(p, area));
  }, [nearbyPosts, area, filterStore.postTypes, filterStore.sortMode]);

  const AREA_ICON: Record<AreaKey, keyof typeof Ionicons.glyphMap> = {
    nearby: 'compass',
    home: 'home',
    work: 'briefcase',
  };
  const AREA_OPTIONS: AreaTabOption[] = (['nearby', 'home', 'work'] as AreaKey[]).map((key) => ({
    key,
    label: key === 'nearby' ? `Quanh đây (${NEARBY_RADIUS_KM}km)` : AREA_LABELS[key],
    icon: AREA_ICON[key],
  }));

  const missingAreaMessage =
    area === 'work' && fixedAreas && !workArea ? 'Chưa đặt khu vực "Chỗ làm" — vào Hồ sơ để đặt.' : null;

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <View className="border-b border-border bg-cream px-5 pb-3 pt-1">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-3">
            <LinearGradient
              colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
              style={{ width: 40, height: 40, borderRadius: 16, padding: 2 }}
            >
              <View className="flex-1 items-center justify-center rounded-[14px] bg-white">
                <GradientText colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]} className="text-xl font-sans-black">
                  P
                </GradientText>
              </View>
            </LinearGradient>
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Text className="text-[19px] font-sans-black tracking-tight text-ink">Phố Mình</Text>
                <View className="flex-row items-center gap-0.5 rounded-full border border-accent/25 bg-accent/15 px-1.5 py-0.5">
                  <Ionicons name="sparkles" size={8} color={colors.accent.DEFAULT} />
                  <Text className="text-[9px] font-sans-black uppercase tracking-wide text-accent">Live</Text>
                </View>
              </View>
              <View className="mt-0.5 flex-row items-center gap-1">
                <Ionicons name="location" size={11} color={colors.primary.DEFAULT} />
                <Text className="flex-1 text-xs font-sans-medium text-muted" numberOfLines={1}>
                  {active ? `${active.place} · ${active.radiusKm}km` : 'Đang định vị…'}
                </Text>
              </View>
            </View>
          </View>
          <Pressable
            onPress={() => setMapOn((v) => !v)}
            className="h-9 w-9 items-center justify-center rounded-xl border border-border bg-cream-surface active:scale-95"
          >
            <Ionicons name={mapOn ? 'list' : 'map'} size={18} color={colors.primary.DEFAULT} />
          </Pressable>
        </View>
        <View className="mt-3 border-t border-border/60 pt-2.5">
          <AreaTabsBar options={AREA_OPTIONS} value={area} onChange={setArea} />
        </View>
      </View>

      <FeedBody
        mapOn={mapOn}
        missingAreaMessage={missingAreaMessage}
        active={active}
        isLoading={isLoading}
        refreshing={isRefetching}
        onRefresh={() => void refetch()}
        area={area}
        areaPosts={areaPosts}
        pendingPosts={pendingPosts}
        currentUserId={me?.id}
        onVotePost={onVotePost}
        postedToast={postedToast}
        setPostedToast={setPostedToast}
        setSheetOpen={setSheetOpen}
      />

      <CreateSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} />
    </SafeAreaView>
  );
}
