export const POLICY_DATE = '15/03/2025';
export const PRIVACY_EMAIL = 'privacy@bantinbankinh.vn';
export const POLICY_INTRO =
  'Chúng tôi cam kết tôn trọng và bảo vệ quyền riêng tư cá nhân cùng dữ liệu vị trí địa lý của bạn khi sử dụng Bản Tin Bán Kính.';
// Policy copy supplied by Figma frame 1:14463.
export const POLICY_SECTIONS = [
  {
    icon: 'policyLocation',
    title: '1. Thu thập và Xử lý Dữ liệu Vị trí',
    body: 'Ứng dụng cần quyền truy cập vị trí địa lý của thiết bị nhằm hiển thị các bài đăng, sự kiện và cảnh báo trong bán kính bạn thiết lập (từ 500m đến 5km). Dữ liệu vị trí GPS được làm mờ bán kính nhằm bảo vệ an toàn cho nhà riêng của bạn.',
  },
  {
    icon: 'policyProfile',
    title: '2. Thông tin Tài khoản & Hồ sơ',
    body: 'Khi đăng ký, chúng tôi thu thập số điện thoại (để xác thực OTP), tên hiển thị và ảnh đại diện do bạn cung cấp. Số điện thoại được bảo mật tuyệt đối và không hiển thị công khai cho những người dùng khác.',
  },
  {
    icon: 'policyLock',
    title: '3. Cam kết Không Chia sẻ cho Bên thứ Ba',
    body: 'Chúng tôi cam kết không bán, trao đổi hoặc chia sẻ thông tin nhận dạng cá nhân của bạn cho bất kỳ đơn vị quảng cáo hay bên thứ ba nào vì mục đích thương mại, trừ trường hợp có yêu cầu từ cơ quan pháp luật có thẩm quyền.',
  },
  {
    icon: 'policyPayment',
    title: '4. Bảo mật Thông tin Thanh toán & Rút tiền',
    body: 'Thông tin số tài khoản ngân hàng bạn liên kết để nhận thưởng được mã hoá theo tiêu chuẩn an toàn thanh toán và chỉ được sử dụng cho mục đích chuyển khoản trả thưởng.',
  },
  {
    icon: 'policyDelete',
    title: '5. Quyền Xoá Dữ liệu & Tài khoản',
    body: 'Bạn có toàn quyền yêu cầu xoá vĩnh viễn tài khoản và toàn bộ bài viết, hình ảnh, lịch sử hoạt động thông qua mục Cài đặt > Đăng xuất & Xoá tài khoản bất kỳ lúc nào.',
  },
] as const;
