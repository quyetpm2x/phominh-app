import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { POSTS } from './data';
import { FeedComposer } from './FeedComposer';
import { FeedPostCard } from './FeedPostCard';
import { HomeHeader } from './HomeHeader';
import { ReportedPostCard } from './ReportedPostCard';
import type { useHomeDestination } from './useHomeDestination';
import type { HomeFeedController } from './useHomeFeed';

export function HomeFeedTab({
  controller,
  destination,
}: {
  controller: HomeFeedController;
  destination: ReturnType<typeof useHomeDestination>;
}) {
  const {
    profile,
    scroll,
    visiblePosts,
    liked,
    comments,
    setFilter,
    setHidden,
    setSheet,
    setMenu,
    setLiked,
    openPost,
    sharePost,
  } = controller;
  return (
    <>
      <HomeHeader {...controller} />
      <ScrollView
        ref={scroll}
        contentContainerStyle={styles.feed}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={destination.onContentSizeChange}
        onScrollBeginDrag={destination.onScrollBeginDrag}
      >
        <FeedComposer profile={profile} onCompose={() => setSheet('compose')} />
        {visiblePosts.map((post) => {
          if (controller.reports[post.id]) {
            const topic = post.merchant ? 'shops' : 'neighbors';
            return (
              <ReportedPostCard
                key={post.id}
                post={post}
                blocked={controller.blockedAuthors.includes(post.authorId)}
                reduced={controller.reducedTopics.includes(topic)}
                onBlock={() => controller.blockAuthor(post.authorId)}
                onReduce={() => controller.reduceTopic(topic)}
                onUndoBlock={() => controller.unblockAuthor(post.authorId)}
                onUndoReduce={() => controller.restoreTopic(topic)}
                onManage={() => setSheet('preferences')}
              />
            );
          }
          const index = POSTS.findIndex((item) => item.id === post.id);
          return (
            <View key={post.id} onLayout={(event) => destination.onPostLayout(post.id, event)}>
              <FeedPostCard
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
            </View>
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
    </>
  );
}
const styles = StyleSheet.create({
  feed: { padding: 16, gap: 16, backgroundColor: '#FFFBF7', flexGrow: 1, paddingBottom: 24 },
});
