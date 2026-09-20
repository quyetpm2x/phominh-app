import type { BalanceEntry } from './balanceHistory';
export type BalancePeriod = 'month' | 'previous' | 'quarter' | 'custom';
export interface BalanceOptions {
  period: BalancePeriod;
  from: string;
  to: string;
  types: string[];
  status: 'all' | 'success' | 'pending';
}
export const defaultBalanceOptions: BalanceOptions = {
  period: 'custom',
  from: '2023-10-01',
  to: '2023-10-10',
  types: [],
  status: 'all',
};
// Anchor relative periods to the preview dataset's date until a live ledger is connected.
export function periodDates(period: BalancePeriod) {
  return period === 'previous'
    ? { from: '2023-09-01', to: '2023-09-30' }
    : period === 'quarter'
      ? { from: '2023-08-01', to: '2023-10-10' }
      : { from: '2023-10-01', to: '2023-10-10' };
}
export function matchesBalanceOptions(entry: BalanceEntry, options: BalanceOptions) {
  return (
    entry.date >= options.from &&
    entry.date <= options.to &&
    (!options.types.length || options.types.includes(entry.category)) &&
    (options.status === 'all' || entry.status === options.status)
  );
}
export function dateRangeDays(from: string, to: string) {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86400000) + 1;
}
export const dateLabel = (date: string) => date.split('-').reverse().join('/');
