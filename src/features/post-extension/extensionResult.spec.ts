import { createExtensionResult, formatExtensionExpiry } from './extensionResult';
import { usePostInteractions } from '../home/postInteractions';
import { POSTS } from '../home/data';
import { selectFeedPosts } from '../home/selectFeedPosts';

beforeEach(() => usePostInteractions.getState().reset());

test('adds the selected plan to the existing expiry and preserves the boost selection', () => {
  const now = new Date(2026, 8, 8, 23, 30).getTime();
  const first = createExtensionResult('my-demo-post', 12, false, 1, undefined, now);
  expect(first.expiresAt).toBe(now + 13 * 3_600_000);
  expect(first.boost).toBe(false);
  const second = createExtensionResult(first.postId, 48, true, 1, first.expiresAt, now);
  expect(second.expiresAt).toBe(first.expiresAt + 48 * 3_600_000);
});

test('an expired post is extended from now rather than its old expiry', () => {
  const now = new Date(2026, 8, 8, 12).getTime();
  expect(createExtensionResult('post', 24, true, 0, now - 86_400_000, now).expiresAt).toBe(now + 86_400_000);
});

test('formats tomorrow across month and year boundaries', () => {
  const now = new Date(2026, 11, 31, 23, 30);
  expect(formatExtensionExpiry(new Date(2027, 0, 1, 12, 5).getTime(), now)).toBe('12:05 • Ngày mai');
});

test('boost and expiry persist by post until session reset', () => {
  const state = usePostInteractions.getState();
  const result = createExtensionResult('my-demo-post', 24, true, 1);
  state.completeExtension(result);
  expect(selectFeedPosts(POSTS, 'all', usePostInteractions.getState())[0].id).toBe(result.postId);
  expect(usePostInteractions.getState().extensions[result.postId]).toEqual(result);
  state.completeExtension({ ...result, boost: false });
  expect(selectFeedPosts(POSTS, 'all', usePostInteractions.getState()).map((post) => post.id)).toEqual(
    POSTS.map((post) => post.id),
  );
  state.reset();
  expect(usePostInteractions.getState().extensions).toEqual({});
});
