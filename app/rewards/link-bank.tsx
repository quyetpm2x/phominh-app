import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage } from '../../src/api/client';
import type { BankAccount } from '../../src/api/endpoints/payments';
import { TextInput } from '../../src/components/ui/TextInput';
import { useLinkBankAccount, useMyBankAccounts, useUnlinkBankAccount } from '../../src/hooks/usePayments';

// on.linkBank — liên kết tài khoản ngân hàng qua eKYC (mục 53/54, bussiness §5.1a). eKYC thật
// (Momo/VNPay) CHƯA tích hợp — verifiedAt do phía vận hành xác thực thủ công ở scaffold này, tài
// khoản mới liên kết hiện "chờ xác thực" cho tới khi đó.
export default function LinkBankScreen() {
  const { data: accounts, isLoading } = useMyBankAccounts();
  const linkAccount = useLinkBankAccount();
  const unlinkAccount = useUnlinkBankAccount();
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    bankCode.trim().length > 0 && accountNumber.trim().length > 0 && accountHolderName.trim().length > 0;

  const onUnlink = (account: BankAccount) => {
    Alert.alert('Gỡ tài khoản ngân hàng?', `${account.bankCode} · ${account.accountHolderName}`, [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Gỡ',
        style: 'destructive',
        onPress: async () => {
          try {
            await unlinkAccount.mutateAsync(account.id);
          } catch (err) {
            setError(await extractErrorMessage(err));
          }
        },
      },
    ]);
  };

  const onSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    try {
      await linkAccount.mutateAsync({
        bankCode: bankCode.trim().toUpperCase(),
        accountNumber: accountNumber.trim(),
        accountHolderName: accountHolderName.trim(),
      });
      setBankCode('');
      setAccountNumber('');
      setAccountHolderName('');
    } catch (err) {
      setError(await extractErrorMessage(err));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Tài khoản ngân hàng</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        {isLoading ? <ActivityIndicator /> : null}

        {accounts && accounts.length > 0 ? (
          <View className="rounded-2xl border border-border bg-white overflow-hidden">
            {accounts.map((account, i) => (
              <BankAccountRow
                key={account.id}
                account={account}
                last={i === accounts.length - 1}
                onUnlink={() => onUnlink(account)}
              />
            ))}
          </View>
        ) : null}

        <Text className="mt-5 font-mono-medium text-xs tracking-wide text-muted">LIÊN KẾT TÀI KHOẢN MỚI</Text>
        <View className="mt-2.5 rounded-2xl border border-border bg-white overflow-hidden">
          <View className="px-3.5 py-3 border-b border-border-soft">
            <Text className="text-[11.5px] text-muted mb-1">Mã ngân hàng</Text>
            <TextInput
              value={bankCode}
              onChangeText={setBankCode}
              placeholder="VD: VCB, TCB, MB, ACB..."
              autoCapitalize="characters"
              className="h-9 px-0 border-0 text-[14.5px] font-sans-semibold"
            />
          </View>
          <View className="px-3.5 py-3 border-b border-border-soft">
            <Text className="text-[11.5px] text-muted mb-1">Số tài khoản</Text>
            <TextInput
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="Nhập số tài khoản"
              keyboardType="number-pad"
              className="h-9 px-0 border-0 text-[14.5px] font-sans-semibold"
            />
          </View>
          <View className="px-3.5 py-3">
            <Text className="text-[11.5px] text-muted mb-1">Tên chủ tài khoản</Text>
            <TextInput
              value={accountHolderName}
              onChangeText={setAccountHolderName}
              placeholder="Đúng như trên thẻ ngân hàng"
              autoCapitalize="characters"
              className="h-9 px-0 border-0 text-[14.5px] font-sans-semibold"
            />
          </View>
        </View>

        {error ? <Text className="mt-3 text-xs text-danger">{error}</Text> : null}

        <Pressable
          onPress={() => void onSubmit()}
          disabled={!canSubmit || linkAccount.isPending}
          className={`mt-4 h-[52px] rounded-2xl items-center justify-center ${canSubmit ? 'bg-ink' : 'bg-border'}`}
        >
          <Text className={`font-sans-semibold text-[15.5px] ${canSubmit ? 'text-white' : 'text-muted'}`}>
            Liên kết tài khoản
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function BankAccountRow({
  account,
  last,
  onUnlink,
}: {
  account: BankAccount;
  last?: boolean;
  onUnlink: () => void;
}) {
  return (
    <View className={`px-3.5 py-3 flex-row items-center gap-2 ${last ? '' : 'border-b border-border-soft'}`}>
      <View className="flex-1">
        <Text className="font-sans-semibold text-[13.5px] text-ink">
          {account.bankCode} · {account.accountHolderName}
        </Text>
        <Text className="mt-0.5 text-[11px] text-muted">
          Liên kết {new Date(account.createdAt).toLocaleDateString('vi-VN')}
        </Text>
      </View>
      {account.verifiedAt ? (
        <Text className="text-[11.5px] font-sans-semibold text-primary">Đã xác thực</Text>
      ) : (
        <Text className="text-[11.5px] font-sans-semibold text-accent-text">Chờ xác thực</Text>
      )}
      <Pressable onPress={onUnlink} className="ml-1 h-7 w-7 items-center justify-center">
        <Text className="text-[15px] text-danger">✕</Text>
      </Pressable>
    </View>
  );
}
