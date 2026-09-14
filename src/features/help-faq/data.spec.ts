import { FAQ_ITEMS, filterFaq } from './data';
describe('FAQ filtering', () => {
  it('shows all questions with no filter', () => expect(filterFaq('  ', null)).toEqual(FAQ_ITEMS));
  it('finds Vietnamese words without accents', () =>
    expect(filterFaq('DIEM UY TIN', null).map((item) => item.id)).toEqual(['trust', 'appeal']));
  it('combines category and search, including answer text', () => {
    expect(filterFaq('napas', 'wallet').map((item) => item.id)).toEqual(['wallet']);
    expect(filterFaq('napas', 'shop')).toEqual([]);
  });
  it('matches đ and multiple search terms', () =>
    expect(filterFaq('dang ky quan', null).map((item) => item.id)).toEqual(['shop']));
});
