import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { type ComponentProps, useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, Text } from 'react-native';

import { colors } from '../../constants/design-tokens';

interface GradientSubmitButtonProps {
  label: string;
  disabled: boolean;
  loading: boolean;
  onPress: () => void;
  icon?: ComponentProps<typeof Ionicons>['name'];
  compact?: boolean;
}

// Animate mượt opacity lúc enable/disable đổi (thay vì nhảy tức thời) — cùng kỹ thuật
// Animated.timing + useNativeDriver:true đã dùng ở GlowInputCard/AuthDecorativeBlobs.
export function GradientSubmitButton({
  label,
  disabled,
  loading,
  onPress,
  icon = 'arrow-forward',
  compact = false,
}: GradientSubmitButtonProps) {
  const opacity = useRef(new Animated.Value(disabled ? 0.5 : 1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: disabled ? 0.5 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [disabled, opacity]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      onPress={onPress}
      disabled={disabled || loading}
      className="active:scale-[0.98]"
    >
      <Animated.View style={{ opacity }}>
        <LinearGradient
          colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
          start={{ x: 0, y: 0 }}
          end={compact ? { x: 0, y: 1 } : { x: 1, y: 0 }}
          style={{
            height: compact ? 48 : 54,
            borderRadius: compact ? 14 : 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            shadowColor: colors.primary.DEFAULT,
            shadowOpacity: 0.3,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 8 },
            elevation: 6,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text className="font-sans-black text-sm tracking-wide text-white">{label}</Text>
              <Ionicons name={icon} size={16} color="#fff" />
            </>
          )}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}
