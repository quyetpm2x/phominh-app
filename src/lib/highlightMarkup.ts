
export const HIGHLIGHT_MARKER = '==';

export interface HighlightSegment {
  text: string;
  highlighted: boolean;
}

export function wrapHighlight(content: string, start: number, end: number): string {
  if (end <= start) return content;
  return content.slice(0, start) + HIGHLIGHT_MARKER + content.slice(start, end) + HIGHLIGHT_MARKER + content.slice(end);
}

export function clearHighlight(content: string): string {
  return content.split(HIGHLIGHT_MARKER).join('');
}

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
