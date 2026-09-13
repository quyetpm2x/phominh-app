import { usePostInteractions } from '../home/postInteractions';
import { HIDDEN_PREVIEWS, filterHiddenItems } from './data';
beforeEach(() => usePostInteractions.getState().reset());
test('filter counts reflect users, places and posts in the list', () => {
  expect(filterHiddenItems(HIDDEN_PREVIEWS, 'all')).toHaveLength(4);
  expect(filterHiddenItems(HIDDEN_PREVIEWS, 'users')).toHaveLength(3);
  expect(filterHiddenItems(HIDDEN_PREVIEWS, 'posts')).toHaveLength(1);
});
test('unhide all clears exclusions but preserves saved posts and likes', () => {
  const state = usePostInteractions.getState();
  state.setSaved({ hoa: true });
  state.setLiked({ hoa: true });
  state.blockAuthor('hoa');
  state.setHidden(['tuan']);
  state.reduceTopic('shops');
  state.clearHiddenItems(HIDDEN_PREVIEWS.map((item) => item.id));
  const updated = usePostInteractions.getState();
  expect(updated.hidden).toEqual([]);
  expect(updated.blockedAuthors).toEqual([]);
  expect(updated.reducedTopics).toEqual([]);
  expect(updated.dismissedHiddenPreviews).toHaveLength(4);
  expect(updated.saved.hoa).toBe(true);
  expect(updated.liked.hoa).toBe(true);
});
test('dismissing a preview does not remove real feed exclusions', () => {
  const state = usePostInteractions.getState();
  state.blockAuthor('hoa');
  state.dismissHiddenPreview('preview-hoang');
  state.dismissHiddenPreview('preview-hoang');
  expect(usePostInteractions.getState().dismissedHiddenPreviews).toEqual(['preview-hoang']);
  expect(usePostInteractions.getState().blockedAuthors).toEqual(['hoa']);
});
