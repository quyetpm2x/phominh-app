import { colors } from '@/src/constants/design-tokens';
import InsetShadow from '@wave909/react-native-inset-shadow';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';

export const GradientPrimaryView = ({
  badgeOpacity,
  badgeScale,
  children,
  size,
  borderRadius,
  hasShadow,
  borderWidth,
}: {
  badgeOpacity?: Animated.Value;
  badgeScale?: Animated.Value;
  children: React.ReactNode;
  size?: number;
  hasShadow?: boolean;
  borderRadius?: number;
  borderWidth?: number;
}) => {
  const SPLASH_PINK = colors.primary.DEFAULT;
  const SPLASH_ORANGE = colors.accent.DEFAULT;
  const SPLASH_PEACH = colors.primary.peach;

  const BADGE_SIZE = 112;

  return (
    <Animated.View
      style={{
        width: size ?? BADGE_SIZE,
        height: size ?? BADGE_SIZE,
        borderRadius: 30,
        backgroundColor: SPLASH_PEACH,
        opacity: badgeOpacity ?? 1,
        transform: [{ scale: badgeScale ?? 1 }],
        shadowColor: SPLASH_PINK,
        shadowOpacity: hasShadow ? 1 : 0,
        shadowRadius: 28,
        shadowOffset: { width: 0, height: 16 },
        elevation: hasShadow ? 16 : 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LinearGradient
        colors={[SPLASH_ORANGE, SPLASH_PINK, SPLASH_ORANGE]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          padding: borderWidth ?? 2,
          borderRadius: borderRadius ?? 30,
        }}
      >
        <InsetShadow
          shadowColor="rgba(0,0,0,1)"
          shadowOpacity={0.1}
          shadowRadius={5}
          shadowOffset={2}
          backgroundColor="#ffffff"
          containerStyle={{
            width: size ?? BADGE_SIZE,
            height: size ?? BADGE_SIZE,
            borderRadius: borderRadius && borderWidth ? borderRadius - borderWidth : 28,
          }}
        >
          <LinearGradient
            colors={[SPLASH_ORANGE, SPLASH_PINK, SPLASH_ORANGE]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              width: size ?? BADGE_SIZE,
              height: size ?? BADGE_SIZE,
              borderRadius: borderRadius && borderWidth ? borderRadius - borderWidth : 28,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {children}
          </LinearGradient>
        </InsetShadow>
      </LinearGradient>
    </Animated.View>
  );
};
