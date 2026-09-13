import { usePostInteractions } from '../home/postInteractions';
import { POSTS } from '../home/data';
import { findPost } from '../post/findPost';
import { HIDDEN_PREVIEWS, type HiddenItem } from './data';
export function useHiddenItems() {
  const state = usePostInteractions();
  const items: HiddenItem[] = [
    ...HIDDEN_PREVIEWS.filter((item) => !state.dismissedHiddenPreviews.includes(item.id)),
    ...state.blockedAuthors.map((id) => {
      const author = POSTS.find((post) => post.authorId === id);
      return {
        id,
        kind: author?.merchant ? ('place' as const) : ('user' as const),
        name: author?.name ?? 'Người dùng',
        detail: 'Đã ẩn bài viết từ tác giả này',
        image: author?.avatar,
      };
    }),
    ...state.hidden.map((id) => {
      const post = findPost(id);
      return {
        id,
        kind: 'post' as const,
        name: post ? `Bài viết: "${post.text.replace(/==/g, '')}"` : 'Bài viết đã ẩn',
        detail: post ? `Tác giả: ${post.name} • Cách ${post.distance}` : 'Không còn thông tin bài viết',
        image: post?.photos[0],
      };
    }),
    ...state.reducedTopics.map((id) => ({
      id,
      kind: 'topic' as const,
      name: id === 'shops' ? 'Quán ăn' : 'Khu dân cư',
      detail: 'Chủ đề đang giảm đề xuất',
    })),
  ];
  const unhide = (item: HiddenItem) => {
    if (item.preview) state.dismissHiddenPreview(item.id);
    else if (item.kind === 'post') state.setHidden((previous) => previous.filter((id) => id !== item.id));
    else if (item.kind === 'topic') state.restoreTopic(item.id as 'shops' | 'neighbors');
    else state.unblockAuthor(item.id);
  };
  return { items, unhide, clear: () => state.clearHiddenItems(HIDDEN_PREVIEWS.map((item) => item.id)) };
}
