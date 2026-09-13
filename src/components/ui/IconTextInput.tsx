import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { useState } from 'react';
import { TextInput as RNTextInput, View } from 'react-native';

import { colors } from '../../constants/design-tokens';

interface IconTextInputProps extends ComponentProps<typeof RNTextInput> {
  icon: ComponentProps<typeof Ionicons>['name'];
  iconNode?: ReactNode;
  iconPosition?: 'left' | 'right';
  // Báo field đang sai validate (vd rỗng sau khi trim) — đổi viền sang đỏ, không tự tính bên trong
  // component này vì rule validate khác nhau tuỳ field (bắt buộc hay không).
  invalid?: boolean;
}

// Input có icon prefix bên trái — mockup "Thông tin cá nhân" dùng pattern này cho mọi ô nhập
// (icon Solar, RN không có sẵn nên dùng Ionicons tương đương). Tách riêng khỏi TextInput dùng
// chung (src/components/ui/TextInput.tsx) thay vì sửa thẳng component đó — TextInput đang dùng ở
// rất nhiều màn khác không cần icon, tránh ảnh hưởng ngoài ý muốn.
export function IconTextInput({
  icon,
  iconNode,
  iconPosition = 'left',
  invalid,
  style,
  onFocus,
  onBlur,
  ...props
}: IconTextInputProps) {
  const [focused, setFocused] = useState(false);

  let borderClass = 'border-border';
  if (invalid) borderClass = 'border-danger';
  else if (focused) borderClass = 'border-primary';

  return (
    <View className="relative justify-center">
      {iconNode ? (
        <View pointerEvents="none" style={{ position: 'absolute', [iconPosition]: 14, zIndex: 1 }}>
          {iconNode}
        </View>
      ) : (
        <Ionicons
          name={icon}
          size={16}
          color={colors.muted.DEFAULT}
          style={{ position: 'absolute', [iconPosition]: 14, zIndex: 1 }}
        />
      )}
      <RNTextInput
        className={`h-12 rounded-xl border bg-cream-surface/40 ${iconPosition === 'right' ? 'pl-4 pr-12' : 'pl-10 pr-4'} text-sm font-sans-semibold text-ink ${borderClass}`}
        placeholderTextColor={colors.muted.light}
        style={[
          style,
          focused
            ? {
                shadowColor: colors.primary.DEFAULT,
                shadowOpacity: 0.18,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 0 },
                elevation: 3,
              }
            : null,
        ]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
    </View>
  );
}
