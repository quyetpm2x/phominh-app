import { filterBalanceHistory, formatWalletMoney } from './balanceHistory';
describe('balance history filters', () => {
  it('keeps all five records and their chronological groups', () => {
    expect(filterBalanceHistory('all').map((group) => group.entries.length)).toEqual([2, 1, 2]);
  });
  it('includes ranking and referral rewards in incoming money', () => {
    const groups = filterBalanceHistory('income');
    expect(groups.flatMap((g) => g.entries)).toHaveLength(4);
    expect(groups.every((g) => g.entries.every((e) => e.amount > 0))).toBe(true);
  });
  it('removes empty groups for outgoing money', () => {
    const groups = filterBalanceHistory('outgoing');
    expect(groups).toHaveLength(1);
    expect(groups[0].entries[0].amount).toBe(-500000);
  });
  it.each(['rank', 'referral'] as const)('restricts %s to its category', (filter) => {
    expect(
      filterBalanceHistory(filter)
        .flatMap((g) => g.entries)
        .map((e) => e.category),
    ).toEqual([filter]);
  });
  it('calculates visible totals and formats signs', () => {
    const total = filterBalanceHistory('referral')[0].entries.reduce((sum, e) => sum + e.amount, 0);
    expect(formatWalletMoney(total, true)).toBe('+20.000đ');
    expect(formatWalletMoney(-500000, true)).toBe('-500.000đ');
  });
});

describe('advanced balance filters', () => {
 it('includes both boundaries and combines transaction type and status', () => {
  const options={period:'custom' as const,from:'2023-10-04',to:'2023-10-06',types:['referral','rank'],status:'success' as const};
  expect(filterBalanceHistory('all',options).flatMap(g=>g.entries).map(e=>e.id)).toEqual(['rank','referral']);
  expect(filterBalanceHistory('outgoing',options)).toEqual([]);
 });
 it('returns no records for pending or an empty date range', () => {
  const options={period:'custom' as const,from:'2023-10-01',to:'2023-10-10',types:[],status:'pending' as const};
  expect(filterBalanceHistory('all',options)).toEqual([]);
  expect(filterBalanceHistory('all',{...options,status:'all',from:'2023-11-01',to:'2023-11-30'})).toEqual([]);
 });
});
