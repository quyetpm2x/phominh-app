import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage } from '../../src/api/client';
import { FilterChip } from '../../src/components/ui/Chip';
import { formatVnd } from '../../src/lib/formatCurrency';
import { useMyBankAccounts, useRequestPayout } from '../../src/hooks/usePayments';
import { useWallet } from '../../src/hooks/useRewards';

const PAYOUT_MULTIPLE = 50_000;

// on.withdraw — yêu cầu rút thưởng, chỉ chọn bội số 50.000đ (mục 59, bussiness §5.1e). Ví là 1 số
// dư DUY NHẤT gộp cả thưởng leaderboard lẫn affiliate — source gửi lên chỉ để ghi sổ nội bộ, không
// ảnh hưởng số tiền rút được, nên không bắt user tự chọn.
export default function WithdrawScreen() {
  const { data: wallet, isLoading: loadingWallet } = useWallet();
  const { data: bankAccounts, isLoading: loadingBanks } = useMyBankAccounts();
  const requestPayout = useRequestPayout();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifiedAccount = bankAccounts?.find((a) => a.verifiedAt);
  const availableAmounts = useMemo(() => {
    if (!wallet) return [];
    const maxMultiple = Math.floor(wallet.balance / PAYOUT_MULTIPLE);
    return Array.from({ length: maxMultiple }, (_, i) => (i + 1) * PAYOUT_MULTIPLE);
  }, [wallet]);

  const onSubmit = async () => {
    if (!verifiedAccount || !selectedAmount) return;
    setError(null);
    try {
      const result = await requestPayout.mutateAsync({
        bankAccountId: verifiedAccount.id,
        amount: selectedAmount,
        source: 'leaderboard',
      });
      Alert.alert(
        'Đã gửi yêu cầu rút tiền',
        result.requiresManualApproval
          ? `Số tiền thực nhận sau thuế: ${formatVnd(result.netAmount)}. Cần admin duyệt thủ công trước khi chuyển.`
          : `Số tiền thực nhận sau thuế: ${formatVnd(result.netAmount)}.`,
        [{ text: 'Đã hiểu', onPress: () => router.back() }],
      );
    } catch (err) {
      setError(await extractErrorMessage(err));
    }
  };

  if (loadingWallet || loadingBanks) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Rút tiền</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <Text className="text-xs text-muted">Số dư khả dụng</Text>
        <Text className="mt-1 font-mono-semibold text-[26px] text-ink">{formatVnd(wallet?.balance ?? 0)}</Text>

        {!verifiedAccount ? (
          <View className="mt-4 rounded-2xl border-[1.5px] border-accent-200 bg-accent-50 p-3.5">
            <Text className="text-[13px] leading-[20px] text-accent-text">
              Cần liên kết + xác thực eKYC ít nhất 1 tài khoản ngân hàng trước khi rút tiền.
            </Text>
            <Pressable
              onPress={() => router.push('/rewards/link-bank')}
              className="mt-2.5 h-10 rounded-xl bg-ink items-center justify-center"
            >
              <Text className="font-sans-semibold text-[13.5px] text-white">Liên kết ngân hàng</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text className="mt-1 text-[11.5px] text-muted">
              Chuyển về {verifiedAccount.bankCode} · {verifiedAccount.accountHolderName}
            </Text>

            <Text className="mt-4.5 font-mono-medium text-xs tracking-wide text-muted">CHỌN SỐ TIỀN</Text>
            {availableAmounts.length === 0 ? (
              <Text className="mt-2.5 text-xs text-muted">
                Số dư chưa đủ 50.000đ để rút — cần tối thiểu {formatVnd(PAYOUT_MULTIPLE)}.
              </Text>
            ) : (
              <View className="mt-2.5 flex-row flex-wrap gap-1.5">
                {availableAmounts.map((amount) => (
                  <FilterChip
                    key={amount}
                    label={formatVnd(amount)}
                    selected={selectedAmount === amount}
                    onPress={() => setSelectedAmount(amount)}
                  />
                ))}
              </View>
            )}

            {error ? <Text className="mt-3 text-xs text-danger">{error}</Text> : null}

            <Pressable
              onPress={() => void onSubmit()}
              disabled={!selectedAmount || requestPayout.isPending}
              className={`mt-4.5 h-[52px] rounded-2xl items-center justify-center ${
                selectedAmount ? 'bg-primary' : 'bg-border'
              }`}
            >
              <Text className={`font-sans-semibold text-[15.5px] ${selectedAmount ? 'text-white' : 'text-muted'}`}>
                Xác nhận rút tiền
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
