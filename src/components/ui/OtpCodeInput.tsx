import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../constants/design-tokens';

export const OTP_LENGTH = 6;
interface OtpCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}
export function OtpCodeInput({ value, onChange, error = false }: OtpCodeInputProps) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.2, duration: 550, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 550, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);
  return (
    <View>
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className="flex-row justify-between gap-2"
      >
        {Array.from({ length: OTP_LENGTH }, (_, index) => {
          const active = index === value.length;
          const highlighted = active || Boolean(value[index]) || error;
          return (
            <LinearGradient
              key={index}
              colors={
                error
                  ? [colors.danger.DEFAULT, colors.danger.DEFAULT]
                  : highlighted
                    ? [colors.primary.DEFAULT, colors.accent.DEFAULT]
                    : ['#E9ECEFCC', '#E9ECEFCC']
              }
              style={[styles.cell, highlighted && styles.glow, active && styles.active]}
            >
              <View className="flex-1 items-center justify-center rounded-[12px] bg-white">
                {value[index] ? (
                  <Text className="font-sans-black text-[22px] text-primary-darker">{value[index]}</Text>
                ) : active ? (
                  <Animated.View style={{ opacity: pulse }}>
                    <LinearGradient
                      colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
                      style={styles.cursor}
                    />
                  </Animated.View>
                ) : (
                  <View className="h-2 w-2 rounded-full bg-[#4A4A4A]/30" />
                )}
              </View>
            </LinearGradient>
          );
        })}
      </View>
      <TextInput
        accessibilityLabel="Mã xác thực OTP gồm 6 chữ số"
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, OTP_LENGTH))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        showSoftInputOnFocus={false}
        autoFocus
        caretHidden
        style={styles.input}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  cell: { flex: 1, maxWidth: 48, height: 48, padding: 1.5, borderRadius: 13.5 },
  glow: {
    shadowColor: colors.primary.DEFAULT,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  active: { padding: 2, shadowOpacity: 0.35, shadowRadius: 8 },
  cursor: { width: 2, height: 24, borderRadius: 1 },
  input: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.02,
    color: 'transparent',
    fontSize: 1,
  },
});
