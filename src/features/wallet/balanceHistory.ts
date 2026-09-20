import { matchesBalanceOptions, type BalanceOptions } from './balanceFilterOptions';
import type { CustomIconProps } from '../../components/ui/CustomIcon';
export type BalanceFilter = 'all' | 'income' | 'outgoing' | 'rank' | 'referral';
export const balanceFilters: { key: BalanceFilter; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'income', label: 'Tiền vào (+)' },
  { key: 'outgoing', label: 'Tiền ra (-)' },
  { key: 'rank', label: 'Đua Top' },
  { key: 'referral', label: 'Hoa hồng' },
];
export interface BalanceEntry {
  date: string;
  status: 'success' | 'pending';
  id: string;
  title: string;
  amount: number;
  description: string;
  metadata: string;
  balance: number;
  category: BalanceFilter;
  icon: CustomIconProps['name'];
  background: string;
  success?: boolean;
}
export interface BalanceGroup {
  label: string;
  entries: BalanceEntry[];
}
// Static preview data supplied by Figma, not a live financial ledger.
export const balanceHistory: BalanceGroup[] = [
  {
    label: 'HÔM NAY, 10/10/2023',
    entries: [
      {
        id: 'review-8920',
        date: '2023-10-10',
        status: 'success',
        title: 'Thưởng bài review #8920',
        amount: 25000,
        description: 'Bài đăng tại Phở Bát Đàn đạt 100+ tương tác',
        metadata: '10:24 • Giao dịch tự động',
        balance: 1450000,
        category: 'income',
        icon: 'walletIncome',
        background: '#00BC7D1A',
      },
      {
        id: 'menu',
        date: '2023-10-10',
        status: 'success',
        title: 'Thưởng đăng bài có Menu',
        amount: 25000,
        description: 'Check-in kèm ảnh menu rõ nét tại The Coffee House',
        metadata: '08:15 • Giao dịch tự động',
        balance: 1425000,
        category: 'income',
        icon: 'walletIncome',
        background: '#00BC7D1A',
      },
    ],
  },
  {
    label: 'HÔM QUA, 09/10/2023',
    entries: [
      {
        id: 'withdraw',
        date: '2023-10-09',
        status: 'success',
        title: 'Rút tiền về MB Bank',
        amount: -500000,
        description: 'Chuyển khoản tới STK 0987****892 (MB Bank)',
        metadata: 'Thành công • 16:45',
        balance: 1400000,
        category: 'outgoing',
        icon: 'walletOutgoing',
        background: '#E639461A',
        success: true,
      },
    ],
  },
  {
    label: 'THÁNG 10, 2023',
    entries: [
      {
        id: 'rank',
        date: '2023-10-06',
        status: 'success',
        title: 'Thưởng đua Top Tuần #2',
        amount: 100000,
        description: 'Đạt Hạng 4 khu vực Hoàn Kiếm, Hà Nội',
        metadata: '06/10/2023 • 23:59',
        balance: 1900000,
        category: 'rank',
        icon: 'walletRank',
        background: '#FE9A001A',
      },
      {
        id: 'referral',
        date: '2023-10-04',
        status: 'success',
        title: 'Hoa hồng giới thiệu',
        amount: 20000,
        description: 'Người dùng @minhanh đăng bài viết đầu tiên',
        metadata: '04/10/2023 • 14:10',
        balance: 1800000,
        category: 'referral',
        icon: 'balanceReferral',
        background: '#AD46FF1A',
      },
    ],
  },
];
export const formatWalletMoney = (value: number, signed = false) =>
  `${signed && value > 0 ? '+' : ''}${value.toLocaleString('vi-VN')}đ`;
export function filterBalanceHistory(filter: BalanceFilter, options?: BalanceOptions) {
  return balanceHistory
    .map((group) => ({
      ...group,
      entries: group.entries.filter(
        (entry) =>
          (!options || matchesBalanceOptions(entry, options)) &&
          (filter === 'all' ||
            (filter === 'income'
              ? entry.amount > 0
              : filter === 'outgoing'
                ? entry.amount < 0
                : entry.category === filter)),
      ),
    }))
    .filter((group) => group.entries.length > 0);
}
