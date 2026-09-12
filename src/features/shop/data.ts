import { PHOTOS } from '../home/data';

// Local design fixtures until the shop API is connected.
export const SHOP = {
  name: 'Nguyễn Văn Quyết',
  reputation: 100,
  avatar: require('../../../assets/images/shop/avatar.png'),
  menuPhotoCount: 6,
};
export const ACTIVE_SHOP_POST = {
  title: 'Combo Hàng Xóm: Bún chả + Nước',
  image: PHOTOS.food,
  views: 245,
  votes: 36,
  comments: 12,
  calls: 18,
  remainingTime: '08:24:12',
};
export const SHOP_POSTS = [
  {
    id: 'coffee',
    title: 'Combo Cà phê sáng tặng kèm bánh mì',
    description: 'Chỉ áp dụng từ 6h30 đến 9h30 sáng nay...',
    image: PHOTOS.restaurant,
    pinned: true,
    time: '2 giờ trước',
    views: 1480,
    votes: 194,
    comments: 42,
    calls: 38,
    radius: '1.8 km',
  },
  {
    id: 'bread',
    title: 'Mẻ bánh mì giòn rụm vừa ra lò chiều nay',
    description: 'Bánh mì pate trứng nướng xá xíu đậm vị...',
    image: PHOTOS.grill,
    pinned: false,
    time: 'Hôm qua',
    views: 1120,
    votes: 138,
    comments: 19,
    calls: 27,
    radius: '2.1 km',
  },
];
export type ShopPost = (typeof SHOP_POSTS)[number];
export type ShopAction = 'menu' | 'payments';
export const WEEKLY_VIEWS = [350, 480, 210, 640, 850, 620, 270];
export const formatCount = (value: number) => value.toLocaleString('vi-VN');
