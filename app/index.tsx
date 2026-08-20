import { router } from 'expo-router';
import { useRef, useState } from 'react';

import { checkSession, type UserProfile } from '../src/api/client';
import { Splash } from '../src/components/Splash';
import { isProfileComplete } from '../src/lib/profileCompleteness';

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  // Kiểm tra phiên đăng nhập NGAY lúc mount, chạy song song với animation Splash (~2.95s) — tránh
  // cộng thêm độ trễ cảm nhận được, vì lúc Splash xong thì kết quả thường đã có sẵn.
  const sessionPromiseRef = useRef<Promise<UserProfile | null> | null>(null);
  if (!sessionPromiseRef.current) {
    sessionPromiseRef.current = checkSession();
  }

  if (showSplash) {
    return (
      <Splash
        onDone={async () => {
          const profile = await sessionPromiseRef.current;
          setShowSplash(false);
          if (!profile) {
            router.replace('/(auth)/welcome');
          } else if (isProfileComplete(profile)) {
            router.replace('/(main)/feed');
          } else {
            // Bắt buộc bổ sung hồ sơ (quyết định 2026-08-20) — áp dụng cả user CŨ đăng nhập lại,
            // không chỉ tài khoản mới, xem isProfileComplete().
            router.replace('/(auth)/personal-info');
          }
        }}
      />
    );
  }

  return null;
}
