import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, type PressableProps, type StyleProp, type TextStyle } from 'react-native';

import { colors } from '../../constants/design-tokens';

// Nền React Native Reusables — copy code vào project (giống triết lý shadcn/ui bên Web),
// không áp đặt màu sắc, tự do style bằng NativeWind (mục 2 tài liệu FE).
interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'dark' | 'danger' | 'outline' | 'soft';
  leadingIcon?: ReactNode;
  labelStyle?: StyleProp<TextStyle>;
}

export function Button({
  label,
  variant = 'primary',
  className,
  leadingIcon,
  labelStyle,
  ...props
}: ButtonProps) {
  const base = 'items-center justify-center rounded-2xl px-5 h-[52px]';
  const variants = {
    soft: 'bg-primary/10',
    primary: 'bg-primary',
    secondary: 'bg-cream-surface border border-border',
    dark: 'bg-ink',
    danger: 'bg-danger',
    outline: 'bg-white border border-border',
  };
  const textVariants = {
    soft: 'text-primary',
    primary: 'text-white',
    secondary: 'text-ink',
    dark: 'text-white',
    danger: 'text-white',
    outline: 'text-ink',
  };

  return (
    <Pressable className={`${base} ${variants[variant]} ${className ?? ''}`} {...props}>
      {leadingIcon}
      <Text style={labelStyle} className={`font-sans-semibold text-[15.5px] ${textVariants[variant]}`}>
        {label}
      </Text>
    </Pressable>
  );
}

interface GradientButtonProps extends PressableProps {
  label: string;
  className?: string;
  compact?: boolean;
}

// CTA chính trong onboarding/đăng bài — linear-gradient(primary → accent), khớp rebrand 2026-08-24
// (trước đó primary → ink, đã đổi hướng gradient theo đúng mockup mới: đổi tông màu chứ không tối
// dần). Đọc màu từ design-tokens.ts thay vì hardcode hex — sửa 1 chỗ áp dụng cho toàn bộ 13 màn
// đang dùng component này.
export function GradientButton({
  label,
  className,
  disabled,
  compact = false,
  ...props
}: GradientButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      className={className}
      disabled={disabled}
      {...props}
    >
      <LinearGradient
        colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
        start={{ x: 0, y: 0 }}
        end={compact ? { x: 0, y: 1 } : { x: 1, y: 0 }}
        style={{
          height: compact ? 32 : 54,
          borderRadius: compact ? 20 : 15,
          paddingHorizontal: compact ? 16 : 0,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Text className={`font-sans-bold text-white ${compact ? 'text-[13px]' : 'text-base'}`}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}
