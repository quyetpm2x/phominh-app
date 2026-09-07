// Preview contacts from Figma; replace with the friend list when messaging is connected.
export const SHARE_FRIENDS = [
  { name: 'Tuấn Kiệt', avatar: require('../../../assets/images/share/tuan-kiet.png'), online: true },
  { name: 'Hoàng Long', avatar: require('../../../assets/images/share/hoang-long.png'), online: true },
  { name: 'Thu Trang', avatar: require('../../../assets/images/share/thu-trang.png'), online: false },
  { name: 'Minh Đức', avatar: require('../../../assets/images/share/minh-duc.png'), online: false },
] as const;

export const SHARE_OPTIONS = [
  { id: 'link', label: 'Sao chép\nlink', icon: 'shareLink', background: '#FF416C1A' },
  { id: 'messenger', label: 'Messenger', icon: 'shareMessenger', background: '#0084FF1A' },
  { id: 'zalo', label: 'Zalo', icon: 'shareZalo', background: '#0068FF1A' },
  { id: 'qr', label: 'Mã QR', icon: 'shareQr', background: '#F1F3F5' },
] as const;
