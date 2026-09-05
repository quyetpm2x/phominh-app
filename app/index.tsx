import { router } from 'expo-router';
import { useState } from 'react';

import { Splash } from '../src/components/Splash';

// Luồng mở app hiện luôn đi Splash -> Welcome. Các nhánh phiên đăng nhập/hồ sơ cũ đã được dọn bỏ,
// còn bước OTP sẽ nối tiếp sau màn nhập số điện thoại.
export default function Index() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <Splash
        onDone={() => {
          setShowSplash(false);
          router.replace('/(auth)/welcome');
        }}
      />
    );
  }

  return null;
}
