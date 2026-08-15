import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterChip } from '../../src/components/ui/Chip';
import { formatVnd } from '../../src/lib/formatCurrency';
import type { LeaderboardEntry, LeaderboardHistoryEntry } from '../../src/api/endpoints/rewards';
import { useLeaderboardHistory, useLiveLeaderboard } from '../../src/hooks/useRewards';
import { useMe } from '../../src/hooks/useMe';

const TIERS = [0, 1, 2, 3, 4, 5, 6];

// on.leaderboard — Top 10 theo bậc (mục 57, bussiness §5.1b). "Đang chạy" chỉ tham khảo, đổi tới
// cuối tháng; "Đã chốt" là kết quả chính thức kèm tiền thưởng thật.
export default function LeaderboardScreen() {
  const { data: me } = useMe();
  const [tier, setTier] = useState<number | undefined>(undefined);
  const [tab, setTab] = useState<'live' | 'history'>('live');
  const effectiveTier = tier ?? me?.trustTier;

  const live = useLiveLeaderboard(tab === 'live' ? effectiveTier : undefined);
  const history = useLeaderboardHistory(tab === 'history' ? effectiveTier : undefined);
  const { data, isLoading } = tab === 'live' ? live : history;

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Bảng xếp hạng thưởng</Text>
      </View>

      <View className="px-4.5 pt-3.5">
        <View className="flex-row gap-1.5">
          <FilterChip label="Đang chạy" selected={tab === 'live'} onPress={() => setTab('live')} />
          <FilterChip label="Đã chốt (tháng trước)" selected={tab === 'history'} onPress={() => setTab('history')} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2.5 -mx-4.5 px-4.5">
          <View className="flex-row gap-1.5">
            {TIERS.map((t) => (
              <FilterChip
                key={t}
                label={`Bậc ${t}`}
                selected={effectiveTier === t}
                onPress={() => setTier(t)}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        {tab === 'live' ? (
          <View className="mb-3 rounded-2xl border border-border bg-white p-3.5">
            <Text className="text-xs leading-[19px] text-muted">
              Thứ hạng và điểm ở đây chỉ mang tính THAM KHẢO, có thể đổi tới hết tháng. Tiền thưởng chỉ tính theo
              kết quả "Đã chốt" cuối tháng.
            </Text>
          </View>
        ) : null}

        {isLoading ? <ActivityIndicator /> : null}
        {!isLoading && (!data || data.length === 0) ? (
          <Text className="text-xs text-muted">Chưa có dữ liệu cho bậc này.</Text>
        ) : null}

        <View className="rounded-2xl border border-border bg-white overflow-hidden">
          {data?.map((entry, i) => (
            <LeaderboardRow key={entry.userId} entry={entry} last={i === data.length - 1} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LeaderboardRow({
  entry,
  last,
}: {
  entry: LeaderboardEntry | LeaderboardHistoryEntry;
  last?: boolean;
}) {
  const rewardAmount = 'rewardAmount' in entry ? entry.rewardAmount : null;
  return (
    <View className={`px-3.5 py-3 flex-row items-center gap-3 ${last ? '' : 'border-b border-border-soft'}`}>
      <Text className="w-6 font-mono-semibold text-sm text-ink text-center">{entry.rank}</Text>
      <Text className="flex-1 text-[13.5px] text-ink">{entry.alias}</Text>
      {rewardAmount ? (
        <Text className="font-mono-semibold text-[13px] text-primary">{formatVnd(rewardAmount)}</Text>
      ) : (
        <Text className="font-mono-semibold text-[13px] text-muted">{entry.score.toFixed(1)} điểm</Text>
      )}
    </View>
  );
}
