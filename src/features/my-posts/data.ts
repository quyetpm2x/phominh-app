import { LOCAL_USER_ID } from '../../lib/personalProfile';
import { PHOTOS } from '../home/data';
import type { FeedPost } from '../home/types';

export type MyPost = FeedPost & { reach: number; radius: string; area: string };
export type PostFilter = 'all' | 'active' | 'expiring' | 'expired';
export const POST_FILTERS: { key: PostFilter; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'active', label: 'Đang hiển thị' },
  { key: 'expiring', label: 'Sắp hết hạn' },
  { key: 'expired', label: 'Đã hết hạn' },
];
const base = {
  authorId: LOCAL_USER_ID,
  name: 'Nguyễn Văn Quyết',
  badge: 'CHỦ QUÁN',
  color: '#FF416C',
  avatar: PHOTOS.me,
  rank: '',
  time: '',
  distance: '500m',
  merchant: false,
};
// Local UI fixtures; statuses and counts are derived from remainingHours.
export const MY_POSTS: MyPost[] = [
  {
    ...base,
    id: 'my-review',
    remainingHours: 22,
    area: 'Ngõ 19 Duy Tân',
    radius: '500m',
    text: 'Review mấy quán trà sữa ngon bổ rẻ quanh ngõ 19 Duy Tân cho anh em văn phòng nhé! Trà sữa đậm vị, topping đầy đặn...',
    photos: [PHOTOS.restaurant, PHOTOS.grill, PHOTOS.me],
    views: 142,
    likes: 28,
    comments: 18,
    reach: 520,
  },
  {
    ...base,
    id: 'my-badminton',
    remainingHours: 14,
    area: 'Duy Tân',
    radius: '1km',
    text: 'Tìm bạn đánh cầu lông sân Dịch Vọng tối nay 7h–9h, thiếu 1 bạn nam/nữ trình độ phong trào nhé ạ 🏸',
    photos: [],
    views: 89,
    likes: 14,
    comments: 6,
    reach: 340,
  },
  {
    ...base,
    id: 'my-clearance',
    remainingHours: 2,
    area: 'Duy Tân',
    radius: '500m',
    text: 'Thanh lý một ít đồ dùng còn tốt, hàng xóm cần thì nhắn mình nhé!',
    photos: [],
    views: 64,
    likes: 8,
    comments: 3,
    reach: 210,
  },
  {
    ...base,
    id: 'my-old-post',
    remainingHours: 0,
    area: 'Duy Tân',
    radius: '500m',
    text: 'Cuối tuần có ai đi bộ quanh khu phố cùng mình không?',
    photos: [],
    views: 52,
    likes: 5,
    comments: 2,
    reach: 180,
  },
];
export function postStatus(hours: number): Exclude<PostFilter, 'all'> {
  return hours <= 0 ? 'expired' : hours <= 4 ? 'expiring' : 'active';
}
