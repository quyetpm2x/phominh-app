import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { TrustHistoryItem } from '../../src/api/endpoints/users';
import { TrustBadgeCard } from '../../src/components/TrustBadgeCard';
import { useMe } from '../../src/hooks/useMe';
import { useTrustHistory } from '../../src/hooks/useUserProfile';
import { trustRules } from '../../src/mocks/phoMinh';

const SOURCE_LABEL: Record<TrustHistoryItem['sourceType'], string> = {
  vote: 'Được vote hữu ích',
  appeal_reversal: 'Khiếu nại được chấp nhận',
  violation_confirmed: 'Vi phạm bị xác nhận',
};

const SEVERITY_LABEL: Record<NonNullable<TrustHistoryItem['severity']>, string> = {
  light: 'nhẹ',
  medium: 'trung bình',
  severe: 'nghiêm trọng',
};

function historyLabel(item: TrustHistoryItem): string {
  const base = SOURCE_LABEL[item.sourceType];
  return item.severity ? `${base} (${SEVERITY_LABEL[item.severity]})` : base;
}

const APPEAL_STATUS_LABEL: Record<NonNullable<TrustHistoryItem['appealStatus']>, string> = {
  pending: 'Đang chờ xử lý',
  approved: 'Khiếu nại được chấp nhận',
  rejected: 'Khiếu nại bị từ chối',
};

// Chỉ cho khiếu nại lần bị trừ điểm (violation_confirmed) chưa từng khiếu nại trước đó (mục 61).
function canAppeal(item: TrustHistoryItem): boolean {
  return item.sourceType === 'violation_confirmed' && item.appealStatus === null;
}

// on.trustDetail — điểm uy tín, nguồn tăng điểm, lịch sử thật (mục 35 + 62). Trước đây toàn bộ màn
// dùng mock: cả điểm số THÔ (currentUser.trustScore — trái nguyên tắc mục 17) lẫn 1 danh sách
// "LỊCH SỬ GẦN ĐÂY" bịa hẳn ra (trustHistory mock) — đã bỏ khi làm mục 35, nay nối lại bằng dữ liệu
// thật qua GET /users/me/trust-history (mục 62, mới thêm). trustRules giữ nguyên vì là mô tả LUẬT
// CHUNG của hệ thống, không phải dữ liệu cá nhân.
export default function TrustDetailScreen() {
  const { data: me } = useMe();
  const { data: history } = useTrustHistory();

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Điểm uy tín</Text>
      </View>

      {!me ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView contentContainerClassName="p-4.5">
          <View className="rounded-2xl border border-border bg-white p-4">
            <TrustBadgeCard
              trustBadgeLabel={me.trustBadgeLabel}
              trustTier={me.trustTier}
              pointsToNextTier={me.pointsToNextTier}
            />
          </View>

          <Text className="mt-4 font-mono-medium text-xs tracking-wide text-muted">ĐIỂM TĂNG TỪ ĐÂU</Text>
          <View className="mt-2.5 rounded-2xl border border-border bg-white overflow-hidden">
            {trustRules.map((r, i) => (
              <View key={r.label} className={`px-3.5 py-3 flex-row ${i < trustRules.length - 1 ? 'border-b border-border-soft' : ''}`}>
                <Text className="flex-1 text-[13.5px] text-ink">{r.label}</Text>
                <Text className="font-mono-medium text-[12.5px] text-muted">{r.points}</Text>
              </View>
            ))}
          </View>

          <View className="mt-3.5 rounded-2xl bg-primary-50 border border-primary-100 p-3.5">
            <Text className="text-xs leading-[19px] text-primary">
              Không có nút hạ điểm. Không ai — kể cả đối thủ cạnh tranh — dìm được điểm của bạn.
            </Text>
          </View>

          {history && history.length > 0 ? (
            <>
              <Text className="mt-4.5 font-mono-medium text-xs tracking-wide text-muted">LỊCH SỬ GẦN ĐÂY</Text>
              <View className="mt-2.5 rounded-2xl border border-border bg-white overflow-hidden">
                {history.map((h, i) => (
                  <View
                    key={h.id}
                    className={`px-3.5 py-3 flex-row items-center gap-2 ${i < history.length - 1 ? 'border-b border-border-soft' : ''}`}
                  >
                    <View className="flex-1">
                      <Text className="text-[13px] text-ink">{historyLabel(h)}</Text>
                      <Text className="text-[11px] text-muted-light mt-0.5">
                        {new Date(h.createdAt).toLocaleDateString('vi-VN')}
                      </Text>
                      {h.appealStatus ? (
                        <Text className="text-[11px] text-muted mt-0.5">
                          {APPEAL_STATUS_LABEL[h.appealStatus]}
                        </Text>
                      ) : null}
                    </View>
                    <Text
                      className={`font-mono-semibold text-[13px] ${h.delta >= 0 ? 'text-primary' : 'text-danger-text'}`}
                    >
                      {h.delta >= 0 ? '+' : ''}
                      {Math.round(h.delta)}
                    </Text>
                    {canAppeal(h) ? (
                      <Pressable
                        onPress={() =>
                          router.push({
                            pathname: '/profile/appeal',
                            params: { historyId: h.id, penaltyLabel: historyLabel(h) },
                          })
                        }
                        className="ml-1 rounded-full border border-border px-2.5 py-1"
                      >
                        <Text className="text-[11px] text-ink">Khiếu nại</Text>
                      </Pressable>
                    ) : null}
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
