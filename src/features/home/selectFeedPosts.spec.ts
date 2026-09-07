import { POSTS } from './data';
import { usePostInteractions } from './postInteractions';
import { selectFeedPosts } from './selectFeedPosts';

beforeEach(() => usePostInteractions.getState().reset());
const ids = () => selectFeedPosts(POSTS, 'all', usePostInteractions.getState()).map((post) => post.id);

test('multiple reports retain their placeholders and reason text', () => {
  const state = usePostInteractions.getState();
  state.completeLocalReport({ postId: 'hoa', reason: 'other', details: 'Mô tả cụ thể' });
  state.completeLocalReport({ postId: 'tuan', reason: 'spam', details: '' });
  expect(ids()).toEqual(POSTS.map((post) => post.id));
  expect(usePostInteractions.getState().reports.hoa.details).toBe('Mô tả cụ thể');
  expect(usePostInteractions.getState().lastReport?.postId).toBe('tuan');
  expect(usePostInteractions.getState().hidden).toEqual(['hoa', 'tuan']);
});

test('blocking an author hides their other posts but retains the reported placeholder', () => {
  const state = usePostInteractions.getState();
  state.completeLocalReport({ postId: 'hoa', reason: 'spam', details: '' });
  state.blockAuthor('hoa');
  const morePosts = [...POSTS, { ...POSTS[0], id: 'hoa-second-post' }];
  const visible = selectFeedPosts(morePosts, 'all', usePostInteractions.getState());
  expect(visible.map((post) => post.id)).toContain('hoa');
  expect(visible.map((post) => post.id)).not.toContain('hoa-second-post');
  expect(visible.map((post) => post.id)).toContain('tuan');
});

test('manual hiding removes content, topic reduction reorders without changing source data', () => {
  const originalOrder = POSTS.map((post) => post.id);
  const state = usePostInteractions.getState();
  state.setHidden(['hoa']);
  state.reduceTopic('shops');
  expect(ids()).toEqual(['tuan', 'ha']);
  expect(POSTS.map((post) => post.id)).toEqual(originalOrder);
  expect(selectFeedPosts(POSTS, 'shops', usePostInteractions.getState()).map((post) => post.id)).toEqual([
    'ha',
  ]);
});

test('session reset removes report, block and topic preferences', () => {
  const state = usePostInteractions.getState();
  state.completeLocalReport({ postId: 'hoa', reason: 'spam', details: '' });
  state.blockAuthor('hoa');
  state.reduceTopic('shops');
  state.reset();
  expect(usePostInteractions.getState()).toMatchObject({
    reports: {},
    lastReport: null,
    hidden: [],
    blockedAuthors: [],
    reducedTopics: [],
  });
});

test('undoing author and topic preferences restores feed without withdrawing reports', () => {
  const state = usePostInteractions.getState();
  state.completeLocalReport({ postId: 'hoa', reason: 'spam', details: '' });
  state.blockAuthor('hoa');
  state.blockAuthor('ha');
  state.reduceTopic('shops');
  state.unblockAuthor('hoa');
  state.restoreTopic('shops');
  const morePosts = [...POSTS, { ...POSTS[0], id: 'hoa-second' }];
  const visible = selectFeedPosts(morePosts, 'all', usePostInteractions.getState()).map((post) => post.id);
  expect(visible).toContain('hoa-second');
  expect(visible).not.toContain('ha');
  expect(usePostInteractions.getState().reports.hoa).toBeDefined();
  expect(usePostInteractions.getState().hidden).toContain('hoa');
  expect(usePostInteractions.getState().reducedTopics).toEqual([]);
});
