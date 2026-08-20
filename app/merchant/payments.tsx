import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatVnd } from '../../src/lib/formatCurrency';
import type { MerchantPayment } from '../../src/api/endpoints/merchants';
import { useMerchantPayments } from '../../src/hooks/useMerchant';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Đang xử lý',
  success: 'Thành công',
  failed: 'Thất bại',
};

// Lịch sử thanh toán gói Premium Listing (tai-lieu-chuc-nang.md #46) — backend GET .../me/payments
// đã có sẵn từ trước, mobile chưa từng có màn nào gọi tới.
export default function MerchantPaymentsScreen() {
  const { data: payments, isLoading } = useMerchantPayments();

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Lịch sử thanh toán</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : !payments || payments.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-sm text-muted">Chưa có giao dịch thanh toán gói nào.</Text>
        </View>
      ) : (
        <ScrollView contentContainerClassName="p-4.5">
          <View className="rounded-2xl border border-border bg-white overflow-hidden">
            {payments.map((p, i) => (
              <PaymentRow key={p.id} payment={p} last={i === payments.length - 1} />
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function PaymentRow({ payment, last }: { payment: MerchantPayment; last: boolean }) {
  return (
    <View className={`px-3.5 py-3 ${last ? '' : 'border-b border-border-soft'}`}>
      <View className="flex-row items-center justify-between">
        <Text className="font-sans-semibold text-sm text-ink">
          {payment.subscription?.planKey ?? 'Gói Premium Listing'}
        </Text>
        <Text className="font-mono-semibold text-sm text-ink">{formatVnd(payment.amount)}</Text>
      </View>
      <View className="mt-1 flex-row items-center justify-between">
        <Text className="text-[11.5px] text-muted">
          {new Date(payment.createdAt).toLocaleString('vi-VN')} · {payment.provider.toUpperCase()}
        </Text>
        <Text className="text-[11.5px] text-muted">{STATUS_LABEL[payment.status] ?? payment.status}</Text>
      </View>
    </View>
  );
}
