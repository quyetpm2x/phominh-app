import { apiClient } from '../client';

// Mọi response thành công từ backend đều bọc trong { data: ... } (TransformInterceptor).
interface Envelope<T> {
  data: T;
}

export interface NearbyPost {
  id: string;
  authorId: string;
  authorDisplayName: string;
  authorBadge: string;
  postType: 'life' | 'merchant' | 'emergency';
  content: string;
  lat: number;
  lng: number;
  distanceMeters: number;
  displayMode: 'alias' | 'real_name';
  isLibraryPhoto: boolean;
  voteCount: number;
  commentCount: number;
  expiresAt: string | null;
  createdAt: string;
  imageUrl: string | null;
  score: number;
}

export async function fetchNearbyPosts(params: {
  lat: number;
  lng: number;
  radiusKm: number;
}): Promise<NearbyPost[]> {
  const res = await apiClient
    .get('api/mobile/posts/nearby', { searchParams: params })
    .json<Envelope<NearbyPost[]>>();
  return res.data;
}

// Chi tiết 1 bài (Tầng 2 task 11) — không có distanceMeters/score (cần toạ độ người xem, không áp
// dụng cho màn chi tiết).
export interface PostDetail {
  id: string;
  authorId: string;
  authorDisplayName: string;
  authorBadge: string;
  postType: 'life' | 'merchant' | 'emergency';
  content: string;
  lat: number;
  lng: number;
  displayMode: 'alias' | 'real_name';
  isLibraryPhoto: boolean;
  voteCount: number;
  commentCount: number;
  expiresAt: string | null;
  createdAt: string;
  imageUrl: string | null;
}

export async function fetchPost(id: string): Promise<PostDetail> {
  const res = await apiClient.get(`api/mobile/posts/${id}`).json<Envelope<PostDetail>>();
  return res.data;
}
