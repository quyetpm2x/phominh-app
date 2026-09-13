import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import { CustomIcon, type CustomIconProps } from '../../components/ui/CustomIcon';

export function ProfileMenuRow({
  icon,
  title,
  subtitle,
  value,
  tone = 'neutral',
  last,
  onPress,
  badge,
  areaEditor = false,
}: {
  icon: CustomIconProps['name'];
  title: string;
  subtitle?: string;
  value?: string;
  tone?: 'neutral' | 'pink' | 'orange' | 'invite';
  last?: boolean;
  onPress: () => void;
  badge?: string;
  areaEditor?: boolean;
}) {
  const invite = tone === 'invite';
  const color = tone === 'orange' ? '#FF4B2B' : tone === 'pink' || invite ? '#FF416C' : '#4A4A4A';
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}>
      {invite ? (
        <LinearGradient
          pointerEvents="none"
          colors={['#FF416C00', '#FF4B2B0D', '#FF416C0D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {!last ? <View style={styles.divider} /> : null}
      <LinearGradient
        colors={
          invite
            ? ['#FF416C', '#FF4B2B']
            : tone === 'orange'
              ? ['#FF4B2B26', '#FF4B2B26']
              : tone === 'pink'
                ? ['#FFF0F3', '#FFF0F3']
                : ['#F1F3F5', '#F1F3F5']
        }
        style={styles.block0}
      >
        <CustomIcon name={icon} size={20} color={invite ? 'white' : color} />
      </LinearGradient>
      <View style={styles.textColumn}>
        <View className="flex-row items-center gap-1.5">
          <Text
            className="font-sans-bold text-[#1A1A1A]"
            style={areaEditor ? styles.editorTitle : styles.title}
          >
            {title}
          </Text>
          {invite ? <View style={styles.dot} /> : null}
          {badge ? (
            <Text className="rounded bg-primary/10 px-1 font-sans-bold text-[10px] text-primary">
              {badge}
            </Text>
          ) : null}
        </View>
        {subtitle ? (
          <Text
            numberOfLines={1}
            className="font-sans text-[#4A4A4A]"
            style={invite ? styles.inviteSubtitle : styles.subtitle}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text
          className={tone === 'orange' || invite ? 'font-sans-black' : 'font-sans-bold'}
          style={[
            styles.value,
            tone === 'orange' ? styles.balance : styles.pill,
            invite && styles.inviteValue,
          ]}
        >
          {value}
        </Text>
      ) : null}
      <View
        className={
          areaEditor ? 'h-8 w-8 items-center justify-center rounded-full bg-[#F1F3F5]/60' : undefined
        }
      >
        <CustomIcon
          name="meChevron"
          size={areaEditor ? 14 : 16}
          color={areaEditor ? '#1A1A1A' : invite ? '#FF416C' : '#ADB5BD'}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16 },
  divider: { position: 'absolute', left: 16, right: 16, bottom: 0, height: 1, backgroundColor: '#E9ECEF99' },
  block0: {
    width: 40,
    height: 40,
    borderRadius: 11.111,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: { flex: 1 },
  title: { fontSize: 14, lineHeight: 21, flexShrink: 1 },
  editorTitle: { fontSize: 13, lineHeight: 19.5 },
  subtitle: { fontSize: 12, lineHeight: 18 },
  inviteSubtitle: { fontSize: 11, lineHeight: 16.5 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF416C', opacity: 0.73 },
  value: { fontSize: 12, lineHeight: 18 },
  balance: { color: '#FF4B2B' },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    color: '#FF416C',
    backgroundColor: '#FF416C1A',
  },
  inviteValue: { fontSize: 11, lineHeight: 16.5 },
});
