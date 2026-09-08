import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { CustomIcon, type CustomIconProps } from '../../components/ui/CustomIcon';

interface StatisticsSectionProps {
  title: string;
  icon: CustomIconProps['name'];
  tone?: 'pink' | 'green' | 'blue';
  accessory?: ReactNode;
  children: ReactNode;
}

export function StatisticsSection({
  title,
  icon,
  tone = 'pink',
  accessory,
  children,
}: StatisticsSectionProps) {
  return (
    <View className="gap-3.5 rounded-[30px] border border-[#E9ECEF]/80 bg-white p-4">
      <View className="flex-row flex-wrap items-center justify-between gap-2">
        <View className="flex-row items-center gap-2">
          <View
            className={`h-7 w-7 items-center justify-center rounded-lg ${tone === 'green' ? 'bg-[#00BC7D]/10' : tone === 'blue' ? 'bg-[#2B7FFF]/10' : 'bg-primary/10'}`}
          >
            <CustomIcon name={icon} size={14} />
          </View>
          <Text
            accessibilityRole="header"
            className="font-sans-black text-[13.5px] leading-[21px] text-[#1A1A1A]"
          >
            {title}
          </Text>
        </View>
        {accessory}
      </View>
      {children}
    </View>
  );
}
