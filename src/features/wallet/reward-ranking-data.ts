const topMembers = [
  { name: 'Lan Chi', score: '2.450', image: require('../../../assets/images/reward-ranking/member-7.png'), rank: 2 },
  { name: 'Anh Tuấn T4', score: '2.890', image: require('../../../assets/images/reward-ranking/member-8.png'), rank: 1 },
  { name: 'Quốc Bảo', score: '2.120', image: require('../../../assets/images/reward-ranking/member-9.png'), rank: 3 },
] as const;

export type CommunityMember = {
  rank: number;
  name: string;
  meta: string;
  score: string;
  reward: string;
  image: import('react-native').ImageSourcePropType;
  current?: boolean;
};

export const communityMembers: CommunityMember[] = [
  { rank: 4, name: 'Hoàng Yến', meta: '18 bài viết · 14 menu', score: '1.890', reward: '+500.000đ', image: require('../../../assets/images/reward-ranking/member-0.png') },
  { rank: 5, name: 'Minh Đức Food', meta: '15 bài viết · 15 menu', score: '1.640', reward: '+300.000đ', image: require('../../../assets/images/reward-ranking/member-1.png') },
  { rank: 6, name: 'Thuỳ Dương', meta: '12 bài viết · 10 menu', score: '1.410', reward: '+200.000đ', image: require('../../../assets/images/reward-ranking/member-2.png') },
  { rank: 7, name: 'Nguyễn Văn Quyết', meta: '11 bài viết · 9 menu', score: '1.240', reward: '+200.000đ', image: require('../../../assets/images/reward-ranking/member-3.png'), current: true },
  { rank: 8, name: 'Trần Thanh Hải', meta: '10 bài viết · 8 menu', score: '1.180', reward: '+150.000đ', image: require('../../../assets/images/reward-ranking/member-4.png') },
  { rank: 9, name: 'Bảo Ngọc Coffee', meta: '9 bài viết · 7 menu', score: '1.095', reward: '+100.000đ', image: require('../../../assets/images/reward-ranking/member-5.png') },
  { rank: 10, name: 'Phan Gia Huy', meta: '8 bài viết · 8 menu', score: '980', reward: '+100.000đ', image: require('../../../assets/images/reward-ranking/member-6.png') },
] as const;

export const podium = [
  { ...topMembers[0], reward: '2.000.000đ', tone: 'silver' },
  { ...topMembers[1], reward: '3.500.000đ', tone: 'gold' },
  { ...topMembers[2], reward: '1.000.000đ', tone: 'bronze' },
] as const;

