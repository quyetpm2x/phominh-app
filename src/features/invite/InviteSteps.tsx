import { Text, View } from 'react-native';

export function InviteSteps({ code }: { code: string }) {
  const steps = [
    {
      title: 'Gửi link hoặc mã giới thiệu',
      body: (
        <>
          Chia sẻ mã <Text className="font-mono-bold text-primary">{code}</Text> cho bạn bè, hàng xóm khu vực
          lân cận.
        </>
      ),
    },
    {
      title: 'Bạn bè cài đặt & xác thực',
      body: 'Tải app, nhập mã giới thiệu và đăng bài tin đầu tiên hợp lệ.',
    },
    {
      title: 'Cả hai cùng nhận thưởng',
      body: (
        <>
          Bạn nhận <Text className="font-sans-black text-ink">20.000đ</Text>, bạn bè nhận ngay{' '}
          <Text className="font-sans-black text-ink">10.000đ</Text> vào Ví thưởng.
        </>
      ),
    },
  ];
  return (
    <View className="gap-4 rounded-[31px] border border-[#E9ECEF] bg-white p-5">
      <Text accessibilityRole="header" className="font-sans-black text-xs tracking-[0.6px] text-[#4A4A4A]">
        3 BƯỚC NHẬN THƯỞNG DỄ DÀNG
      </Text>
      {steps.map((step, index) => (
        <View key={step.title} className="flex-row items-start gap-3.5">
          <View className="h-7 w-7 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
            <Text className="font-sans-black text-xs text-primary">{index + 1}</Text>
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="font-sans-bold text-xs leading-4 text-ink">{step.title}</Text>
            <Text className="font-sans text-[11px] leading-[16.5px] text-[#4A4A4A]">{step.body}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
