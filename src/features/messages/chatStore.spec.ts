import { useChatStore } from './chatStore';
import { matchesMessage } from './data';
beforeEach(() => useChatStore.setState({ readIds: [], localMessages: {} }));
test('reading one conversation does not mark other conversations read', () => {
  useChatStore.getState().markRead('hoa');
  useChatStore.getState().markRead('hoa');
  expect(useChatStore.getState().readIds).toEqual(['hoa']);
  useChatStore.getState().markAllRead(['hoa', 'nam']);
  expect(useChatStore.getState().readIds).toEqual(['hoa', 'nam']);
});
test('rejects empty messages and separates drafts by recipient without claiming delivery', () => {
  expect(useChatStore.getState().addLocalMessage('hoa', '  ')).toBe(false);
  expect(useChatStore.getState().addLocalMessage('hoa', ' Xin chào ')).toBe(true);
  const state = useChatStore.getState();
  expect(state.localMessages.hoa[0]).toMatchObject({ text: 'Xin chào', outgoing: true, localOnly: true });
  expect(state.localMessages.nam).toBeUndefined();
});
test('allows image-only local messages', () => {
  expect(useChatStore.getState().addLocalMessage('nam', '', 'file:///test.jpg')).toBe(true);
  expect(useChatStore.getState().localMessages.nam[0]).toMatchObject({
    image: 'file:///test.jpg',
    localOnly: true,
  });
});
test('search supports unaccented Vietnamese in names and message content', () => {
  expect(matchesMessage('co hoa', 'Cô Hoa Bún Chả')).toBe(true);
  expect(matchesMessage('dong thung', 'Nam', 'Nước khoáng đóng thùng')).toBe(true);
  expect(matchesMessage('khong co', 'Cô Hoa')).toBe(false);
});
