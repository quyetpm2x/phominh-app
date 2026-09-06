import type { ImageSourcePropType } from 'react-native';
import { PHOTOS } from '../home/data';

export interface PostComment {
  id: string;
  name: string;
  avatar?: ImageSourcePropType;
  time: string;
  text: string;
  hidden?: boolean;
}
// Figma includes two visible rows and a total of three comments; no API yet.
export const SAMPLE_COMMENTS: readonly PostComment[] = [
  {
    id: 'quyet',
    name: 'Nguyễn Văn Quyết',
    avatar: PHOTOS.me,
    time: '5 phút trước',
    text: 'Cháu đăng ký 2 suất nha cô, 5 phút nữa cháu chạy qua ạ.',
  },
  {
    id: 'minh',
    name: 'Minh Trần',
    avatar: require('../../../assets/images/post-detail/minh.png'),
    time: '8 phút trước',
    text: 'Bình luận này đã bị ẩn bởi chủ bài viết.',
    hidden: true,
  },
];
