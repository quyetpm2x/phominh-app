import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/design-tokens';

export function ShopActionButton({
  label,
  icon,
  onPress,
  tone = 'neutral',
  role = 'tab',
}: {
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  tone?: 'neutral' | 'gradient';
  role?: 'tab' | 'button';
}) {
  const color = tone === 'gradient' ? '#FFFFFF' : '#4A4A4A';
  const content = (
    <>
      <Ionicons name={icon} size={16} color={color} />
      <Text className="font-sans-bold text-[13px]" style={{ color }} numberOfLines={1} adjustsFontSizeToFit>
        {label}
      </Text>
    </>
  );
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityState={role === 'tab' ? { selected: tone === 'gradient' } : undefined}
      onPress={onPress}
      accessibilityLabel={label}
      className="flex-1"
    >
      {tone === 'gradient' ? (
        <LinearGradient
          colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.button, styles.compact]}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.button, styles[tone], tone === 'neutral' && styles.compact]}>{content}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  compact: { minHeight: 36, borderRadius: 10 },
  neutral: { backgroundColor: '#F8F9FA' },
});
