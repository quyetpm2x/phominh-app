import { Pressable, StyleSheet, View } from 'react-native';

export function Toggle({
  value,
  onValueChange,
  label,
  variant = 'default',
  disabled = false,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
  variant?: 'default' | 'settings' | 'privacy';
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled }}
      hitSlop={10}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={variant === 'privacy' ? styles.privacyTrack : variant === 'settings' ? styles.track : undefined}
      className={`h-6 w-10 justify-center rounded-full px-0.5 ${value ? 'bg-primary' : 'bg-[#D1D5DB]'}`}
    >
      <View
        style={variant === 'settings' ? styles.thumb : undefined}
        className={`h-5 w-5 rounded-full bg-white ${value ? 'self-end' : 'self-start'}`}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  privacyTrack: { width: 44, height: 24, flexShrink: 0 },
  track: { width: 48, height: 24, paddingHorizontal: 4, flexShrink: 0 },
  thumb: { width: 16, height: 16 },
});
