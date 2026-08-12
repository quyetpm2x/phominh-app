// Dữ liệu giả cho toàn bộ UI Phố Mình — KHÔNG đụng tới src/api, src/hooks, src/types (lớp hợp đồng
// backend thật). Chỉ dùng để dựng giao diện tĩnh theo thiết kế claude.ai/design (mục "chỉ UI").

export type AreaKey = 'home' | 'work' | 'nearby';

export const areas: Record<AreaKey, { label: string; place: string; radiusKm: number; color: string }> = {
  home: { label: 'Nhà', place: 'Times City, Hai Bà Trưng', radiusKm: 2, color: '#1f6f52' },
  work: { label: 'Chỗ làm', place: 'Nguyễn Chí Thanh, Đống Đa', radiusKm: 2, color: '#c9a227' },
  nearby: { label: 'Quanh đây', place: 'Lò Đúc, Hai Bà Trưng', radiusKm: 1.5, color: '#5d5950' },
};

export type PostTag =
  | 'Đồ ăn'
  | 'Cảnh báo'
  | 'Mất điện'
  | 'Hỏi đáp'
  | 'Rao vặt'
  | 'Trạng thái'
  | 'Đời sống'
  | 'Cửa hàng'
  | 'Khẩn cấp';

export interface UIPost {
  id: string;
  area: AreaKey;
  variant: 'compact' | 'full';
  author: string;
  initial: string;
  avatarColor: string;
  badge?: string;
  createdAt?: string; // ISO — chỉ có ở data thật (feed.tsx), dùng cho FreshnessBorder + sort
  expiresAt?: string | null;
  lat?: number;
  lng?: number;
  isFaved?: boolean;
  tag: PostTag;
  tagColor: 'green' | 'gold' | 'red' | 'gray';
  text: string;
  photos: number;
  imageUrl?: string | null; // URL ảnh thật (data thật từ backend) — không có thì PostPhotos dùng placeholder
  hasVideo?: boolean;
  hasVoice?: boolean;
  voiceLen?: string;
  isUrgent?: boolean;
  confirmCount?: number;
  isShop?: boolean;
  distance: string;
  timeAgo: string;
  votes: number;
  hasVoted?: boolean;
  comments: number;
  expiry: string;
  mediaNote: string;
}

export const posts: UIPost[] = [
  {
    id: 'p1',
    area: 'home',
    variant: 'full',
    author: 'Bún chả Hàng Quạt',
    initial: 'B',
    avatarColor: '#c9a227',
    badge: 'Chủ quán',
    tag: 'Đồ ăn',
    tagColor: 'gold',
    text: 'Còn 12 suất bún chả, hết là nghỉ — ship quanh 500m luôn nhé cả nhà.',
    photos: 2,
    distance: '240 m',
    timeAgo: '18 phút trước',
    votes: 34,
    comments: 6,
    expiry: 'còn 18g 42p',
    mediaNote: 'ảnh chụp tại quán',
    isShop: true,
  },
  {
    id: 'p2',
    area: 'home',
    variant: 'full',
    author: 'Chị Lan T18',
    initial: 'L',
    avatarColor: '#1f6f52',
    badge: 'Người thân quen',
    isFaved: true,
    tag: 'Mất điện',
    tagColor: 'red',
    text: 'Mất điện toà T4 từ sáng nay, gọi điện lực báo rồi nhưng chưa thấy ai qua. Ai biết tình hình cập nhật giúp với.',
    photos: 0,
    distance: '620 m',
    timeAgo: '5 giờ trước',
    votes: 58,
    comments: 24,
    expiry: 'còn 19g',
    mediaNote: 'không ảnh',
  },
  {
    id: 'p3',
    area: 'home',
    variant: 'full',
    author: 'Minh ở Times City',
    initial: 'M',
    avatarColor: '#1f6f52',
    tag: 'Cảnh báo',
    tagColor: 'red',
    text: 'Ngập cổng Times City phía đường Minh Khai, xe máy khó qua được lúc này.',
    photos: 1,
    isUrgent: true,
    confirmCount: 3,
    distance: '180 m',
    timeAgo: '4 phút trước',
    votes: 12,
    comments: 3,
    expiry: 'còn 23g 56p',
    mediaNote: 'ảnh chụp tại chỗ',
  },
  {
    id: 'p4',
    area: 'home',
    variant: 'compact',
    author: 'Anh Tuấn ngõ 12',
    initial: 'T',
    avatarColor: '#a8801a',
    tag: 'Rao vặt',
    tagColor: 'gray',
    text: 'Cho lại ít đồ chơi trẻ con còn mới, ai cần qua lấy free.',
    photos: 1,
    distance: '410 m',
    timeAgo: '1 giờ trước',
    votes: 9,
    comments: 2,
    expiry: 'còn 41g',
    mediaNote: 'ảnh chụp tại chỗ',
  },
  {
    id: 'p5',
    area: 'home',
    variant: 'compact',
    author: 'Hằng',
    initial: 'H',
    avatarColor: '#1f6f52',
    tag: 'Hỏi đáp',
    tagColor: 'gray',
    text: 'Khu mình có ai biết sửa điều hoà uy tín không, chỉ giúp em với.',
    photos: 0,
    hasVoice: true,
    voiceLen: '0:12',
    distance: '90 m',
    timeAgo: '32 phút trước',
    votes: 4,
    comments: 7,
    expiry: 'còn 47g',
    mediaNote: 'ghi âm',
  },
  {
    id: 'p6',
    area: 'work',
    variant: 'full',
    author: 'Cà phê Ngõ Nhỏ',
    initial: 'C',
    avatarColor: '#c9a227',
    badge: 'Chủ quán',
    tag: 'Đồ ăn',
    tagColor: 'gold',
    text: 'Sáng nay có mẻ bánh mì que mới ra lò, mời cả nhà ghé qua ủng hộ.',
    photos: 3,
    distance: '150 m',
    timeAgo: '9 phút trước',
    votes: 21,
    comments: 4,
    expiry: 'còn 22g',
    mediaNote: 'ảnh chụp tại quán',
    isShop: true,
  },
  {
    id: 'p7',
    area: 'work',
    variant: 'compact',
    author: 'Đức',
    initial: 'Đ',
    avatarColor: '#5d5950',
    tag: 'Trạng thái',
    tagColor: 'gray',
    text: 'Bãi gửi xe cổng sau đang sửa, gửi tạm cổng chính nhé mọi người.',
    photos: 0,
    distance: '60 m',
    timeAgo: '14 phút trước',
    votes: 6,
    comments: 1,
    expiry: 'còn 11g',
    mediaNote: 'không ảnh',
  },
];

