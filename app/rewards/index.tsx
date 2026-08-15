import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatVnd } from '../../src/lib/formatCurrency';
import type { RewardLedgerEntry } from '../../src/api/endpoints/rewards';
import { useWallet } from '../../src/hooks/useRewards';

const LEDGER_LABEL: Record<RewardLedgerEntry['type'], string> = {
  leaderboard: 'Thưởng bảng xếp hạng',
  referral: 'Thưởng giới thiệu',
  redeemed_voucher: 'Đổi voucher',
  payout: 'Rút tiền',
};

// on.wallet — ví thưởng: số dư, lịch sử giao dịch, lối vào rút tiền/liên kết ngân hàng/bảng xếp
// hạng/công tắc kiếm tiền (mục 58, bussiness §5.1).
export default function WalletScreen() {
  const { data: wallet, isLoading } = useWallet();

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Ví thưởng</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        {isLoading ? <ActivityIndicator /> : null}

        {wallet ? (
          <View className="rounded-2xl border border-border bg-white p-4">
            <Text className="text-xs text-muted">Số dư khả dụng</Text>
            <Text className="mt-1 font-mono-semibold text-[30px] text-ink">{formatVnd(wallet.balance)}</Text>
            <Pressable
              onPress={() => router.push('/rewards/withdraw')}
              className="mt-3.5 h-11 rounded-xl bg-primary items-center justify-center"
            >
              <Text className="font-sans-semibold text-sm text-white">Rút tiền</Text>
            </Pressable>
          </View>
        ) : null}

        <View className="mt-3.5 rounded-2xl border border-border bg-white overflow-hidden">
          <NavRow label="Kiếm tiền qua bài viết & Affiliate" onPress={() => router.push('/rewards/earn-settings')} />
          <NavRow label="Mời bạn bè (mã giới thiệu)" onPress={() => router.push('/rewards/referral')} />
          <NavRow label="Bảng xếp hạng thưởng" onPress={() => router.push('/rewards/leaderboard')} />
          <NavRow label="Tài khoản ngân hàng đã liên kết" onPress={() => router.push('/rewards/link-bank')} last />
        </View>

        <Text className="mt-5 font-mono-medium text-xs tracking-wide text-muted">LỊCH SỬ GIAO DỊCH</Text>
        {wallet && wallet.recentLedger.length === 0 ? (
          <Text className="mt-2.5 text-xs text-muted">Chưa có giao dịch nào.</Text>
        ) : null}
        <View className="mt-2.5 rounded-2xl border border-border bg-white overflow-hidden">
          {wallet?.recentLedger.map((entry, i) => (
            <LedgerRow key={entry.id} entry={entry} last={i === wallet.recentLedger.length - 1} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LedgerRow({ entry, last }: { entry: RewardLedgerEntry; last?: boolean }) {
  const positive = entry.amount >= 0;
  return (
    <View className={`px-3.5 py-3 flex-row items-center ${last ? '' : 'border-b border-border-soft'}`}>
      <View className="flex-1">
        <Text className="text-[13.5px] text-ink">{LEDGER_LABEL[entry.type]}</Text>
        <Text className="mt-0.5 text-[11px] text-muted">
          {new Date(entry.createdAt).toLocaleString('vi-VN')}
        </Text>
      </View>
      <Text
        className={`font-mono-semibold text-sm ${positive ? 'text-primary' : 'text-danger-text'}`}
      >
        {positive ? '+' : ''}
        {formatVnd(entry.amount)}
      </Text>
    </View>
  );
}

function NavRow({ label, onPress, last }: { label: string; onPress: () => void; last?: boolean }) {
  return (
    <Pressable onPress={onPress} className={`px-3.5 py-3.5 flex-row ${last ? '' : 'border-b border-border-soft'}`}>
      <Text className="flex-1 text-sm text-ink">{label}</Text>
      <Text className="text-muted-light">›</Text>
    </Pressable>
  );
}
