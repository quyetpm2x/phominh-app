import { Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';

export function InviteStats({ invited, earned }: { invited: number; earned: string }) {
  return (
    <View className="flex-row gap-3">
      <View className="flex-1 gap-1 rounded-[20px] border border-[#E9ECEF] bg-white p-4">
        <View className="flex-row items-center gap-1.5">
          <CustomIcon name="invitePeople" size={13} />
          <Text className="font-sans-bold text-xs text-[#4A4A4A]">Đã mời</Text>
        </View>
        <Text className="font-sans-black text-[24px] leading-8 text-ink">
          {invited} <Text className="font-sans-medium text-xs text-[#4A4A4A]">người</Text>
        </Text>
      </View>
      <View className="flex-1 gap-1 rounded-[20px] border border-[#E9ECEF] bg-white p-4">
        <View className="flex-row items-center gap-1.5">
          <CustomIcon name="inviteWallet" size={14} />
          <Text className="font-sans-bold text-xs text-[#4A4A4A]">Tiền thưởng nhận</Text>
        </View>
        <Text className="font-sans-black text-[24px] leading-8 text-[#00D492]">
          {earned}
          <Text className="font-sans-bold text-xs">đ</Text>
        </Text>
      </View>
    </View>
  );
}