export const postComments = [
  { id: 'c1', authorName: 'Chị Hoa T5', initial: 'H', color: '#1f6f52', content: 'Em qua lấy được không ạ, còn suất không?', timeAgo: '12 phút' },
  { id: 'c2', authorName: 'Bún chả Hàng Quạt', initial: 'B', color: '#c9a227', content: 'Dạ còn ạ, anh chị qua lấy nhé!', timeAgo: '10 phút' },
  { id: 'c3', authorName: 'Anh Dũng ngõ 8', initial: 'D', color: '#5d5950', content: 'Xác nhận vẫn còn hàng lúc 8h20, mọi người tranh thủ nhé.', timeAgo: '4 phút' },
];

export const hiddenComments = [
  { id: 'h1', authorName: 'Tài khoản mới', initial: '?', color: '#a8a297', content: 'Bình luận bị ẩn do nhiều báo cáo.', timeAgo: '18 phút' },
];

export const currentUser = {
  displayName: 'Minh ở Times City',
  initial: 'M',
  joinedMonths: 4,
  postCount: 23,
  commentCount: 87,
  trustScore: 386,
  trustTier: 'Người thân quen',
  trustTierIndex: 3,
  trustTierMax: 5,
  nextTierIn: 14,
};

export const trustRules = [
  { label: 'Bài được xác nhận hữu ích', points: '+3 điểm' },
  { label: 'Bình luận được người khác cảm ơn', points: '+1 điểm' },
  { label: 'Tài khoản xác thực đủ 30 ngày', points: '+10 điểm' },
  { label: 'Bài bị gỡ do vi phạm', points: '−20 điểm (chỉ do kiểm duyệt)' },
];

export const trustHistory = [
  { label: 'Bài "Còn 12 suất bún chả" được 8 người thấy hữu ích', time: 'hôm qua', delta: '+8' },
  { label: 'Bình luận được cảm ơn', time: '3 ngày trước', delta: '+1' },
  { label: 'Lên bậc Người thân quen', time: '2 tuần trước', delta: '' },
];

export interface ChatThread {
  id: string;
  peer: string;
  initial: string;
  color: string;
  postTitle: string;
  distance: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
  locked?: boolean;
}

export const chatThreads: ChatThread[] = [
  {
    id: 't1',
    peer: 'Bún chả Hàng Quạt',
    initial: 'H',
    color: '#c9a227',
    postTitle: 'Còn 12 suất',
    distance: '240 m',
    lastMessage: 'Dạ còn ạ, anh qua lấy nhé!',
    time: '2 phút',
    unread: true,
  },
  {
    id: 't2',
    peer: 'Chị Lan T18',
    initial: 'L',
    color: '#1f6f52',
    postTitle: 'Mất điện toà T4',
    distance: '620 m',
    lastMessage: 'Điện có lại chưa chị ơi?',
    time: '1 giờ',
  },
  {
    id: 't3',
    peer: 'Anh Tuấn ngõ 12',
    initial: 'T',
    color: '#a8801a',
    postTitle: 'Cho đồ chơi trẻ con',
    distance: '410 m',
    lastMessage: 'Bài đã hết hạn — cuộc trò chuyện đã đóng',
    time: 'hôm qua',
    locked: true,
  },
];

