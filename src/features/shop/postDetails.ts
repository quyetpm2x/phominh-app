import { LOCAL_USER_ID } from '../../lib/personalProfile';
import type { FeedPost } from '../home/types';
import { SHOP, type ShopPost } from './data';

// Local analytics fixtures, keyed by the same IDs as the dashboard cards.
export const SHOP_POST_ANALYTICS: Record<
  string,
  {
    postedAt: string;
    remainingHours: number;
    residents: number;
    likes: number;
    hearts: number;
    replied: number;
    distances: { label: string; views: number }[];
    hours: { label: string; views: number; caption: string; peak?: boolean }[];
  }
> = {
  coffee: {
    postedAt: '07:15 • Hôm nay',
    remainingHours: 14,
    residents: 1120,
    likes: 148,
    hearts: 46,
    replied: 39,
    distances: [
      { label: 'Dưới 500m (Đi bộ gần quán)', views: 580 },
      { label: '500m - 1.2km (Trong cùng phường)', views: 620 },
      { label: '1.2km - 1.8km (Phường lân cận)', views: 280 },
    ],
    hours: [
      { label: '07:00 - 09:00', views: 640, caption: 'Cao điểm nhất', peak: true },
      { label: '11:30 - 13:00', views: 410, caption: 'Giờ trưa' },
      { label: '18:00 - 20:00', views: 280, caption: 'Buổi tối' },
    ],
  },
};

export function shopPostToFeedPost(post: ShopPost): FeedPost {
  return {
    id: post.id,
    authorId: LOCAL_USER_ID,
    name: SHOP.name,
    avatar: SHOP.avatar,
    badge: 'CHỦ QUÁN',
    color: '#FF416C',
    rank: '',
    time: post.time,
    distance: post.radius,
    merchant: true,
    text: `${post.title}\n${post.description}`,
    photos: [post.image],
    views: post.views,
    likes: post.votes,
    comments: post.comments,
    remainingHours: SHOP_POST_ANALYTICS[post.id]?.remainingHours,
  };
}
