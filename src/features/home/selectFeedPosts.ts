import type { FeedPost, Filter } from './types';

interface FeedPreferences {
  hidden: readonly string[];
  reports: Record<string, unknown>;
  blockedAuthors: readonly string[];
  reducedTopics: readonly ('shops' | 'neighbors')[];
}
export function selectFeedPosts(posts: readonly FeedPost[], filter: Filter, preferences: FeedPreferences) {
  const { hidden, reports, blockedAuthors, reducedTopics } = preferences;
  const visible = posts.filter((post) => {
    if (filter !== 'all' && (filter === 'shops') !== post.merchant) return false;
    // Keep the report receipt in the feed while suppressing the original content.
    return (
      Boolean(reports[post.id]) || (!hidden.includes(post.id) && !blockedAuthors.includes(post.authorId))
    );
  });
  const priority = (post: FeedPost) =>
    reports[post.id] ? 0 : Number(reducedTopics.includes(post.merchant ? 'shops' : 'neighbors'));
  return visible.sort((a, b) => priority(a) - priority(b));
}
