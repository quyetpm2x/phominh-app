import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { usePostInteractions } from '../home/postInteractions';
import type { HomeFeedController } from '../home/useHomeFeed';
import { PostExtensionSheet } from '../post-extension/PostExtensionSheet';
import { type MyPost, type PostFilter } from './data';
import { MyPostsEmptyState } from './MyPostsEmptyState';
import { ShopRegistrationBanner } from '../shop/ShopRegistrationBanner';
import { MyPostCard } from './MyPostCard';
import { MyPostFilters, matchesPostFilter } from './MyPostFilters';
import { MyPostsToolbar } from './MyPostsToolbar';
import { NearbyResidentsCard } from './NearbyResidentsCard';

export function MyPostsTab({
  onCompose,
  personal = false,
  controller,
  posts: sourcePosts,
}: {
  onCompose: () => void;
  personal?: boolean;
  controller: HomeFeedController;
  posts: MyPost[];
}) {
  const { profile, setOwnedMenuPost } = controller;
  const [filter, setFilter] = useState<PostFilter>('all');
  const [query, setQuery] = useState('');
  const [oldestFirst, setOldestFirst] = useState(false);
  const [detail, setDetail] = useState<MyPost | null>(null);
  const [extending, setExtending] = useState<MyPost | null>(null);
  const extensions = usePostInteractions((state) => state.extensions);
  const edits = usePostInteractions((state) => state.edits);
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const refresh = setTimeout(() => setNow(Date.now()), 0);
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => {
      clearTimeout(refresh);
      clearInterval(timer);
    };
  }, [extensions]);
  const posts = sourcePosts.map((post) => ({
    ...post,
    ...edits[post.id],
    name: profile?.fullName.trim() || post.name,
    avatar: profile?.avatarUri ? { uri: profile.avatarUri } : post.avatar,
    remainingHours: extensions[post.id]
      ? Math.max(0, Math.ceil((extensions[post.id].expiresAt - now) / 3_600_000))
      : post.remainingHours,
  }));
  const visible = posts.filter(
    (post) =>
      matchesPostFilter(post, filter, personal) &&
      post.text.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi')),
  );
  if (oldestFirst) visible.reverse();
  return (
    <>
      {!personal && posts.length > 0 ? (
        <MyPostsToolbar
          posts={posts}
          filter={filter}
          onFilter={setFilter}
          query={query}
          onQuery={setQuery}
          oldestFirst={oldestFirst}
          onSort={setOldestFirst}
        />
      ) : null}
      <ScrollView
        className="flex-1 bg-[#F8F9FA]"
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {posts.length === 0 ? (
          <>
            {personal ? <ShopRegistrationBanner /> : null}
            <MyPostsEmptyState onCompose={onCompose} />
          </>
        ) : (
          <NearbyResidentsCard onCompose={onCompose} />
        )}
        {personal && posts.length > 0 ? (
          <MyPostFilters posts={posts} value={filter} onChange={setFilter} personal />
        ) : null}
        {visible.map((post) => (
          <MyPostCard
            key={post.id}
            post={post}
            personal={personal}
            onMenu={() => setOwnedMenuPost(post)}
            onExtend={() => setExtending(post)}
            onOpen={() => setDetail(post)}
          />
        ))}
        {posts.length > 0 && !visible.length ? (
          <Text className="py-8 text-center font-sans text-sm text-muted">Không có bài viết phù hợp.</Text>
        ) : null}
      </ScrollView>

      <PostExtensionSheet
        post={extending}
        onClose={() => setExtending(null)}
        onViewPost={(id) => setDetail(posts.find((post) => post.id === id) ?? null)}
      />
      <BottomSheet visible={detail !== null} onClose={() => setDetail(null)} variant="actions">
        <ScrollView>
          {detail ? (
            <MyPostCard personal={personal} post={posts.find((post) => post.id === detail.id) ?? detail} />
          ) : null}
          <Button label="Đóng" variant="outline" onPress={() => setDetail(null)} />
        </ScrollView>
      </BottomSheet>
    </>
  );
}
const styles = StyleSheet.create({ content: { padding: 12, gap: 16, paddingBottom: 40 } });
