import type { ImageSourcePropType } from 'react-native';
export interface MessageContact {
  id: string;
  name: string;
  shortName: string;
  avatar: ImageSourcePropType;
  merchant?: boolean;
}
export const CONTACTS: MessageContact[] = [
  {
    id: 'hoa',
    name: 'Cô Hoa Bún Chả',
    shortName: 'Cô Hoa',
    avatar: require('../../../assets/messages/hoa.png'),
    merchant: true,
  },
  {
    id: 'nam',
    name: 'A. Nam Tạp hoá Duy Tân',
    shortName: 'A. Nam Tạp hoá',
    avatar: require('../../../assets/messages/nam.png'),
    merchant: true,
  },
  {
    id: 'binh',
    name: 'Bác Bình - Tổ Dân Phố 8',
    shortName: 'Bác Bình',
    avatar: require('../../../assets/messages/binh.png'),
  },
  {
    id: 'leader',
    name: 'Tổ trưởng',
    shortName: 'Tổ trưởng',
    avatar: require('../../../assets/messages/leader.png'),
  },
  {
    id: 'lan-salon',
    name: 'Lan Hair Salon',
    shortName: 'Lan Tóc',
    avatar: require('../../../assets/messages/lan.png'),
  },
];
export interface Conversation {
  contact: MessageContact;
  badge: string;
  time: string;
  text: string;
  unread: number;
  online: boolean;
  kind: 'text' | 'read' | 'image';
}
export const CONVERSATIONS: Conversation[] = [
  {
    contact: CONTACTS[0],
    badge: '150m',
    time: 'Vừa xong',
    text: 'Dạ cô để riêng cho cháu 2 suất nhé, tí cháu chạy qua lấy liền!',
    unread: 3,
    online: true,
    kind: 'text',
  },
  {
    contact: CONTACTS[1],
    badge: '300m',
    time: '15p',
    text: 'Nước khoáng đóng thùng mới về đủ rồi nha anh Quyết ơi.',
    unread: 0,
    online: true,
    kind: 'text',
  },
  {
    contact: CONTACTS[2],
    badge: 'Tổ dân phố',
    time: '2h',
    text: 'Cháu đã nhận được thông báo lịch cắt điện luân phiên rồi ạ.',
    unread: 0,
    online: false,
    kind: 'read',
  },
  {
    contact: CONTACTS[4],
    badge: '500m',
    time: 'Hôm qua',
    text: '[Hình ảnh] Mẫu tóc nam uốn phồng vừa xong',
    unread: 0,
    online: false,
    kind: 'image',
  },
];
const normalize = (text: string) =>
  text
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
export function matchesMessage(query: string, ...parts: string[]) {
  return normalize(parts.join(' ')).includes(normalize(query.trim()));
}
