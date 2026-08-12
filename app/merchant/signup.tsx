import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// on.merchantSignup — đăng ký tài khoản chủ quán, xác thực SĐT là đăng được ngay.
export default function MerchantSignupScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Tài khoản chủ quán</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <Text className="text-[22px] leading-[28px] font-sans-bold text-ink">
          Đăng tin cho khách ở gần, không tốn tiền quảng cáo
        </Text>
        <Text className="mt-2.5 text-[13.5px] leading-[21px] text-muted">
          Xác thực số điện thoại là đăng được ngay. Không cần tích điểm uy tín trước.
        </Text>

        <Text className="mt-4.5 font-mono-medium text-xs tracking-wide text-muted">THÔNG TIN QUÁN</Text>
        <View className="mt-2.5 rounded-2xl border border-border bg-white overflow-hidden">
          <InfoRow label="Tên quán" value="Bún chả Hàng Quạt" />
          <InfoRow label="Địa chỉ (ghim trên bản đồ)" value="19 Hàng Quạt, Hoàn Kiếm" />
          <InfoRow label="Ngành hàng" value="Quán ăn" last />
        </View>

        <View className="mt-3.5 rounded-2xl bg-accent-50 border border-accent-200 p-3.5">
          <Text className="text-[12.5px] leading-[19px] text-accent-text">
            Giai đoạn thử nghiệm chưa có gói trả phí nào. Mọi tính năng thu phí chỉ bật sau khi có giấy phép mạng xã
            hội theo Nghị định 147/2024.
          </Text>
        </View>

        <Pressable
          onPress={() => router.replace('/(main)/merchant')}
          className="mt-4 h-[52px] rounded-2xl bg-ink items-center justify-center"
        >
          <Text className="font-sans-semibold text-[15.5px] text-white">Kích hoạt tài khoản quán</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View className={`px-3.5 py-3 ${last ? '' : 'border-b border-border-soft'}`}>
      <Text className="text-[11.5px] text-muted">{label}</Text>
      <Text className="mt-0.5 font-sans-semibold text-[14.5px] text-ink">{value}</Text>
    </View>
  );
}
