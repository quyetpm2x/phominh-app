import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../../src/components/ui/Avatar';
import { areas } from '../../src/mocks/phoMinh';

// on.editProfile — chỉnh sửa tên hiển thị, hai khu vực cố định.
export default function EditProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Chỉnh sửa hồ sơ</Text>
        <View className="flex-1" />
        <Pressable onPress={() => router.back()} className="h-8 rounded-lg bg-ink px-3.5 items-center justify-center">
          <Text className="font-sans-semibold text-xs text-white">Lưu</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <View className="flex-row items-center gap-3.5">
          <Avatar initial="M" size={72} radius={22} />
          <Pressable className="h-[38px] rounded-[11px] border border-border bg-white px-3.5 items-center justify-center">
            <Text className="font-sans-semibold text-[13px] text-ink">Đổi ảnh đại diện</Text>
          </Pressable>
        </View>

        <Text className="mt-5 font-mono-medium text-xs tracking-wide text-muted">TÊN HIỂN THỊ</Text>
        <View className="mt-2 h-[50px] rounded-[13px] bg-white border-[1.5px] border-primary justify-center px-4">
          <Text className="text-[15px] font-sans-medium text-ink">Minh ở Times City</Text>
        </View>
        <Text className="mt-1.5 text-xs text-muted">Không bắt buộc tên thật. Hàng xóm thường đặt theo toà nhà hoặc ngõ.</Text>

        <Text className="mt-5 font-mono-medium text-xs tracking-wide text-muted">HAI KHU VỰC CỐ ĐỊNH</Text>
        <View className="mt-2.5 gap-2.5">
          <AreaRow label={`Nhà · ${areas.home.place}`} dot={areas.home.color} />
          <AreaRow label={`Chỗ làm · ${areas.work.place}`} dot={areas.work.color} />
        </View>
        <Text className="mt-3 text-xs leading-[19px] text-muted">
          Chỉ được đổi khu vực 2 lần mỗi tháng — tránh việc nhảy khu liên tục để soi tin khắp nơi.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function AreaRow({ label, dot }: { label: string; dot: string }) {
  return (
    <Pressable
      onPress={() => router.push('/profile/areas')}
      className="rounded-[13px] border border-border bg-white px-3.5 py-3 flex-row items-center gap-2.5"
    >
      <View style={{ backgroundColor: dot }} className="w-2 h-2 rounded-full" />
      <View className="flex-1">
        <Text className="font-sans-semibold text-sm text-ink">{label}</Text>
        <Text className="text-[11.5px] text-muted mt-0.5">Đổi vị trí & bán kính</Text>
      </View>
      <Text className="text-muted-light">›</Text>
    </Pressable>
  );
}
