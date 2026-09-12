import { findPost } from '../post/findPost';
import { usePostInteractions } from '../home/postInteractions';
import { SHOP_POSTS } from './data';
import { SHOP_POST_ANALYTICS } from './postDetails';

afterEach(() => usePostInteractions.getState().reset());

test.each(SHOP_POSTS)('shop detail and edit resolve the selected $id', (post) => {
  expect(findPost(post.id)).toMatchObject({
    id: post.id,
    views: post.views,
    likes: post.votes,
    merchant: true,
  });
  const edit = { text: 'Nội dung quán cập nhật', commentsEnabled: true, notifyReplies: true };
  expect(usePostInteractions.getState().savePostEdit(post.id, edit)).toBe(true);
  expect(usePostInteractions.getState().edits[post.id]).toEqual(edit);
});

test('coffee breakdown matches the dashboard totals', () => {
  const post = SHOP_POSTS.find((item) => item.id === 'coffee')!;
  const analytics = SHOP_POST_ANALYTICS.coffee;
  expect(analytics.distances.reduce((total, row) => total + row.views, 0)).toBe(post.views);
  expect(analytics.likes + analytics.hearts).toBe(post.votes);
});
