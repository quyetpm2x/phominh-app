// Tô nổi 1 cụm từ trong content bài đăng — KHÔNG dùng field riêng, mã hoá ngay trong chính chuỗi
// content bằng cặp dấu `==...==` (cùng quy ước highlight của Markdown/Obsidian, người dùng khó gõ
// trùng ngẫu nhiên). BE lưu/trả nguyên văn content, không biết/không cần biết gì về markup này —
// FE tự bọc lúc soạn bài (caption.tsx) và tự tách lúc hiển thị (HighlightedText.tsx).
export const HIGHLIGHT_MARKER = '==';

export interface HighlightSegment {
  text: string;
  highlighted: boolean;
}

// Bọc đoạn [start, end) của content bằng cặp marker — dùng khi người dùng bôi đen 1 vùng trong
// TextInput rồi bấm "Tô nổi". Không làm gì nếu vùng chọn rỗng.
export function wrapHighlight(content: string, start: number, end: number): string {
  if (end <= start) return content;
  return content.slice(0, start) + HIGHLIGHT_MARKER + content.slice(start, end) + HIGHLIGHT_MARKER + content.slice(end);
}

// Bỏ TẤT CẢ marker khỏi content — dùng cho nút "Xoá tô nổi" (không rõ user muốn bỏ đoạn nào, xoá
// hết đơn giản và dễ hiểu hơn phải chọn lại đúng đoạn cũ).
export function clearHighlight(content: string): string {
  return content.split(HIGHLIGHT_MARKER).join('');
}

// Tách content thành các đoạn thường/được tô, marker bị loại khỏi text hiển thị. Không xử lý
// marker lồng nhau (không phát sinh vì wrapHighlight luôn bọc theo cặp phẳng).
export function parseHighlightSegments(text: string): HighlightSegment[] {
  const segments: HighlightSegment[] = [];
  const pattern = /==(.+?)==/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), highlighted: false });
    }
    segments.push({ text: match[1], highlighted: true });
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), highlighted: false });
  }
  return segments;
}
