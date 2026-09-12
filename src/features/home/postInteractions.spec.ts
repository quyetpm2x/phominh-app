import { usePostInteractions } from './postInteractions';
import { findPost } from '../post/findPost';

beforeEach(() => usePostInteractions.getState().reset());

test('owner menu destinations resolve string IDs from My Posts and retain edits', () => {
  const post = findPost('my-review');
  expect(post?.id).toBe('my-review');
  const edit = { text: 'Nội dung đã cập nhật', commentsEnabled: true, notifyReplies: false };
  expect(usePostInteractions.getState().savePostEdit('my-review', edit)).toBe(true);
  expect(usePostInteractions.getState().edits['my-review']).toEqual(edit);
});

test('shared post lookup does not allow editing another author or an unknown post', () => {
  const edit = { text: 'Nội dung cập nhật', commentsEnabled: true, notifyReplies: false };
  expect(usePostInteractions.getState().savePostEdit('hoa', edit)).toBe(false);
  expect(usePostInteractions.getState().savePostEdit('missing-post', edit)).toBe(false);
  expect(findPost('missing-post')).toBeUndefined();
  expect(usePostInteractions.getState().edits).toEqual({});
});

test('comments added from both screens retain previous comments and stay scoped to their post', () => {
  const fromFeed = usePostInteractions.getState().setComments;
  const fromDetail = usePostInteractions.getState().setComments;
  fromFeed({ hoa: ['Bình luận từ dòng tin'], tuan: ['Bài khác'] });
  fromDetail((previous) => ({ ...previous, hoa: [...previous.hoa, 'Trả lời từ chi tiết'] }));
  expect(usePostInteractions.getState().comments).toEqual({
    hoa: ['Bình luận từ dòng tin', 'Trả lời từ chi tiết'],
    tuan: ['Bài khác'],
  });
});

test('saving in detail is visible to a returning feed subscriber', () => {
  const changes: boolean[] = [];
  const unsubscribe = usePostInteractions.subscribe((state) => changes.push(Boolean(state.saved.hoa)));
  usePostInteractions.getState().setSaved((previous) => ({ ...previous, hoa: true }));
  usePostInteractions.getState().setSaved((previous) => ({ ...previous, hoa: false }));
  expect(changes).toEqual([true, false]);
  unsubscribe();
});

test('useful toggles independently from likes and other posts', () => {
  const state = usePostInteractions.getState();
  state.setLiked({ hoa: true });
  state.toggleUseful('hoa');
  state.toggleUseful('tuan');
  state.toggleUseful('hoa');
  expect(usePostInteractions.getState().useful).toEqual({ hoa: false, tuan: true });
  expect(usePostInteractions.getState().liked).toEqual({ hoa: true });
});

test('ending a session clears shared local activity', () => {
  const state = usePostInteractions.getState();
  state.setComments({ hoa: ['Bình luận'] });
  state.setSaved({ hoa: true });
  state.setLiked({ hoa: true });
  state.toggleUseful('hoa');
  state.reset();
  expect(usePostInteractions.getState()).toMatchObject({ comments: {}, saved: {}, liked: {}, useful: {} });
});

test('hiding from detail updates the feed without changing unrelated posts', () => {
  usePostInteractions.getState().setHidden((previous) => [...previous, 'hoa']);
  expect(usePostInteractions.getState().hidden).toEqual(['hoa']);
  usePostInteractions.getState().reset();
  expect(usePostInteractions.getState().hidden).toEqual([]);
});
