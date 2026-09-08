import type { FeedPost } from '../home/types';

export interface PostAnalytics {
  radius: string;
  area: string;
  growth: number;
  distances: { label: string; percent: number; color: string }[];
  peak: string;
  hours: { label: string; height: number; color: string; peak?: boolean }[];
  residents: number;
}

// Per-post demo analytics. Replace this lookup with the statistics API later.
export const DEMO_ANALYTICS: Record<string, PostAnalytics> = {
  'my-demo-post': {
    radius: '500m',
    area: 'Khu vực Duy Tân, Cầu Giấy',
    growth: 24.5,
    distances: [
      { label: '0 - 200m (Hàng xóm gần quanh ngõ)', percent: 58, color: '#FF416C' },
      { label: '200m - 500m (Cùng khu phố lân cận)', percent: 24, color: '#FF416CBF' },
      { label: '> 500m (Khách vãng lai ngoài bán kính)', percent: 18, color: '#4A4A4A59' },
    ],
    peak: '11:30',
    hours: [
      { label: '08h', height: 21, color: '#FF416C33' },
      { label: '09h', height: 37, color: '#FF416C4D' },
      { label: '10h', height: 58, color: '#FF416C80' },
      { label: '11h', height: 66, color: '#FF416C', peak: true },
      { label: '12h', height: 66, color: '#FF416CB3' },
      { label: '13h', height: 29, color: '#FF416C66' },
    ],
    residents: 64,
  },
};

export function getPostMetrics(post: FeedPost, extraLikes = 0, extraComments = 0) {
  const views = post.views ?? 0;
  const interactions = post.likes + post.comments + extraLikes + extraComments;
  return { views, interactions, rate: views ? ((interactions / views) * 100).toFixed(1) : '0.0' };
}

// Keep rounded distance counts equal to the post's total views.
export function distanceCounts(views: number, analytics: PostAnalytics) {
  let remaining = views;
  return analytics.distances.map((row, index) => {
    const count =
      index === analytics.distances.length - 1 ? remaining : Math.round((views * row.percent) / 100);
    remaining -= count;
    return count;
  });
}
