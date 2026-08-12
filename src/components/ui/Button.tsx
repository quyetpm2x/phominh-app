import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, type PressableProps } from 'react-native';

// Nền React Native Reusables — copy code vào project (giống triết lý shadcn/ui bên Web),
// không áp đặt màu sắc, tự do style bằng NativeWind (mục 2 tài liệu FE).
interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'dark' | 'danger' | 'outline';
}

export function Button({ label, variant = 'primary', className, ...props }: ButtonProps) {
  const base = 'items-center justify-center rounded-2xl px-5 h-[52px]';
  const variants = {
    primary: 'bg-primary',
    secondary: 'bg-cream-surface border border-border',
    dark: 'bg-ink',
    danger: 'bg-danger',
    outline: 'bg-white border border-border',
  };
  const textVariants = {
    primary: 'text-white',
    secondary: 'text-ink',
    dark: 'text-white',
    danger: 'text-white',
    outline: 'text-ink',
  };

  return (
    <Pressable className={`${base} ${variants[variant]} ${className ?? ''}`} {...props}>
      <Text className={`font-sans-semibold text-[15.5px] ${textVariants[variant]}`}>{label}</Text>
    </Pressable>
  );
}

interface GradientButtonProps extends PressableProps {
  label: string;
  className?: string;
}

// CTA chính trong onboarding — linear-gradient(135deg, primary → ink) theo đúng thiết kế gốc.
export function GradientButton({ label, className, disabled, ...props }: GradientButtonProps) {
  return (
    <Pressable className={className} disabled={disabled} {...props}>
      <LinearGradient
        colors={['#1f6f52', '#17150f']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height: 54,
          borderRadius: 15,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Text className="font-sans-bold text-base text-white">{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}
