import { createCapturedPhoto } from '../capture/capturePhoto';
import { useNewPostDraft } from './draft';

describe('new post draft handoff', () => {
  it('starts a status with real identity, unlimited display and no previous content', () => {
    useNewPostDraft
      .getState()
      .update({
        text: 'Cũ',
        textColor: '#FF416C',
        photos: [createCapturedPhoto('file://old-status.jpg', 'library', null)],
      });
    useNewPostDraft.getState().startStatus();
    expect(useNewPostDraft.getState().draft).toMatchObject({
      text: '',
      photos: [],
      anonymous: false,
      autoHide: false,
    });
    expect(useNewPostDraft.getState().draft.textColor).toBeUndefined();
  });
  it('keeps written status when attaching a library photo', () => {
    useNewPostDraft.getState().startStatus();
    useNewPostDraft.getState().update({ text: 'Hàng xóm ơi', textColor: '#5D5950' });
    useNewPostDraft
      .getState()
      .update({ photos: [createCapturedPhoto('file://status.jpg', 'library', null)] });
    expect(useNewPostDraft.getState().draft).toMatchObject({
      text: 'Hàng xóm ơi',
      textColor: '#5D5950',
      autoHide: false,
    });
  });
  it('does not complete an empty post', () => {
    useNewPostDraft.getState().update({ photos: [], text: '  ' });
    expect(useNewPostDraft.getState().completePreview()).toBe(false);
  });
  it('snapshots content and expiry settings independently of later edits', () => {
    useNewPostDraft
      .getState()
      .start(createCapturedPhoto('file://completed.jpg', 'camera', null), 'TIN TỨC XÓM');
    useNewPostDraft.getState().update({ text: 'Bài vừa tạo', autoHide: false });
    expect(useNewPostDraft.getState().completePreview()).toBe(true);
    useNewPostDraft.getState().update({ text: 'Bài tiếp theo', photos: [], autoHide: true });
    expect(useNewPostDraft.getState().completion).toMatchObject({ text: 'Bài vừa tạo', autoHide: false });
    expect(useNewPostDraft.getState().completion?.photos[0].uri).toBe('file://completed.jpg');
  });
  beforeEach(() => useNewPostDraft.setState({ sourceUri: null }));
  it('carries the reviewed photo and selected category into the composer', () => {
    const photo = createCapturedPhoto('file://capture.jpg', 'camera', null, 1234);
    useNewPostDraft.getState().start(photo, 'HỎI ĐÁP');
    expect(useNewPostDraft.getState().draft.photos).toEqual([photo]);
    expect(useNewPostDraft.getState().draft.category).toBe('HỎI ĐÁP');
  });
  it('preserves edits when returning from review with the same photo', () => {
    const photo = createCapturedPhoto('file://same.jpg', 'library', null);
    useNewPostDraft.getState().start(photo, 'TIN TỨC XÓM');
    useNewPostDraft.getState().update({ text: 'Tin mới', precise: false, topic: 'warning' });
    useNewPostDraft.getState().start(photo, 'TIN TỨC XÓM');
    expect(useNewPostDraft.getState().draft).toMatchObject({
      text: 'Tin mới',
      precise: false,
      topic: 'warning',
    });
  });
  it('starts fresh after retaking a different photo', () => {
    useNewPostDraft.getState().start(createCapturedPhoto('file://old.jpg', 'camera', null), 'TIN TỨC XÓM');
    useNewPostDraft.getState().update({ text: 'Cũ' });
    useNewPostDraft.getState().start(createCapturedPhoto('file://new.jpg', 'camera', null), 'QUÁN XÓM');
    expect(useNewPostDraft.getState().draft.text).toBe('');
    expect(useNewPostDraft.getState().draft.photos[0].uri).toBe('file://new.jpg');
  });
});
