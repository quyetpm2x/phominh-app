import { Text, View } from 'react-native';
import type { HomeArea } from '../../lib/homeArea';
import { ProfileMenuRow } from './ProfileMenuRow';

import { useAreaAddress } from './useAreaAddress';

export function ProfileFixedAreas({
  home,
  work,
  onEdit,
}: {
  home: HomeArea;
  work: HomeArea | null;
  onEdit: (area: 'home' | 'work') => void;
}) {
  const homeAddress = useAreaAddress(home);
  const workAddress = useAreaAddress(work);
  return (
    <View className="gap-2.5">
      <View className="flex-row items-center justify-between px-1">
        <Text accessibilityRole="header" className="font-sans-black text-xs tracking-[0.6px] text-[#4A4A4A]">
          KHU VỰC CỐ ĐỊNH
        </Text>
        {/* Preview allowance supplied by the design; no backend quota is available yet. */}
        <Text className="font-sans-bold text-[11px] text-primary">Còn 2 lượt đổi/tháng</Text>
      </View>
      <View className="overflow-hidden rounded-[20px] border border-[#E9ECEF]/80 bg-white">
        <ProfileMenuRow
          icon="meHome"
          title="Nhà"
          badge="Mặc định"
          subtitle={homeAddress}
          tone="pink"
          areaEditor
          onPress={() => onEdit('home')}
        />
        <ProfileMenuRow
          icon="meWork"
          title="Chỗ làm"
          subtitle={workAddress}
          tone="orange"
          last
          areaEditor
          onPress={() => onEdit('work')}
        />
      </View>
    </View>
  );
}
