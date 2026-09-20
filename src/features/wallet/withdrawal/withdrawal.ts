// Preview values supplied by the withdrawal design; replace with wallet API data.
export const WITHDRAWAL_BALANCE = 1_850_000;
export const MIN_WITHDRAWAL = 50_000;
export const formatDong = (amount: number) => amount.toLocaleString('vi-VN');

export function validateWithdrawal(amount: number, balance: number) {
  if (!Number.isSafeInteger(amount) || amount < MIN_WITHDRAWAL) {
    return 'Số tiền rút tối thiểu là 50.000đ / lần.';
  }
  if (amount > balance) return 'Số tiền rút vượt quá số dư khả dụng.';
  return null;
}
