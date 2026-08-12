import { Redirect } from 'expo-router';

// Tab "+" luôn chặn điều hướng ở _layout (mở thẳng camera) — file này chỉ tồn tại để Expo Router
// có route đăng ký cho tab, phòng trường hợp preventDefault không chặn kịp (ví dụ deep link).
export default function CreateTabFallback() {
  return <Redirect href="/post/create/camera" />;
}
