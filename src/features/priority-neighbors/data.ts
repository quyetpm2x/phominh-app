import type { ImageSourcePropType } from 'react-native';
export interface PriorityNeighbor {
  id: string;
  name: string;
  badge: string;
  address: string;
  color: string;
  background: string;
  avatar: ImageSourcePropType;
  posts: number;
  reputation: number;
  distance: number;
  postId?: string;
}
// Preview directory and statistics from Figma until the neighborhood API is connected.
export const NEIGHBORS: PriorityNeighbor[] = [
  {
    id: 'hoa',
    name: 'Cô Hoa Bún Chả',
    badge: 'Chủ quán',
    address: 'Số 12 Ngõ 45 Cự Lộc',
    color: '#E17100',
    background: '#FE9A001A',
    avatar: require('../../../assets/priority-neighbors/hoa.png'),
    posts: 142,
    reputation: 98,
    distance: 150,
    postId: 'hoa',
  },
  {
    id: 'tuan',
    name: 'Anh Tuấn T4',
    badge: 'Hàng xóm',
    address: 'Phòng 1204 Toà T4 Times City',
    color: '#009966',
    background: '#00BC7D1A',
    avatar: require('../../../assets/priority-neighbors/tuan.png'),
    posts: 68,
    reputation: 100,
    distance: 45,
    postId: 'tuan',
  },
  {
    id: 'lan',
    name: 'Chị Lan Times City',
    badge: 'Bạn cư dân',
    address: 'Phòng 0802 Toà T2 Times City',
    color: '#155DFC',
    background: '#2B7FFF1A',
    avatar: require('../../../assets/priority-neighbors/lan.png'),
    posts: 35,
    reputation: 96,
    distance: 280,
  },
  {
    id: 'hung',
    name: 'Bác Hùng Bảo Vệ T4',
    badge: 'BQL Toà nhà',
    address: 'Toà T4 Times City',
    color: '#009966',
    background: '#00BC7D1A',
    avatar: require('../../../assets/priority-neighbors/hung.png'),
    posts: 89,
    reputation: 99,
    distance: 50,
  },
];
export const INITIAL_PRIORITY_IDS = ['hoa', 'tuan', 'lan'];
export type NeighborFilter = 'all' | 'shops' | 'residents';
export function filterNeighbors(items: PriorityNeighbor[], query: string, filter: NeighborFilter) {
  const normalize = (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
  const search = normalize(query.trim());
  return items.filter(
    (item) =>
      (filter === 'all' || (filter === 'shops' ? item.badge === 'Chủ quán' : item.badge !== 'Chủ quán')) &&
      normalize(`${item.name} ${item.address} ${item.badge}`).includes(search),
  );
}
export function restorePriorityIds(raw: string | null) {
  if (raw === null) return [...INITIAL_PRIORITY_IDS];
  try {
    const ids: unknown = JSON.parse(raw);
    return Array.isArray(ids)
      ? [
          ...new Set(
            ids.filter((id): id is string => typeof id === 'string' && NEIGHBORS.some((n) => n.id === id)),
          ),
        ]
      : [...INITIAL_PRIORITY_IDS];
  } catch {
    return [...INITIAL_PRIORITY_IDS];
  }
}
