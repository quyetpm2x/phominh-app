import type { ImageSourcePropType } from 'react-native';
export type HiddenKind = 'user' | 'place' | 'post' | 'topic';
export interface HiddenItem {
  id: string;
  kind: HiddenKind;
  name: string;
  detail: string;
  date?: string;
  image?: ImageSourcePropType;
  preview?: boolean;
}
// Design preview entries; actual feed exclusions are merged by useHiddenItems.
export const HIDDEN_PREVIEWS: HiddenItem[] = [
  {
    id: 'preview-hoang',
    image: require('../../../assets/hidden-items/hoang.png'),
    kind: 'user',
    name: 'Hoàng Bất Động Sản',
    detail: 'Lý do: Đăng bài quảng cáo, rao vặt nhiều',
    date: '15/03/2025',
    preview: true,
  },
  {
    id: 'preview-shop',
    kind: 'place',
    name: 'Quán Nhậu Đêm 88',
    detail: 'Lý do: Không phù hợp với nhu cầu của tôi',
    date: '10/03/2025',
    image: require('../../../assets/hidden-items/shop.png'),
    preview: true,
  },
  {
    id: 'preview-loan',
    kind: 'user',
    name: 'Thanh Loan Phụ Kiện',
    detail: 'Lý do: Tin nhắn trùng lặp',
    date: '02/03/2025',
    image: require('../../../assets/hidden-items/loan.png'),
    preview: true,
  },
  {
    id: 'preview-post',
    kind: 'post',
    name: 'Bài viết: "Cần sang nhượng quán gấp..."',
    detail: 'Tác giả: Minh Tuấn • Cách 400m',
    date: '28/02/2025',
    preview: true,
  },
];
export type HiddenFilter = 'all' | 'users' | 'posts' | 'topics';
export function filterHiddenItems(items: HiddenItem[], filter: HiddenFilter) {
  return items.filter(
    (item) =>
      filter === 'all' ||
      (filter === 'users'
        ? item.kind === 'user' || item.kind === 'place'
        : filter === 'posts'
          ? item.kind === 'post'
          : item.kind === 'topic'),
  );
}
