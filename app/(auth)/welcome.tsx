import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { brand } from '../../src/constants/brand';
import { GradientButton } from '../../src/components/ui/Button';

const VALUE_PROPS = [
  {
    title: 'Gần tới mức đi bộ được',
    body: 'Chỉ thấy bài của người trong bán kính bạn chọn, không phải cả thành phố.',
    bg: '#e4f0e9',
  },
  {
    title: 'Ảnh chụp tại chỗ, không ảnh cũ',
    body: 'Mọi ảnh đều chụp trong app, nên tin "còn hàng" đúng là của hôm nay.',
    bg: '#f5e0d5',
  },
  {
    title: 'Hết 24 giờ là tin tự ẩn',
    body: 'Không ai phải dọn feed, mở lên lúc nào cũng là chuyện đang diễn ra.',
    bg: '#f6ecd4',
  },
];

// isWelcome — màn hình mở đầu, không có animation nổi (chỉ UI tĩnh) nhưng vẫn giữ bố cục hero
// (2 thẻ tin nổi + chấm định vị giữa) đúng như Phố Mình.dc.html.
export default function WelcomeScreen() {
  return (
    <LinearGradient colors={['#fdf6ec', '#f7ead9', '#efe2cd']} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerClassName="flex-1 px-6 pt-2" bounces={false}>
          <View className="flex-1 justify-center gap-2">
            <WelcomeHero />

            <View className="mt-1 flex-row items-center gap-2 self-start rounded-full bg-white/70 px-3 py-1.5 border border-primary-100">
              <View className="w-1.5 h-1.5 rounded-full bg-primary" />
              <Text className="font-sans-semibold text-[11.5px] text-primary">Khu mình đang có 41 tin mới</Text>
            </View>

            <Text className="mt-2 text-[42px] leading-[44px] font-sans-bold tracking-tight text-ink">
              {brand.appName}
            </Text>
            <Text className="mt-1 text-xl font-sans-bold text-accent">{brand.tagline}</Text>
            <Text className="mt-2 text-base leading-6 text-muted max-w-[290px]">{brand.taglineLong}</Text>

            <View className="mt-3 gap-2">
              {VALUE_PROPS.map((vp) => (
                <View
                  key={vp.title}
                  className="flex-row gap-3 rounded-2xl bg-white/85 border border-ink/5 p-3.5"
                >
                  <View
                    style={{ backgroundColor: vp.bg }}
                    className="w-[34px] h-[34px] rounded-[11px] items-center justify-center"
                  >
                    <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-sans-bold text-sm text-ink">{vp.title}</Text>
                    <Text className="mt-0.5 text-xs leading-[18px] text-muted">{vp.body}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className="pb-8 pt-4 gap-3">
            <GradientButton
              label="Bắt đầu với số điện thoại"
              onPress={() => router.push('/(auth)/phone-input')}
            />
            <Text className="text-center text-[11.5px] leading-[17px] text-muted">
              Tiếp tục là bạn đồng ý Điều khoản sử dụng.{'\n'}Vị trí chỉ được lấy khi bạn mở app.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Hai thẻ tin nổi quanh chấm định vị giữa — hero minh hoạ "mở app là thấy ngay" của thiết kế gốc.
function WelcomeHero() {
  return (
    <View style={{ height: 138 }} className="relative">
      <View
        style={{ position: 'absolute', left: '50%', top: 58, marginLeft: -8, width: 16, height: 16 }}
        className="rounded-full bg-primary border-2 border-white"
      />
      <View
        style={{ position: 'absolute', left: 4, top: 10, width: 154, transform: [{ rotate: '-4deg' }] }}
        className="rounded-2xl bg-white border border-primary-100 p-2.5 shadow-sm"
      >
        <View className="flex-row items-center justify-between">
          <Text className="font-mono-medium text-[9px] tracking-wide text-primary">VỪA ĐĂNG</Text>
          <Text className="text-[9.5px] text-muted">180 m</Text>
        </View>
        <View className="mt-1.5 h-11 rounded-[9px] bg-cream-surface" />
        <Text className="mt-1.5 text-[11.5px] font-sans-bold leading-[15px] text-ink">
          Bún chả đầu ngõ còn 12 suất
        </Text>
      </View>
      <View
        style={{ position: 'absolute', right: 2, top: 0, width: 148, transform: [{ rotate: '5deg' }] }}
        className="rounded-2xl bg-white border border-accent-100 p-2.5 shadow-sm"
      >
        <View className="flex-row items-center justify-between">
          <Text className="font-mono-medium text-[9px] tracking-wide text-accent">5 GIỜ TRƯỚC</Text>
          <Text className="text-[9.5px] text-muted">620 m</Text>
        </View>
        <Text className="mt-1.5 text-[11.5px] font-sans-bold leading-[15px] text-ink">
          Mất điện toà T4 từ sáng nay
        </Text>
        <Text className="mt-1 text-[9.5px] text-muted">24 bình luận</Text>
      </View>
      <View
        style={{ position: 'absolute', right: 20, bottom: 4, transform: [{ rotate: '-3deg' }] }}
        className="flex-row items-center gap-1.5 rounded-full bg-white border border-border px-3 py-1.5 shadow-sm"
      >
        <View className="w-1.5 h-1.5 rounded-full bg-accent" />
        <Text className="font-sans-bold text-[11px] text-ink">~3 phút đi bộ</Text>
      </View>
    </View>
  );
}
