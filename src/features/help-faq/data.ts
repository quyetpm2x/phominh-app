export const FAQ_TOPICS = [
  { id: 'radius', label: 'Bán kính', icon: 'faqRadius', background: '#FF416C1A' },
  { id: 'trust', label: 'Uy tín', icon: 'faqTrust', background: '#00BC7D1A' },
  { id: 'wallet', label: 'Ví thưởng', icon: 'faqWallet', background: '#2B7FFF1A' },
  { id: 'shop', label: 'Tài khoản\nquán', icon: 'faqShop', background: '#FE9A001A' },
] as const;
export type FaqTopic = (typeof FAQ_TOPICS)[number]['id'];
export const FAQ_ITEMS = [
  {
    id: 'radius',
    topic: 'radius',
    question: 'Bán kính hoạt động khu phố được tính như thế nào?',
    answer:
      'Ứng dụng hiển thị tin tức dựa trên toạ độ thực tế của bạn hoặc vị trí đã thiết lập (Nhà/Chỗ làm). Bạn có thể lọc dòng tin từ 500m (chỉ trong tổ dân phố) đến tối đa 5km (toàn phường/quận lân cận).',
  },
  {
    id: 'trust',
    topic: 'trust',
    question: 'Làm sao để tăng Điểm uy tín trên ứng dụng?',
    answer:
      'Bạn có thể tăng điểm uy tín bằng cách: Đăng tin tức hữu ích được hàng xóm bấm "Xác nhận tin đúng", tham gia bình luận tích cực, xác minh danh tính và mời bạn bè trong cùng khu vực tham gia.',
  },
  {
    id: 'wallet',
    topic: 'wallet',
    question: 'Rút tiền từ Ví thưởng mất bao lâu thì nhận được?',
    answer:
      'Hệ thống xử lý lệnh rút tiền tự động qua Napas 247 trong vòng 5 - 15 phút. Trường hợp tài khoản mới rút lần đầu có thể mất từ 2 - 4 giờ để kiểm duyệt tính hợp lệ.',
  },
  {
    id: 'appeal',
    topic: 'trust',
    question: 'Làm thế nào nếu bị trừ điểm uy tín hoặc phạt oan?',
    answer:
      'Bạn có thể vào mục Điểm uy tín > Lịch sử phạt và nhấn "Khiếu nại phạt oan". Cung cấp bằng chứng xác thực (hình ảnh thực tế), ban quản trị sẽ xem xét hoàn trả điểm trong vòng 24 giờ.',
  },
  {
    id: 'shop',
    topic: 'shop',
    question: 'Làm sao để đăng ký tài khoản Quán xóm phố?',
    answer:
      'Truy cập vào tab Quán > Đăng ký tài khoản quán, điền tên quán, địa chỉ chính xác và tải lên ảnh thực tế menu/biển hiệu để được cấp tích xanh kinh doanh.',
  },
] as const;
export type FaqItem = (typeof FAQ_ITEMS)[number];
function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim();
}
export function filterFaq(query: string, topic: FaqTopic | null) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return FAQ_ITEMS.filter(
    (item) =>
      (!topic || item.topic === topic) &&
      terms.every((term) => normalize(`${item.question} ${item.answer}`).includes(term)),
  );
}
