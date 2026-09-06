import { Redirect, router } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/ui/Button';
import { colors } from '../src/constants/design-tokens';
import { POSTS } from '../src/features/home/data';
import { FeedComposer } from '../src/features/home/FeedComposer';
import { FeedPostCard } from '../src/features/home/FeedPostCard';
import { HomeHeader } from '../src/features/home/HomeHeader';
import { HomeNavigation } from '../src/features/home/HomeNavigation';
import { HomeSheets } from '../src/features/home/HomeSheets';
import { useHomeFeed } from '../src/features/home/useHomeFeed';

export default function HomeScreen() {
  const controller = useHomeFeed();
  const {
    signedIn,
    profile,
    scroll,
    visiblePosts,
    liked,
    comments,
    filter,
    unread,
    setFilter,
    setHidden,
    setSheet,
    setUnread,
    setMenu,
    setLiked,
    openPost,
    sharePost,
  } = controller;
  if (signedIn === null)
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-cream">
        <ActivityIndicator color={colors.primary.DEFAULT} />
      </SafeAreaView>
    );
  if (!signedIn) return <Redirect href="/(auth)/welcome" />;

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
      <HomeHeader {...controller} />
      <ScrollView ref={scroll} contentContainerStyle={styles.feed} showsVerticalScrollIndicator={false}>
        <FeedComposer profile={profile} onCompose={() => setSheet('compose')} />
        {visiblePosts.map((post) => {
          const index = POSTS.findIndex((item) => item.id === post.id);
          return (
            <FeedPostCard
              key={post.id}
              post={post}
              liked={Boolean(liked[post.id])}
              commentCount={comments[post.id]?.length ?? 0}
              onOpenPost={() => router.push({ pathname: '/post/[id]', params: { id: post.id } })}
              onLike={() => setLiked((previous) => ({ ...previous, [post.id]: !previous[post.id] }))}
              onMenu={() => setMenu(index)}
              onComments={() =>
                router.push({ pathname: '/post/[id]', params: { id: post.id, comments: 'true' } })
              }
              onShare={() => void sharePost(index)}
              onDetails={() =>
                post.merchant
                  ? openPost(index, 'contact')
                  : router.push({ pathname: '/post/[id]', params: { id: post.id } })
              }
              onOpenGallery={() => router.push({ pathname: '/post/[id]', params: { id: post.id } })}
            />
          );
        })}
        {visiblePosts.length === 0 ? (
          <View className="gap-3 rounded-2xl bg-white p-6">
            <Text className="text-center font-sans text-muted">Không có bài viết phù hợp.</Text>
            <Button
              label="Hiện tất cả"
              variant="outline"
              onPress={() => {
                setFilter('all');
                setHidden([]);
              }}
            />
          </View>
        ) : null}
      </ScrollView>
      <HomeNavigation
        filter={filter}
        unread={unread}
        onFilterChange={(next) => {
          setFilter(next);
          scroll.current?.scrollTo({ y: 0, animated: true });
        }}
        onNotifications={() => {
          setSheet('notifications');
          setUnread(0);
        }}
        onCompose={() => setSheet('compose')}
        onProfile={() => setSheet('profile')}
      />
      <HomeSheets controller={controller} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  feed: { padding: 16, gap: 16, backgroundColor: '#FFFBF7', flexGrow: 1, paddingBottom: 24 },
});
