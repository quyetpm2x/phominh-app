// Định dạng VND — amount luôn là số nguyên đồng (bussiness §5.1, không còn lớp điểm/voucher trung gian).
export function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')}đ`;
}
