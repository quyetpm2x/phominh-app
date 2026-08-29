import { clearHighlight, parseHighlightSegments, wrapHighlight } from './highlightMarkup';

describe('wrapHighlight', () => {
  it('bọc đúng vùng chọn bằng cặp marker ==', () => {
    expect(wrapHighlight('Còn 5 suất bún chả nem cua bể nhé', 4, 29)).toBe(
      'Còn ==5 suất bún chả nem cua bể== nhé',
    );
  });

  it('không đổi gì nếu vùng chọn rỗng (end <= start)', () => {
    expect(wrapHighlight('Còn 5 suất', 3, 3)).toBe('Còn 5 suất');
    expect(wrapHighlight('Còn 5 suất', 5, 2)).toBe('Còn 5 suất');
  });
});

describe('clearHighlight', () => {
  it('bỏ hết marker == khỏi content', () => {
    expect(clearHighlight('Còn ==5 suất bún chả==nhé')).toBe('Còn 5 suất bún chảnhé');
  });

  it('không đổi gì nếu content không có marker', () => {
    expect(clearHighlight('Còn 5 suất bún chả')).toBe('Còn 5 suất bún chả');
  });
});

describe('parseHighlightSegments', () => {
  it('tách đúng 3 phần: trước / được tô / sau', () => {
    expect(parseHighlightSegments('Còn ==5 suất bún chả nem cua bể==, ai lấy nốt')).toEqual([
      { text: 'Còn ', highlighted: false },
      { text: '5 suất bún chả nem cua bể', highlighted: true },
      { text: ', ai lấy nốt', highlighted: false },
    ]);
  });

  it('trả về nguyên văn 1 đoạn không tô nếu không có marker nào', () => {
    expect(parseHighlightSegments('Quán bún riêu mở cửa lại rồi')).toEqual([
      { text: 'Quán bún riêu mở cửa lại rồi', highlighted: false },
    ]);
  });

  it('xử lý được nhiều cụm được tô trong cùng 1 câu', () => {
    expect(parseHighlightSegments('==A== và ==B==')).toEqual([
      { text: 'A', highlighted: true },
      { text: ' và ', highlighted: false },
      { text: 'B', highlighted: true },
    ]);
  });

  it('chuỗi rỗng trả về mảng rỗng', () => {
    expect(parseHighlightSegments('')).toEqual([]);
  });
});
