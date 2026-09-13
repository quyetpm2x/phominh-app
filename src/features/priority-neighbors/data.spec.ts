import { filterNeighbors, INITIAL_PRIORITY_IDS, NEIGHBORS, restorePriorityIds } from './data';

test('search supports Vietnamese without accents and apartment numbers', () => {
  expect(filterNeighbors(NEIGHBORS, 'co hoa', 'all').map((n) => n.id)).toEqual(['hoa']);
  expect(filterNeighbors(NEIGHBORS, '0802', 'all').map((n) => n.id)).toEqual(['lan']);
  expect(filterNeighbors(NEIGHBORS, 'bao ve', 'all').map((n) => n.id)).toEqual(['hung']);
});
test('role filters combine with search', () => {
  expect(filterNeighbors(NEIGHBORS, '', 'shops').map((n) => n.id)).toEqual(['hoa']);
  expect(filterNeighbors(NEIGHBORS, 'hoa', 'residents')).toEqual([]);
});
test('an intentionally empty saved list stays empty after reopening', () => {
  expect(restorePriorityIds('[]')).toEqual([]);
  expect(restorePriorityIds(null)).toEqual(INITIAL_PRIORITY_IDS);
});
test('saved IDs are deduplicated and unknown records are ignored', () => {
  expect(restorePriorityIds('["lan","lan","missing",42,"hoa"]')).toEqual(['lan', 'hoa']);
  expect(restorePriorityIds('broken')).toEqual(INITIAL_PRIORITY_IDS);
});
