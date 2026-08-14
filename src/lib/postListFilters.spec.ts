import { filterByPostType, sortNearbyPosts } from './postListFilters';
import type { NearbyPost } from '../api/endpoints/posts';

function makePost(overrides: Partial<NearbyPost>): NearbyPost {
  return {
    id: 'p1',
    authorId: 'u1',
    authorDisplayName: 'Test',
    authorBadge: '🌱 Người mới',
    postType: 'life',
    content: '',
    lat: 0,
    lng: 0,
    distanceMeters: 0,
    displayMode: 'alias',
    isLibraryPhoto: false,
    voteCount: 0,
    commentCount: 0,
    expiresAt: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    imageUrl: null,
    score: 0,
    textColor: null,
    backgroundColor: null,
    fontSize: null,
    ...overrides,
  };
}

describe('sortNearbyPosts', () => {
  const posts = [
    makePost({ id: 'a', createdAt: '2026-01-01T00:00:00.000Z', voteCount: 5 }),
    makePost({ id: 'b', createdAt: '2026-01-03T00:00:00.000Z', voteCount: 1 }),
    makePost({ id: 'c', createdAt: '2026-01-02T00:00:00.000Z', voteCount: 9 }),
  ];

  it('default: giữ nguyên thứ tự backend đã trả (đã sort theo score)', () => {
    expect(sortNearbyPosts(posts, 'default').map((p) => p.id)).toEqual(['a', 'b', 'c']);
  });

  it('newest: sort createdAt giảm dần', () => {
    expect(sortNearbyPosts(posts, 'newest').map((p) => p.id)).toEqual(['b', 'c', 'a']);
  });

  it('mostVoted: sort voteCount giảm dần', () => {
    expect(sortNearbyPosts(posts, 'mostVoted').map((p) => p.id)).toEqual(['c', 'a', 'b']);
  });

  it('không sửa mảng gốc (immutable)', () => {
    const original = [...posts];
    sortNearbyPosts(posts, 'newest');
    expect(posts).toEqual(original);
  });
});

describe('filterByPostType', () => {
  const posts = [
    makePost({ id: 'a', postType: 'life' }),
    makePost({ id: 'b', postType: 'merchant' }),
    makePost({ id: 'c', postType: 'emergency' }),
  ];

  it('mảng rỗng → không lọc, trả nguyên', () => {
    expect(filterByPostType(posts, [])).toEqual(posts);
  });

  it('lọc đúng 1 loại', () => {
    expect(filterByPostType(posts, ['merchant']).map((p) => p.id)).toEqual(['b']);
  });

  it('lọc nhiều loại cùng lúc', () => {
    expect(filterByPostType(posts, ['life', 'emergency']).map((p) => p.id)).toEqual(['a', 'c']);
  });
});
