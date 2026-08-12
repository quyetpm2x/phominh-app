import { router } from 'expo-router';
import { useRef, useState } from 'react';

import { checkSession } from '../src/api/client';
import { Splash } from '../src/components/Splash';

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  // Kiểm tra phiên đăng nhập NGAY lúc mount, chạy song song với animation Splash (~2.95s) — tránh
  // cộng thêm độ trễ cảm nhận được, vì lúc Splash xong thì kết quả thường đã có sẵn.
  const sessionPromiseRef = useRef<Promise<boolean> | null>(null);
  if (!sessionPromiseRef.current) {
    sessionPromiseRef.current = checkSession();
  }

  if (showSplash) {
    return (
      <Splash
        onDone={async () => {
          const loggedIn = await sessionPromiseRef.current;
          setShowSplash(false);
          router.replace(loggedIn ? '/(main)/feed' : '/(auth)/welcome');
        }}
      />
    );
  }

  return null;
}
