import { Animated } from 'react-native';

export interface RingSpec {
  size: number;
  kind: 'pulse' | 'ping' | 'spin';
  peakOpacity: number;
  durationMs: number;
}

// 8 vòng tròn đồng tâm quanh badge — kích thước đã thu nhỏ theo tỉ lệ so với mockup gốc (thiết kế
// cho viewport desktop) để phù hợp màn hình di động, vòng ngoài cùng vẫn tràn ra ngoài viền màn
// hình có chủ ý (root View overflow:hidden tự cắt, giống hiệu ứng "bleed" trong mockup gốc).
export const RINGS: RingSpec[] = [
  { size: 360, kind: 'pulse', peakOpacity: 0.05, durationMs: 7000 },
  { size: 320, kind: 'ping', peakOpacity: 0.2, durationMs: 6000 },
  { size: 275, kind: 'pulse', peakOpacity: 0.15, durationMs: 5000 },
  { size: 235, kind: 'spin', peakOpacity: 0.25, durationMs: 30000 },
  { size: 200, kind: 'ping', peakOpacity: 0.3, durationMs: 4500 },
  { size: 165, kind: 'pulse', peakOpacity: 0.3, durationMs: 3500 },
  { size: 130, kind: 'ping', peakOpacity: 0.4, durationMs: 3000 },
  { size: 100, kind: 'pulse', peakOpacity: 0.45, durationMs: 2000 },
];

interface SplashRingsProps {
  ringValues: Animated.Value[];
  pink: string;
  orange: string;
}

// Tách khỏi Splash.tsx (đã vượt 250 dòng) — chỉ phần render, animation setup vẫn ở Splash.tsx vì
// cần chạy trong cùng useEffect với các animation khác (badge/title/tagline/pill).
export function SplashRings({ ringValues, pink, orange }: SplashRingsProps) {
  return (
    <>
      {RINGS.map((ring, i) => {
        const value = ringValues[i];
        if (ring.kind === 'pulse') {
          return (
            <Animated.View
              key={i}
              pointerEvents="none"
              style={{
                position: 'absolute',
                width: ring.size,
                height: ring.size,
                borderRadius: ring.size / 2,
                borderWidth: 1,
                borderColor: pink,
                opacity: value.interpolate({ inputRange: [0, 1], outputRange: [ring.peakOpacity, ring.peakOpacity * 0.35] }),
              }}
            />
          );
        }
        if (ring.kind === 'ping') {
          return (
            <Animated.View
              key={i}
              pointerEvents="none"
              style={{
                position: 'absolute',
                width: ring.size,
                height: ring.size,
                borderRadius: ring.size / 2,
                borderWidth: 1.5,
                borderColor: pink,
                opacity: value.interpolate({ inputRange: [0, 1], outputRange: [ring.peakOpacity, 0] }),
                transform: [{ scale: value.interpolate({ inputRange: [0, 1], outputRange: [1, 1.75] }) }],
              }}
            />
          );
        }
        return (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={{
              position: 'absolute',
              width: ring.size,
              height: ring.size,
              borderRadius: ring.size / 2,
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: orange,
              opacity: ring.peakOpacity,
              transform: [{ rotate: value.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
            }}
          />
        );
      })}
    </>
  );
}
