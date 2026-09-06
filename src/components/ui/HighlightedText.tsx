import { Text, type TextProps } from 'react-native';

import { colors } from '../../constants/design-tokens';
import { parseHighlightSegments } from '../../lib/highlightMarkup';

interface HighlightedTextProps extends TextProps {
  text: string;
  highlightColor?: string;
  highlightBackground?: string;
}

// Hiện content bài đăng có tô nổi cụm từ (xem highlightMarkup.ts) — tác giả tự bọc cụm cần tô bằng
// `==...==` lúc soạn bài (caption.tsx), ở đây chỉ tách ra và render, không tự đoán highlight.
export function HighlightedText({
  text,
  highlightColor = colors.primary.DEFAULT,
  highlightBackground = colors.primary[50],
  ...textProps
}: HighlightedTextProps) {
  const segments = parseHighlightSegments(text);
  return (
    <Text {...textProps}>
      {segments.map((segment, i) =>
        segment.highlighted ? (
          <Text
            key={i}
            style={{ backgroundColor: highlightBackground, color: highlightColor, fontWeight: '700' }}
          >
            {segment.text}
          </Text>
        ) : (
          <Text key={i}>{segment.text}</Text>
        ),
      )}
    </Text>
  );
}