export const chatBubbles = [
  { fromMe: false, text: 'Chào shop, còn suất bún chả không ạ?', time: '20:10' },
  { fromMe: true, text: 'Dạ còn ạ, anh qua lấy nhé!', time: '20:11' },
  { fromMe: false, text: 'Em qua trong 5 phút nhé', time: '20:12' },
];

export const notifDigestHome = [
  { title: 'Còn 12 suất bún chả, hết là nghỉ', meta: 'Bún chả Hàng Quạt · 240 m · 34 lượt hữu ích' },
  { title: 'Mất điện toà T4 từ sáng nay', meta: 'Chị Lan T18 · 620 m · 24 bình luận' },
  { title: 'Ngập cổng Times City', meta: 'Minh ở Times City · 3 người xác nhận' },
];

export const notifDigestWork = [
  { title: 'Bánh mì que mới ra lò', meta: 'Cà phê Ngõ Nhỏ · 150 m · 21 lượt hữu ích' },
];

export const faqList = [
  { q: 'Vì sao bài đăng tự ẩn sau 24–48 giờ?', a: 'Để feed luôn là chuyện đang diễn ra, không phải kho lưu trữ cũ.' },
  { q: 'Ai xem được số điện thoại của tôi?', a: 'Không ai — trừ khi bạn chủ động bấm hiện số trên bài đăng.' },
  { q: 'Điểm uy tín tính thế nào?', a: 'Tăng dần khi bài/bình luận được xác nhận hữu ích, không ai hạ được điểm bạn.' },
  { q: 'Tôi có thể đổi khu vực bao nhiêu lần?', a: 'Tối đa 2 lần mỗi tháng để tránh nhảy khu soi tin khắp nơi.' },
];

export const termsBlocks = [
  { title: '1. Tài khoản', body: 'Một số điện thoại chỉ tạo được một tài khoản. Bạn chịu trách nhiệm về nội dung đăng dưới tên mình.' },
  { title: '2. Nội dung', body: 'Không đăng tin sai sự thật, quấy rối, hoặc vi phạm pháp luật Việt Nam. Vi phạm có thể bị xử lý theo Điều 156 Bộ luật Hình sự.' },
  { title: '3. Vị trí', body: 'Vị trí chỉ được thu thập khi bạn mở app, dùng để hiện tin quanh bạn — không theo dõi chạy nền.' },
];

export const privacyBlocks = [
  { title: 'Dữ liệu chúng tôi thu thập', body: 'Số điện thoại, vị trí lúc mở app, nội dung bạn đăng.' },
  { title: 'Ai xem được gì', body: 'Hàng xóm trong bán kính bạn chọn thấy bài đăng công khai. Số điện thoại luôn ẩn trừ khi bạn tự hiện.' },
  { title: 'Xoá dữ liệu', body: 'Xoá tài khoản sẽ xoá toàn bộ dữ liệu sau 30 ngày, theo Nghị định 13/2023.' },
];

export const filterTypes: { key: PostTag; label: string }[] = [
  { key: 'Đồ ăn', label: 'Đồ ăn' },
  { key: 'Cảnh báo', label: 'Cảnh báo' },
  { key: 'Mất điện', label: 'Mất điện' },
  { key: 'Hỏi đáp', label: 'Hỏi đáp' },
  { key: 'Rao vặt', label: 'Rao vặt' },
  { key: 'Trạng thái', label: 'Trạng thái' },
];

export const composeTypeChips = ['Đồ ăn còn hàng', 'Cảnh báo an ninh', 'Mất điện/nước', 'Hỏi đáp', 'Rao vặt', 'Khác'];

export const merchantStats = {
  weekViews: 2410,
  farthestKm: 1.8,
  weeklyTrust: 31,
  dailyBars: [40, 55, 30, 70, 90, 60, 45],
  distanceBreakdown: [
    { label: 'Dưới 500 m', pct: 62 },
    { label: '500 m – 1 km', pct: 28 },
    { label: 'Trên 1 km', pct: 10 },
  ],
};

export interface NeighborRow {
  id: string;
  name: string;
  initial: string;
  color: string;
  meta: string;
}

export const favoriteNeighbors: NeighborRow[] = [
  { id: 'n1', name: 'Chị Lan T18', initial: 'L', color: '#1f6f52', meta: '48 bài · 610 m' },
  { id: 'n2', name: 'Bún chả Hàng Quạt', initial: 'B', color: '#c9a227', meta: 'Chủ quán · 240 m' },
];

export const mutedNeighbors: NeighborRow[] = [
  { id: 'n3', name: 'Tài khoản 6 giờ tuổi', initial: '?', color: '#a8a297', meta: 'Ẩn bài viết' },
];

export const otherNeighbor = {
  name: 'Chị Lan T18',
  initial: 'L',
  color: '#1f6f52',
  badge: 'Người thân quen',
  distance: '610 m',
  joinedMonths: 11,
  postCount: 48,
  usefulCount: 312,
  reportedCount: 0,
};
