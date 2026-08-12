import { TextInput as RNTextInput, type TextInputProps } from 'react-native';

export function TextInput({ className, ...props }: TextInputProps) {
  return (
    <RNTextInput
      className={`h-12 rounded-xl border border-gray-350 bg-white px-4 text-base text-ink ${className ?? ''}`}
      placeholderTextColor="#55606B"
      {...props}
    />
  );
}
