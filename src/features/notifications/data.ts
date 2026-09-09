export type NotificationType = 'comment' | 'reward' | 'shop' | 'likes' | 'reputation' | 'feature';
export type NotificationCategory = 'interaction' | 'rewards' | 'shops' | 'system';
export type NotificationFilter = 'all' | NotificationCategory;
export interface NotificationItem {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  subtitle?: string;
  body?: string;
  quote?: string;
  time: string;
  read: boolean;
  initial?: string;
  metadata?: string;
  action?: string;
}
// Display fixtures only. The screen owns all mutable notification state.
export const INITIAL_NOTIFICATIONS: readonly NotificationItem[] = [
  {
    id: 'comment',
    type: 'comment',
    category: 'interaction',
    title: 'Linh Chi',
    subtitle: ' đã bình luận',
    quote: '"Quán Phở Bò 34 này nước dùng thanh thật sự, đi 2 người ăn no nê chỉ hết 80k C"',
    time: '5p trước',
    read: false,
    initial: 'L',
    metadata: 'Duy Tân, Cầu Giấy',
    action: 'Xem ngay',
  },
  {
    id: 'reward',
    type: 'reward',
    category: 'rewards',
    title: 'Bạn nhận được',
    subtitle: ' +25.000đ',
    body: 'Thưởng bài viết chất lượng tuần này từ Ban quản trị Phố Mình Duy Tân.',
    time: '1 giờ trước',
    read: false,
    metadata: 'Ví: 145.000đ',
    action: 'Rút tiền',
  },
  {
    id: 'shop',
    type: 'shop',
    category: 'shops',
    title: 'Cà phê Muối Chú Long',
    subtitle: ' vừa mở bán',
    body: 'Cách bạn 350m • Đang có chương trình tặng bánh ngọt khai trương.',
    time: '3 giờ trước',
    read: false,
    metadata: 'Giảm 20%',
    action: '12 bài chia sẻ',
  },
  {
    id: 'likes',
    type: 'likes',
    category: 'interaction',
    title: 'Minh Hoàng',
    subtitle: ' và 14 người khác đã thích bài viết',
    body: '"Review quán Bún chả Hàng Than ngõ 7 Duy Tân..."',
    time: 'Hôm qua',
    read: true,
    initial: 'M',
  },
  {
    id: 'reputation',
    type: 'reputation',
    category: 'rewards',
    title: 'Điểm uy tín đạt mốc',
    subtitle: ' 98/100',
    body: 'Bạn đã được cấp huy hiệu Người quen uy tín trong khu vực Duy Tân.',
    time: '2 ngày trước',
    read: true,
  },
  {
    id: 'feature',
    type: 'feature',
    category: 'system',
    title: 'Cập nhật tính năng: Đăng tin bằng giọng nói',
    body: 'Trải nghiệm tạo bài viết và chia sẻ quán ăn siêu tốc chỉ với giọng nói tiếng Việt.',
    time: '4 ngày trước',
    read: true,
  },
];
export const NOTIFICATION_FILTERS = [
  { key: 'all', label: 'Tất cả', icon: 'shareQr' },
  { key: 'interaction', label: 'Tương tác', icon: 'feedComment' },
  { key: 'rewards', label: 'Thưởng & Điểm', icon: 'extendGift' },
  { key: 'shops', label: 'Quán xá', icon: 'feedShop' },
  { key: 'system', label: 'Hệ thống', icon: 'editInfo' },
] as const;
