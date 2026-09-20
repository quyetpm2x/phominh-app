import { validateWithdrawal } from './withdrawal';

describe('validateWithdrawal', () => {
  it('accepts the minimum and the entire available balance', () => {
    expect(validateWithdrawal(50_000, 1_850_000)).toBeNull();
    expect(validateWithdrawal(1_850_000, 1_850_000)).toBeNull();
  });

  it.each([0, 49_999, -1, 50_000.5, NaN, Infinity])('rejects invalid amount %s', (amount) => {
    expect(validateWithdrawal(amount, 1_850_000)).not.toBeNull();
  });

  it('rejects amounts exceeding the available balance', () => {
    expect(validateWithdrawal(1_850_001, 1_850_000)).toBe('Số tiền rút vượt quá số dư khả dụng.');
  });
});
