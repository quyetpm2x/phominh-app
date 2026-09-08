import { Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { StatisticsSection } from './StatisticsSection';

export function AudienceBreakdown({ residents }: { residents: number }) {
  return (
    <StatisticsSection title="Cơ cấu người tiếp cận" icon="statsAudience" tone="blue">
      <View className="flex-row gap-2.5">
        {[
          { label: 'Cư dân cố định', value: residents, icon: 'statsHome' as const, tone: 'bg-primary/10' },
          {
            label: 'Khách ghé thăm',
            value: 100 - residents,
            icon: 'statsVisitor' as const,
            tone: 'bg-[#FE9A00]/10',
          },
        ].map((item) => (
          <View
            key={item.icon}
            className="flex-1 flex-row items-center gap-2 rounded-[18px] border border-[#E9ECEF]/60 bg-[#F1F3F5]/40 p-3"
          >
            <View className={`h-8 w-8 items-center justify-center rounded-[9px] ${item.tone}`}>
              <CustomIcon name={item.icon} size={16} />
            </View>
            <View className="flex-1">
              <Text className="font-sans-black text-sm leading-[21px] text-[#1A1A1A]">{item.value}%</Text>
              <Text className="font-sans-bold text-[10.5px] leading-4 text-[#4A4A4A]">{item.label}</Text>
            </View>
          </View>
        ))}
      </View>
    </StatisticsSection>
  );
}
