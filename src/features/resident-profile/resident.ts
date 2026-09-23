import { router } from 'expo-router';
import { LOCAL_USER_ID } from '../../lib/personalProfile';
import { POSTS } from '../home/data';
import { NEIGHBORS } from '../priority-neighbors/data';

export function openResidentProfile(authorId: string) {
  if (authorId === LOCAL_USER_ID) router.push('/home?tab=profile');
  else router.push({ pathname: '/resident/[id]', params: { id: authorId } });
}

export function findResident(id: string) {
  const posts = POSTS.filter((post) => post.authorId === id);
  const author = posts[0];
  const neighbor = NEIGHBORS.find((item) => item.id === id);
  if ((!author && !neighbor) || id === LOCAL_USER_ID) return null;
  const hoa = id === 'hoa';
  return {
    id,
    name: author?.name ?? neighbor!.name,
    avatar: hoa ? require('../../../assets/resident-profile/hoa.png') : (author?.avatar ?? neighbor!.avatar),
    merchant: author?.merchant ?? neighbor?.badge === 'Chủ quán',
    rank: author?.rank ?? 'Cư dân',
    distance: author?.distance ?? `${neighbor!.distance}m`,
    area: hoa ? 'Khu Duy Tân, Cầu Giấy' : (author?.location?.address ?? neighbor?.address ?? 'Trong khu phố'),
    bio: hoa
      ? 'Quán bún chả gia truyền 15 năm tại Ngõ 82 Duy Tân. Bán từ 6:30 sáng đến 14:00 chiều mỗi ngày.'
      : 'Hàng xóm cùng chia sẻ tin tức trong khu phố.',
    // Figma preview metrics until the resident API is available.
    trust: hoa ? '98.5%' : neighbor ? `${neighbor.reputation}%` : '—',
    totalPosts: hoa ? '124' : String(neighbor?.posts ?? posts.length),
    acquaintances: hoa ? '1.8k' : '—',
    posts,
  };
}
export type Resident = NonNullable<ReturnType<typeof findResident>>;
