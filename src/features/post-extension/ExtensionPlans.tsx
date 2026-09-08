import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { colors } from '../../constants/design-tokens';

const PLANS = [
  { hours: 12, subtitle: 'Đến tối nay', icon: 'extendHalfDay' },
  { hours: 24, subtitle: 'Thêm 1 ngày', icon: 'extendDay' },
  { hours: 48, subtitle: 'Thêm 2 ngày', icon: 'extendTwoDays' },
] as const;
export type ExtensionHours = (typeof PLANS)[number]['hours'];

export function ExtensionPlans({
  selected,
  onSelect,
}: {
  selected: ExtensionHours;
  onSelect: (hours: ExtensionHours) => void;
}) {
  return (
    <View className="gap-5">
      <Text className="font-sans-bold text-[11.5px] tracking-[0.575px] text-[#4A4A4A]">CHỌN GÓI GIA HẠN</Text>
      <View className="flex-row gap-2.5">
        {PLANS.map((plan) => {
          const active = selected === plan.hours;
          return (
            <Pressable
              key={plan.hours}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}
              accessibilityLabel={`Gia hạn ${plan.hours} giờ, miễn phí`}
              onPress={() => onSelect(plan.hours)}
              className={`min-h-[145px] flex-1 items-center gap-2 rounded-[20px] border-2 px-2 py-3.5 ${active ? 'border-primary bg-primary/5' : 'border-[#E9ECEF]/80 bg-[#F1F3F5]/30'}`}
            >
              {plan.hours === 24 ? (
                <View pointerEvents="none" className="absolute -top-2.5 self-center">
                  <LinearGradient
                    colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
                    style={styles.badge}
                  >
                    <Text className="font-sans-black text-[9px] leading-[14px] text-white">ĐỀ XUẤT</Text>
                  </LinearGradient>
                </View>
              ) : null}
              <View
                className={`h-7 w-7 items-center justify-center rounded-lg ${active ? 'bg-primary' : 'bg-[#F1F3F5]'}`}
              >
                <CustomIcon name={plan.icon} size={12} color={active ? '#FFFFFF' : '#1A1A1A'} />
              </View>
              <View className="items-center">
                <Text className="font-sans-black text-sm leading-[21px] text-[#1A1A1A]">
                  +{plan.hours} Giờ
                </Text>
                <Text
                  className={`text-center text-[10px] leading-[15px] ${active ? 'font-sans-bold text-primary' : 'font-sans text-[#4A4A4A]'}`}
                >
                  {plan.subtitle}
                </Text>
              </View>
              <View
                className={`w-full items-center border-t pt-2.5 ${active ? 'border-primary/20' : 'border-[#E9ECEF]/60'}`}
              >
                <Text
                  className={`text-[11px] leading-[17px] ${active ? 'font-sans-black text-[#009966]' : 'font-sans-bold text-[#4A4A4A]'}`}
                >
                  Miễn phí
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({ badge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 } });
