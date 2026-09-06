import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { UnderlineTabs } from '../../components/ui/UnderlineTabs';
import { colors } from '../../constants/design-tokens';
import type { HomeFeedController } from './useHomeFeed';
type Props = Pick<
  HomeFeedController,
  'areaLabel' | 'selectedArea' | 'tab' | 'nearby' | 'home' | 'setSheet' | 'changeTab'
>;
export function HomeHeader({ areaLabel, selectedArea, tab, nearby, home, setSheet, changeTab }: Props) {
  return (
    <View className="border-b border-border bg-white">
      <View className="flex-row items-center gap-2 px-5 pb-3 pt-2">
        <LinearGradient colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]} style={styles.logoBorder}>
          <View className="flex-1 items-center justify-center rounded-[9px] bg-white">
            <Text className="font-sans-black text-xl text-primary">P</Text>
          </View>
        </LinearGradient>
        <View className="flex-1 gap-0.5">
          <View className="flex-row items-center gap-2">
            <Text className="font-sans-black text-xl tracking-[-0.5px] text-primary-darker">Phố Mình</Text>
            <View className="flex-row items-center gap-0.5 rounded-full border border-accent/25 bg-accent/15 px-1.5 py-0.5">
              <CustomIcon name="feedLive" size={9} />
              <Text className="font-sans-black text-[9px] text-accent">LIVE</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1">
            <CustomIcon name="feedLocation" size={11} />
            <Text numberOfLines={1} className="flex-1 font-sans-medium text-[11px] text-[#4A4A4A]">
              {areaLabel} · {selectedArea.radiusKm.toFixed(1)}km ·{' '}
              {tab === 'nearby' && nearby ? 'Vị trí của bạn' : tab === 'work' ? 'Chỗ làm' : 'Nhà'}
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Lọc dòng tin"
          hitSlop={4}
          onPress={() => setSheet('filter')}
          className="h-9 w-9 items-center justify-center rounded-[10px] border border-accent/20 bg-accent/10"
        >
          <CustomIcon name="feedFilter" size={18} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Xem bản đồ khu vực"
          hitSlop={4}
          onPress={() => setSheet('map')}
          className="h-9 w-9 items-center justify-center rounded-[10px] border border-primary/20 bg-primary/10"
        >
          <CustomIcon name="feedMap" size={18} />
        </Pressable>
      </View>
      <View className="border-t border-border/60 px-5 pt-2.5">
        <UnderlineTabs
          compact
          value={tab}
          onChange={changeTab}
          options={[
            {
              key: 'nearby',
              label: `Quanh đây (${(nearby ?? home).radiusKm.toFixed(1)}km)`,
              icon: (active) => (
                <CustomIcon name="feedNearby" size={15} color={active ? colors.primary.DEFAULT : '#A0A0A0'} />
              ),
            },
            {
              key: 'home',
              label: 'Nhà',
              icon: (active) => (
                <CustomIcon name="feedHome" size={15} color={active ? colors.primary.DEFAULT : '#A0A0A0'} />
              ),
            },
            {
              key: 'work',
              label: 'Chỗ làm',
              icon: (active) => (
                <CustomIcon name="feedWork" size={15} color={active ? colors.primary.DEFAULT : '#A0A0A0'} />
              ),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoBorder: {
    width: 40,
    height: 40,
    padding: 1,
    borderRadius: 10,
    shadowColor: '#F5497A',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
});
