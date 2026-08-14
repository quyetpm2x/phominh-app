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
  textColor: string | null;
  backgroundColor: string | null;
  fontSize: 'small' | 'medium' | 'large' | null;
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
  textColor: string | null;
  backgroundColor: string | null;
  fontSize: 'small' | 'medium' | 'large' | null;
}

export async function fetchPost(id: string): Promise<PostDetail> {
  const res = await apiClient.get(`api/mobile/posts/${id}`).json<Envelope<PostDetail>>();
  return res.data;
}

export interface UpdatePostInput {
  content: string;
  textColor?: string;
  backgroundColor?: string;
  fontSize?: 'small' | 'medium' | 'large';
}

// Sửa bài đăng của chính mình (mục 33) — chỉ content + style, backend chặn nếu không phải tác giả
// hoặc bài đã hết hạn/bị xoá.
export async function updatePost(id: string, input: UpdatePostInput): Promise<void> {
  await apiClient.patch(`api/mobile/posts/${id}`, { json: input });
}

// Xoá bài đăng của chính mình (mục 33) — soft delete, biến mất khỏi feed/chi tiết ngay.
export async function deletePost(id: string): Promise<void> {
  await apiClient.delete(`api/mobile/posts/${id}`);
}

// "Bài đã đăng" trong hồ sơ (mục 35, 36) — có thêm status so với NearbyPost/PostDetail, để FE tự
// tách tab "Đang hiện"/"Đã hết hạn" (chỉ áp dụng cho bài CHÍNH MÌNH — by-user chỉ trả active).
export interface MyPost extends Omit<NearbyPost, 'distanceMeters' | 'score'> {
  status: 'active' | 'removed' | 'expired';
}

export async function fetchMyPosts(): Promise<MyPost[]> {
  const res = await apiClient.get('api/mobile/posts/mine').json<Envelope<MyPost[]>>();
  return res.data;
}

export async function fetchPostsByAuthor(userId: string): Promise<MyPost[]> {
  const res = await apiClient
    .get(`api/mobile/posts/by-user/${userId}`)
    .json<Envelope<MyPost[]>>();
  return res.data;
}

// Thống kê "ai đã xem bài" (mục 44) — chỉ merchant là tác giả mới gọi được getViewCount, backend tự
// chặn 403 nếu không phải.
export async function recordPostView(id: string): Promise<void> {
  await apiClient.post(`api/mobile/posts/${id}/views`);
}

export async function fetchPostViewCount(id: string): Promise<{ totalViews: number }> {
  const res = await apiClient
    .get(`api/mobile/posts/${id}/views/count`)
    .json<Envelope<{ totalViews: number }>>();
  return res.data;
}

// multipart/form-data — React Native FormData nhận object { uri, name, type } trực tiếp, không cần
// đọc file thành Blob tay như web (khác hẳn cách dùng FormData trên browser).
export async function uploadPostImage(uri: string): Promise<string> {
  const formData = new FormData();
  const extensionMatch = /\.(\w+)$/.exec(uri);
  const extension = extensionMatch?.[1] ?? 'jpg';
  formData.append('file', {
    uri,
    name: `photo.${extension}`,
    type: `image/${extension === 'jpg' ? 'jpeg' : extension}`,
  } as unknown as Blob);

  const res = await apiClient
    .post('api/mobile/posts/images', { body: formData })
    .json<Envelope<{ url: string }>>();
  return res.data.url;
}

export interface CreatePostInput {
  postType: 'life' | 'merchant' | 'emergency';
  content: string;
  lat: number;
  lng: number;
  displayMode: 'alias' | 'real_name';
  imageUrls?: string[];
  // Style toàn bộ nội dung (mục 22) — không gửi field (undefined) = giao diện mặc định.
  textColor?: string;
  backgroundColor?: string;
  fontSize?: 'small' | 'medium' | 'large';
  // Chống giả mạo GPS (mục 7a) — expo-location LocationObject.mocked lúc chụp ảnh.
  isMockLocation?: boolean;
}

export interface CreatedPost {
  id: string;
  postType: string;
  content: string;
  expiresAt: string | null;
  createdAt: string;
}

export async function createPost(input: CreatePostInput): Promise<CreatedPost> {
  const res = await apiClient.post('api/mobile/posts', { json: input }).json<Envelope<CreatedPost>>();
  return res.data;
}
