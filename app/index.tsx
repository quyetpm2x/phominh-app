import { router } from 'expo-router';
import { useState } from 'react';

import { Splash } from '../src/components/Splash';

// Đơn giản hoá 2026-08-29 — dọn sạch chỉ còn 3 màn (Splash/Welcome/Phone-input, xem
// tai-lieu-chuc-nang.md), bỏ nhánh kiểm tra phiên đăng nhập/hồ sơ cá nhân vì đích đến của các
// nhánh đó (feed, personal-info) đã bị xoá cùng đợt — luôn về thẳng welcome sau khi Splash xong.
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
