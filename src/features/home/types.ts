import type { ImageSourcePropType } from 'react-native';
export type AreaTab = 'nearby' | 'home' | 'work';
export type Filter = 'all' | 'shops' | 'neighbors';
export type Sheet =
  | 'preferences'
  | 'filter'
  | 'map'
  | 'gallery'
  | 'comments'
  | 'contact'
  | 'details'
  | 'notifications'
  | 'profile'
  | 'compose'
  | null;

export interface FeedPost {
  id: string;
  authorId: string;
  name: string;
  badge: string;
  color: string;
  avatar: ImageSourcePropType;
  rank: string;
  time: string;
  distance: string;
  likes: number;
  comments: number;
  merchant: boolean;
  text: string;
  photos: readonly ImageSourcePropType[];
}
