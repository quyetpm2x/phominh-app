import type { NearbyPost } from '../api/endpoints/posts';

export type SortMode = 'default' | 'newest' | 'mostVoted';
export type PostTypeFilter = 'life' | 'merchant' | 'emergency';

// 'default' giữ nguyên thứ tự backend đã trả (đã sort theo score xếp hạng ở findNearby) — chỉ
// 'newest'/'mostVoted' mới sort lại ở client, quyết định kiến trúc: không đổi backend cho việc này
// (xem docs/superpowers/specs/2026-08-12-feed-noi-dung-tang2-design.md).
export function sortNearbyPosts(posts: NearbyPost[], mode: SortMode): NearbyPost[] {
  if (mode === 'newest') {
    return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  if (mode === 'mostVoted') {
    return [...posts].sort((a, b) => b.voteCount - a.voteCount);
  }
  return posts;
}

// Backend NearbyQueryDto.postType chỉ nhận 1 giá trị, UI cho chọn nhiều loại cùng lúc — lọc hoàn
// toàn ở client, nhất quán với quyết định sort ở trên.
export function filterByPostType(posts: NearbyPost[], types: PostTypeFilter[]): NearbyPost[] {
  if (types.length === 0) return posts;
  return posts.filter((p) => types.includes(p.postType));
}
