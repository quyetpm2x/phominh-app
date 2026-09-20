import { Switch } from 'react-native';
import { colors } from '../../constants/design-tokens';

export function Toggle({
  value,
  onValueChange,
  label,
  variant = 'default',
  disabled = false,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
  variant?: 'default' | 'settings' | 'privacy';
  disabled?: boolean;
}) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: '#E9ECEF', true: colors.primary.DEFAULT }}
      thumbColor="#FFFFFF"
      ios_backgroundColor="#E9ECEF"
      accessibilityLabel={label}
    />
  );
}
