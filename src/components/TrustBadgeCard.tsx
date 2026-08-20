import { Text, View } from 'react-native';

import { Chip } from './ui/Chip';

// 6 vạch = 7 bậc huy hiệu (0-6, TIER_LABELS ở backend trust-score.service.ts) — số vạch ĐÃ QUA khớp
// trực tiếp trustTier, không suy ra từ điểm số thô (mục 17: không hiện điểm số thô cho user).
const MAX_TIER = 6;

interface TrustBadgeCardProps {
  trustBadgeLabel: string;
  trustTier: number;
  pointsToNextTier: number | null;
}

// Dùng chung cho (main)/profile.tsx và profile/trust.tsx (mục 35) — trước đây 2 màn này tự vẽ
// riêng bằng dữ liệu mock currentUser.trustTier/trustTierIndex/trustTierMax/nextTierIn.
export function TrustBadgeCard({ trustBadgeLabel, trustTier, pointsToNextTier }: TrustBadgeCardProps) {
  return (
    <>
      <View className="flex-row items-center gap-2.5">
        <Chip label={trustBadgeLabel} color="green" size="md" />
        <Text className="text-[12.5px] text-muted">
          bậc {trustTier} / {MAX_TIER}
        </Text>
      </View>
      <View className="mt-3 flex-row gap-1.5">
        {Array.from({ length: MAX_TIER }).map((_, i) => (
          <View
            key={`tier-bar-${i}`}
            className={`flex-1 h-1.5 rounded-full ${i < trustTier ? 'bg-primary' : 'bg-border'}`}
          />
        ))}
      </View>
      <Text className="mt-2.5 text-xs leading-[19px] text-muted">
        {pointsToNextTier === null ? (
          'Đã đạt bậc cao nhất — không ai hạ được điểm của bạn.'
        ) : (
          <>
            Còn <Text className="font-sans-bold text-ink">{pointsToNextTier} lượt hữu ích</Text> nữa để lên bậc tiếp
            theo. Điểm chỉ tăng, không ai hạ được điểm của bạn.
          </>
        )}
      </Text>
    </>
  );
}
