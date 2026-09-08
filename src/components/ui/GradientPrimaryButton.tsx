import { colors } from '@/src/constants/design-tokens';
import InsetShadow from '@wave909/react-native-inset-shadow';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

export const GradientPrimaryButton = ({ children }: { children: React.ReactNode }) => {
  const SPLASH_PINK = colors.primary.DEFAULT;
  const SPLASH_ORANGE = colors.accent.DEFAULT;
  const SPLASH_PEACH = colors.primary.peach;

  return (
    <View
      style={{
        width: '100%',
        height: 66,
        borderRadius: 30,
        backgroundColor: SPLASH_PEACH,
        shadowColor: SPLASH_PINK,
        shadowOpacity: 0.8,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LinearGradient
        colors={[SPLASH_PINK, SPLASH_ORANGE]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          padding: 2,
          borderRadius: 18,
          width: '100%',
        }}
      >
        <InsetShadow
          shadowColor="rgba(0,0,0,1)"
          shadowOpacity={0.08}
          shadowRadius={5}
          shadowOffset={2}
          backgroundColor="#ffffff"
          containerStyle={{
            width: '100%',
            height: 62,
            borderRadius: 16,
          }}
        >
          <LinearGradient
            colors={[SPLASH_PINK, SPLASH_ORANGE]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              width: '100%',
              height: 62,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            {children}
          </LinearGradient>
        </InsetShadow>
      </LinearGradient>
    </View>
  );
};
