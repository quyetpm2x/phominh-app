import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

interface SplashDecorativeBlobsProps {
  pink: string;
  orange: string;
}

// 3 khối gradient hồng-cam trang trí nền Splash — blur THẬT (BlurView phủ rộng hơn khối màu 40px
// mỗi phía), cùng kỹ thuật đã dùng ở AuthDecorativeBlobs (màn Nhập SĐT) và Welcome, thay cho viền
// cứng không blur trước đó. Tách riêng file vì Splash.tsx đã vượt 250 dòng quy định của dự án.
export function SplashDecorativeBlobs({ pink, orange }: SplashDecorativeBlobsProps) {
  return (
    <>
      <View style={{ position: 'absolute', top: -110, left: -110, width: 280, height: 280, borderRadius: 140, overflow: 'hidden' }}>
        <LinearGradient colors={[`${pink}33`, `${orange}22`]} style={{ flex: 1 }} />
      </View>
      <BlurView
        intensity={60}
        tint="light"
        style={{ position: 'absolute', top: -150, left: -150, width: 360, height: 360, borderRadius: 180 }}
      />

      <View style={{ position: 'absolute', top: '30%', right: -90, width: 250, height: 250, borderRadius: 125, overflow: 'hidden' }}>
        <LinearGradient colors={[`${orange}26`, `${pink}1a`]} style={{ flex: 1 }} />
      </View>
      <BlurView
        intensity={60}
        tint="light"
        style={{
          position: 'absolute',
          top: '30%',
          right: -130,
          width: 330,
          height: 330,
          borderRadius: 165,
          transform: [{ translateY: -40 }],
        }}
      />

      <View style={{ position: 'absolute', bottom: -100, left: -60, width: 250, height: 250, borderRadius: 125, overflow: 'hidden' }}>
        <LinearGradient colors={[`${pink}26`, `${orange}1a`]} style={{ flex: 1 }} />
      </View>
      <BlurView
        intensity={60}
        tint="light"
        style={{ position: 'absolute', bottom: -140, left: -100, width: 330, height: 330, borderRadius: 165 }}
      />
    </>
  );
}
