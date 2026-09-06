import { forwardRef } from 'react';
import { TextInput as RNTextInput, type TextInputProps } from 'react-native';

export const TextInput = forwardRef<RNTextInput, TextInputProps>(function TextInput(
  { className, ...props },
  ref,
) {
  return (
    <RNTextInput
      ref={ref}
      className={`h-12 rounded-xl border border-gray-350 bg-white px-4 text-base text-ink ${className ?? ''}`}
      placeholderTextColor="#55606B"
      {...props}
    />
  );
});
