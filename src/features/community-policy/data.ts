export const COMMUNITY_RULES = [
  {
    title: '1. Khuyến khích chia sẻ hữu ích',
    subtitle: 'Tích lũy điểm uy tín & nhận thưởng bài viết',
    badge: '+ UY TÍN',
    icon: 'communityPositive',
    color: '#009966',
    dot: '#00BC7D',
    background: '#00BC7D1A',
    items: [
      [
        'Cảnh báo tức thời & Giao thông',
        'Ngập nước, kẹt xe, sự cố điện nước, nhắc nhở an ninh trật tự quanh ngõ xóm.',
      ],
      [
        'Mẹo hay xóm phố & Quán ngon chuẩn vị',
        'Đánh giá hàng quán địa phương chân thực, chợ dân sinh, địa chỉ thợ sửa chữa uy tín.',
      ],
      [
        'Hỗ trợ khẩn cấp & Tìm kiếm lân cận',
        'Tìm đồ thất lạc, thú cưng đi lạc quanh khu vực, hỗ trợ người già cần trợ giúp gấp.',
      ],
    ],
  },
  {
    title: '2. Hành vi & Nội dung nghiêm cấm',
    subtitle: 'Xử phạt nghiêm khắc & khóa tài khoản',
    badge: 'NGHIÊM CẤM',
    icon: 'communityProhibited',
    color: '#E63946',
    dot: '#E63946',
    background: '#E639461A',
    items: [
      [
        'Tin giả mạo & Giật gân chưa kiểm chứng',
        'Tung tin đồn thất thiệt gây hoang mang dư luận và ảnh hưởng xấu đến đời sống cư dân.',
      ],
      [
        'Bôi nhọ danh dự & Lộ danh tính (Doxxing)',
        'Xúc phạm cá nhân, quay chụp lén ác ý, công khai số điện thoại hoặc địa chỉ nhà riêng trái phép.',
      ],
      [
        'Spam rác, Lừa đảo & Cờ bạc trá hình',
        'Quảng cáo app cờ bạc, đường dẫn độc hại, cho vay nóng hoặc làm dịch vụ seeding sai sự thật.',
      ],
      [
        'Giả lập vị trí GPS để quấy rối',
        'Sử dụng công cụ thay đổi tọa độ để spam tin vào các khu vực không thuộc phạm vi sinh sống thực tế.',
      ],
    ],
  },
] as const;
