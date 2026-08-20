import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { currentUser, type AreaKey, type UIPost } from '../../mocks/phoMinh';
import { PostCard } from '../PostCard';
import { ComposerBar } from './ComposerBar';
import { EmptyFeedState } from './EmptyFeedState';
import { NearBanner } from './NearBanner';
import { PendingPostCard } from './PendingPostCard';
import { PostsMapView } from './PostsMapView';
import { ToastStrip } from './ToastStrip';
import type { PendingPost } from '../../stores/pendingPostStore';

interface ActiveArea {
  lat: number;
  lng: number;
  radiusKm: number;
  place: string;
}

interface FeedBodyProps {
  mapOn: boolean;
  missingAreaMessage: string | null;
  active: ActiveArea | null;
  isLoading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  area: AreaKey;
  areaPosts: UIPost[];
  pendingPosts: PendingPost[];
  currentUserId?: string;
  onVotePost: (postId: string) => void;
  postedToast: boolean;
  setPostedToast: (v: boolean) => void;
  setSheetOpen: (v: boolean) => void;
}

// Tách riêng khỏi feed.tsx để giữ độ phức tạp màn chính thấp — 4 trạng thái loại trừ nhau
// (bản đồ / thiếu khu vực / đang tải / danh sách), viết bằng if/else sớm thay vì ternary lồng.
export function FeedBody({
  mapOn,
  missingAreaMessage,
  active,
  isLoading,
  refreshing,
  onRefresh,
  area,
  areaPosts,
  pendingPosts,
  currentUserId,
  onVotePost,
  postedToast,
  setPostedToast,
  setSheetOpen,
}: FeedBodyProps) {
  if (missingAreaMessage) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-sm text-muted">{missingAreaMessage}</Text>
      </View>
    );
  }
  if (!active || isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }
  if (mapOn) {
    return <PostsMapView center={{ lat: active.lat, lng: active.lng }} place={active.place} posts={areaPosts} />;
  }

  return (
    <FlatList
      data={areaPosts}
      keyExtractor={(p) => p.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerClassName="px-3.5 pt-3 gap-3 pb-2"
      ListHeaderComponent={
        <View className="gap-3 mb-3">
          {area === 'nearby' ? <NearBanner place={active.place} onSave={() => router.push('/profile/areas')} /> : null}
          {postedToast ? (
            <ToastStrip variant="success" text="Đã đăng bài lên xóm" onDismiss={() => setPostedToast(false)} />
          ) : null}
          <ComposerBar
            initial={currentUser.initial}
            onPressInput={() => router.push('/post/create/status')}
            onPressMedia={() => setSheetOpen(true)}
            onPressStatus={() => router.push('/post/create/status')}
            onVoice={() => router.push('/post/create/voice')}
          />
          {pendingPosts.map((p) => (
            <PendingPostCard key={p.localId} post={p} />
          ))}
        </View>
      }
      renderItem={({ item }) => (
        <PostCard
          post={item}
          onVote={() => onVotePost(item.id)}
          canVote={item.authorId !== currentUserId}
        />
      )}
      ListEmptyComponent={
        pendingPosts.length === 0 ? (
          <EmptyFeedState place={active.place} onCompose={() => setSheetOpen(true)} onWiden={() => undefined} />
        ) : null
      }
    />
  );
}
