import { router } from 'expo-router';
import { LOCAL_USER_ID } from '../../lib/personalProfile';
import { findResident, openResidentProfile } from './resident';

jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

beforeEach(() => jest.clearAllMocks());

test('groups posts by author identity rather than post ID', () => {
  const resident = findResident('ha');
  expect(resident?.posts.map((post) => post.id)).toEqual(['ha', 'quyet']);
  expect(resident?.posts.every((post) => post.authorId === resident.id)).toBe(true);
  expect(findResident('quyet')).toBeNull();
});

test('supports neighbors without posts and rejects unknown or own profiles', () => {
  expect(findResident('lan')?.posts).toEqual([]);
  expect(findResident('missing')).toBeNull();
  expect(findResident(LOCAL_USER_ID)).toBeNull();
});

test('opens other residents by ID and sends the current user to their own tab', () => {
  openResidentProfile('hoa');
  expect(router.push).toHaveBeenLastCalledWith({ pathname: '/resident/[id]', params: { id: 'hoa' } });
  openResidentProfile(LOCAL_USER_ID);
  expect(router.push).toHaveBeenLastCalledWith('/home?tab=profile');
});
