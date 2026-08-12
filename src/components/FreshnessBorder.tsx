import { View, type ViewProps } from 'react-native';

import { colors } from '../constants/design-tokens';
import { getFreshnessLevel } from '../utils/formatFreshness';

// Viền màu theo độ mới đã thiết kế — mới đăng/vài giờ/sắp hết hạn (mục 2 tài liệu FE).
const BORDER_COLOR: Record<ReturnType<typeof getFreshnessLevel>, string> = {
  new: colors.freshness.fresh,
  aging: colors.freshness.aging,
  expiring: colors.freshness.stale,
};

interface FreshnessBorderProps extends ViewProps {
  createdAt: string;
  expiresAt: string;
}

export function FreshnessBorder({ createdAt, expiresAt, style, children, ...props }: FreshnessBorderProps) {
  const level = getFreshnessLevel(createdAt, expiresAt);

  return (
    <View
      className="rounded-2xl bg-white"
      style={[{ borderWidth: 2, borderColor: BORDER_COLOR[level] }, style]}
      {...props}
    >
      {children}
    </View>
  );
}
