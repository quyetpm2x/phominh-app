import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Alert, Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { brand } from '../../src/constants/brand';
import { colors } from '../../src/constants/design-tokens';
import { termsIcons } from '../../src/constants/terms-icons';

const INTRO =
  'Chào mừng bạn đến với Mạng xã hội Bán kính Khu phố. Việc sử dụng ứng dụng đồng nghĩa với việc bạn chấp thuận các quy tắc dưới đây.';
const SECTIONS = [
  {
    icon: 'community',
    title: '1. Quy tắc cộng đồng & Khu phố',
    body: 'Người dùng có trách nhiệm chia sẻ thông tin trung thực, mang tính xây dựng cho cư dân xung quanh. Tuyệt đối nghiêm cấm các hành vi tung tin giả mạo, xúc phạm danh dự, kích động bạo lực hoặc gây mất an ninh trật tự địa phương.',
  },
  {
    icon: 'location',
    title: '2. Vị trí & Bán kính hoạt động',
    body: 'Ứng dụng thu thập dữ liệu vị trí nhằm hiển thị bài viết và thông tin tiện ích theo bán kính phù hợp. Bạn hoàn toàn có thể chủ động điều chỉnh bán kính khu vực và bật chế độ ẩn vị trí nhà riêng trong phần Cài đặt quyền riêng tư.',
  },
  {
    icon: 'trust',
    title: '3. Hệ thống Điểm uy tín & Xử phạt',
    body: 'Mỗi tài khoản được cấp điểm uy tín ban đầu. Các hành vi đăng tin sai sự thật, spam quảng cáo hoặc bị báo cáo vi phạm nhiều lần sẽ bị trừ điểm uy tín, giới hạn bán kính phát tin hoặc khoá tài khoản vĩnh viễn tuỳ theo mức độ vi phạm.',
  },
  {
    icon: 'store',
    title: '4. Đăng ký & Kinh doanh quán',
    body: 'Tài khoản quán kinh doanh cần cung cấp thông tin menu, địa chỉ chính xác và trung thực với khách hàng xung quanh. Mọi hành vi gian lận thông tin khuyến mãi sẽ bị gỡ bài và thu hồi huy hiệu quán uy tín.',
  },
  {
    icon: 'wallet',
    title: '5. Ví thưởng & Rút tiền',
    body: 'Tiền thưởng từ hoạt động chia sẻ thông tin hữu ích có thể rút về tài khoản ngân hàng chính chủ. Ứng dụng có quyền kiểm duyệt các yêu cầu rút tiền có dấu hiệu gian lận lượt tương tác.',
  },
] as const;

function TermsIcon({ name, size = 16 }: { name: keyof typeof termsIcons; size?: number }) {
  return <SvgXml xml={termsIcons[name]} width={size} height={size} />;
}

export default function TermsOfUseScreen() {
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(auth)/welcome');
  };

  const sendFeedback = async () => {
    try {
      await Linking.openURL(
        `mailto:${brand.contactEmail}?subject=${encodeURIComponent('Phản hồi về Điều khoản sử dụng')}`,
      );
    } catch {
      Alert.alert('Không thể mở ứng dụng email', `Vui lòng gửi phản hồi đến ${brand.contactEmail}.`);
    }
  };

  const shareTerms = async () => {
    try {
      await Share.share({
        title: 'Điều khoản sử dụng',
        message: [
          'Điều khoản sử dụng — ' + brand.appName,
          'Phiên bản 2.4.0 · Cập nhật: 15/03/2025',
          INTRO,
          ...SECTIONS.map(({ title, body }) => `${title}\n${body}`),
        ].join('\n\n'),
      });
    } catch {
      Alert.alert('Không thể chia sẻ', 'Vui lòng thử lại sau.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-row items-center gap-3 border-b border-border px-4 py-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          hitSlop={4}
          onPress={goBack}
          className="h-10 w-10 items-center justify-center rounded-xl bg-white active:opacity-60"
        >
          <TermsIcon name="back" size={18} />
        </Pressable>
        <Text
          accessibilityRole="header"
          className="flex-1 font-sans-black text-[17px] leading-[25.5px] text-primary-darker"
        >
          Điều khoản sử dụng
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Chia sẻ điều khoản sử dụng"
          hitSlop={4}
          onPress={shareTerms}
          className="h-10 w-10 items-center justify-center rounded-xl bg-white active:opacity-60"
        >
          <TermsIcon name="share" size={18} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View className="gap-2 rounded-[20px] border border-primary/20 p-4 overflow-hidden">
          <LinearGradient
            colors={[
              `${colors.primary.DEFAULT}1A`,
              `${colors.primary.DEFAULT}0D`,
              `${colors.primary.DEFAULT}00`,
            ]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <View className="flex-row flex-wrap items-center justify-between gap-2">
            <View className="flex-row items-center gap-2">
              <View className="h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <TermsIcon name="document" size={14} />
              </View>
              <Text className="font-sans-bold text-xs text-primary">Phiên bản 2.4.0</Text>
            </View>
            <Text className="font-sans-medium text-[11px] text-[#4a4a4a]">Cập nhật: 15/03/2025</Text>
          </View>
          <Text className="font-sans text-xs leading-[19.5px] text-[#4a4a4a]">{INTRO}</Text>
        </View>

        <View className="gap-3">
          {SECTIONS.map((section) => (
            <View
              key={section.icon}
              style={styles.card}
              className="gap-2.5 rounded-[20px] border border-border bg-white p-4"
            >
              <View className="flex-row items-center gap-2.5">
                <View className="h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <TermsIcon name={section.icon} />
                </View>
                <Text
                  accessibilityRole="header"
                  className="flex-1 font-sans-bold text-[13.5px] leading-[20.25px] text-primary-darker"
                >
                  {section.title}
                </Text>
              </View>
              <Text className="font-sans text-xs leading-[19.5px] text-[#4a4a4a]">{section.body}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card} className="gap-3 rounded-[20px] border border-border bg-white p-4">
          <View className="flex-row items-center gap-2">
            <TermsIcon name="support" />
            <Text
              accessibilityRole="header"
              className="flex-1 font-sans-bold text-[13px] leading-[19.5px] text-primary-darker"
            >
              Cần hỗ trợ hoặc phản hồi?
            </Text>
          </View>
          <Text className="font-sans text-[11.5px] leading-[18.688px] text-[#4a4a4a]">
            Nếu bạn có thắc mắc về điều khoản dịch vụ, vui lòng liên hệ ban quản trị ứng dụng.
          </Text>
          <View className="flex-row items-center gap-2 pt-1">
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                Alert.alert(
                  'Trung tâm trợ giúp',
                  `Để được giải đáp về điều khoản sử dụng, vui lòng liên hệ ban quản trị qua ${brand.contactEmail}.`,
                  [
                    { text: 'Đóng', style: 'cancel' },
                    { text: 'Gửi email', onPress: sendFeedback },
                  ],
                )
              }
              className="min-h-9 flex-1 flex-row items-center justify-center gap-1.5 rounded-[10px] py-2 active:opacity-60"
            >
              <TermsIcon name="help" size={12} />
              <Text className="shrink font-sans-bold text-xs text-center text-primary-darker">
                Trung tâm trợ giúp
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={sendFeedback}
              className="min-h-9 flex-1 flex-row items-center justify-center gap-1.5 rounded-[10px] bg-primary/10 py-2 active:opacity-60"
            >
              <TermsIcon name="feedback" size={12} />
              <Text className="shrink font-sans-bold text-xs text-center text-primary">Gửi phản hồi</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 96, gap: 16 },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
});
