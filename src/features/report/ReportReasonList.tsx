import { TextInput } from '../../components/ui/TextInput';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { colors } from '../../constants/design-tokens';
import { REPORT_REASONS, type ReportReasonId } from './reasons';

interface Props {
  value: ReportReasonId;
  onChange: (reason: ReportReasonId) => void;
  details: string;
  onDetailsChange: (text: string) => void;
  onDetailsFocus: () => void;
  onDetailsBlur: () => void;
}
export function ReportReasonList({
  value,
  onChange,
  details,
  onDetailsChange,
  onDetailsFocus,
  onDetailsBlur,
}: Props) {
  return (
    <>
      <View accessibilityRole="radiogroup" accessibilityLabel="Lý do báo cáo" className="gap-2.5">
        {REPORT_REASONS.map((reason) => {
          const selected = reason.id === value;
          return (
            <Pressable
              key={reason.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={reason.title}
              accessibilityHint={reason.description}
              onPress={() => onChange(reason.id)}
              className={`min-h-[73px] flex-row items-center gap-3.5 rounded-[20px] border-2 p-4 ${selected ? 'border-primary bg-primary/5' : 'border-[#E9ECEF]/80 bg-white'}`}
            >
              <View
                className={`h-9 w-9 items-center justify-center rounded-[10px] ${selected ? 'bg-primary/10' : 'bg-[#F1F3F5]'}`}
              >
                <CustomIcon
                  name={reason.icon}
                  size={18}
                  color={selected ? colors.primary.DEFAULT : '#4A4A4A'}
                />
              </View>
              <View className="flex-1 gap-0.5">
                <Text className="font-sans-bold text-[13.5px] leading-[20.25px] text-[#1A1A1A]">
                  {reason.title}
                </Text>
                <Text className="font-sans text-[11px] leading-[16.5px] text-[#4A4A4A]">
                  {reason.description}
                </Text>
              </View>
              <View
                className={`h-5 w-5 items-center justify-center rounded-full ${selected ? 'bg-primary' : 'border-2 border-[#E9ECEF]/80'}`}
              >
                {selected ? <CustomIcon name="reportCheck" size={12} color="white" /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
      {value === 'other' ? (
        <View className="gap-1.5 pt-1">
          <View className="flex-row items-center justify-between px-1">
            <Text className="font-sans-bold text-xs leading-[18px] text-[#1A1A1A]">Mô tả chi tiết lý do</Text>
            <Text
              accessibilityLabel={`${details.length} trên 200 ký tự`}
              className="font-sans-bold text-[10px] leading-[15px] text-[#4A4A4A]"
            >
              {details.length}/200
            </Text>
          </View>
          <TextInput
            accessibilityLabel="Mô tả chi tiết lý do"
            accessibilityHint="Nhập tối đa 200 ký tự"
            value={details}
            onChangeText={onDetailsChange}
            onFocus={onDetailsFocus}
            onBlur={onDetailsBlur}
            placeholder="Vui lòng cung cấp thêm thông tin giúp ban quản trị xác minh chính xác hơn..."
            placeholderTextColor="#1A1A1A"
            multiline
            maxLength={200}
            textAlignVertical="top"
            style={styles.detailsInput}
          />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  detailsInput: {
    height: 91,
    borderWidth: 2,
    borderColor: `${colors.primary.DEFAULT}66`,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    lineHeight: 19.5,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
  },
});
