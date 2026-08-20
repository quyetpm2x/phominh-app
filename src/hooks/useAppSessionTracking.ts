import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { closeAppSession, startAppSession } from '../api/endpoints/appSessions';

// Theo dõi phiên mở/đóng app THẬT (bổ sung ngoài 117 mục gốc, thảo luận 2026-08-17) — 1 phiên = 1
// lần app ở foreground liên tục. Cố tình KHÔNG dùng heartbeat định kỳ (tốn pin) — chỉ ghi lúc bắt
// đầu + lúc chuyển nền. Có thể mất lúc đóng nếu app bị crash/force-kill (hiếm, OS luôn chuyển
// background trước khi kill trong thao tác thoát bình thường) — chấp nhận thiếu sót nhỏ này, phía
// admin tự cap thời lượng bất thường khi tính trung bình (xem UserActivityService).
export function useAppSessionTracking(): void {
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const open = () => {
      startAppSession()
        .then((id) => {
          if (!cancelled) sessionIdRef.current = id;
        })
        .catch(() => undefined);
    };

    const close = () => {
      const id = sessionIdRef.current;
      sessionIdRef.current = null;
      if (id) void closeAppSession(id).catch(() => undefined);
    };

    open();

    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        close();
      } else if (nextState === 'active' && !sessionIdRef.current) {
        open();
      }
    });

    return () => {
      cancelled = true;
      sub.remove();
      close();
    };
  }, []);
}
