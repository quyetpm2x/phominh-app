import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { GradientSubmitButton } from '../../components/ui/GradientSubmitButton';
import { INVITE_CHANNELS } from './data';

export function InviteCodeCard({
  code,
  copied,
  onCopy,
  onShare,
  onLink,
}: {
  code: string;
  copied: boolean;
  onCopy: () => void;
  onShare: () => void;
  onLink: () => void;
}) {
  return (
    <View className="gap-4 rounded-[31px] border border-[#E9ECEF] bg-white p-5" style={styles.shadow}>
      <Text className="font-sans-black text-[11px] tracking-[0.55px] text-[#4A4A4A]">
        MÃ GIỚI THIỆU CỦA BẠN
      </Text>
      <View className="flex-row items-center gap-2 rounded-[17px] border border-[#E9ECEF] bg-[#F1F3F5]/40 p-2">
        <Text
          selectable
          className="flex-1 text-center font-mono-bold text-[20px] tracking-[2px] text-primary"
        >
          {code}
        </Text>
        <GradientSubmitButton
          label={copied ? 'Đã chép' : 'Sao chép'}
          disabled={false}
          loading={false}
          onPress={onCopy}
          leadingIcon={<CustomIcon name="inviteCopy" size={14} />}
          compact
          gradientStyle={styles.copy}
          labelStyle={styles.copyLabel}
        />
      </View>
      <View className="gap-3 pt-2">
        <Text className="text-center font-sans-bold text-[11px] text-[#4A4A4A]">
          Chia sẻ nhanh qua mạng xã hội
        </Text>
        <View className="flex-row gap-3">
          {INVITE_CHANNELS.map((channel) => (
            <Pressable
              key={channel.id}
              accessibilityRole="button"
              accessibilityLabel={
                channel.id === 'link' ? 'Sao chép liên kết mời' : `Chia sẻ lời mời qua ${channel.label}`
              }
              onPress={channel.id === 'link' ? onLink : onShare}
              className="flex-1 items-center gap-1.5 rounded-[20px] border border-[#E9ECEF] bg-[#F1F3F5]/30 py-2"
            >
              <View style={[styles.socialIcon, { backgroundColor: channel.color }]}>
                <CustomIcon name={channel.icon} size={channel.size} />
              </View>
              <Text numberOfLines={1} adjustsFontSizeToFit className="font-sans-bold text-[11px] text-ink">
                {channel.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 1 },
  },
  copy: {
    height: 40,
    borderRadius: 11,
    paddingHorizontal: 16,
    gap: 6,
    shadowOpacity: 0.05,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  copyLabel: { fontSize: 12, letterSpacing: 0 },
  socialIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
});
