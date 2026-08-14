import { Pressable, Text, View } from 'react-native';

import { colors } from '../constants/design-tokens';
import {
  BACKGROUND_COLOR_PRESETS,
  FONT_SIZE_PRESETS,
  TEXT_COLOR_PRESETS,
  type PostFontSize,
} from '../constants/post-style-presets';

interface PostStyleToolsProps {
  textColor: string | null;
  backgroundColor: string | null;
  fontSize: PostFontSize | null;
  onTextColorChange: (color: string | null) => void;
  onBackgroundColorChange: (color: string | null) => void;
  onFontSizeChange: (size: PostFontSize | null) => void;
}

// Bộ công cụ style toàn bộ nội dung bài (mục 22) — giống Instagram/Threads Story: chọn màu chữ +
// nền + cỡ chữ từ preset có sẵn (post-style-presets.ts), áp cho CẢ đoạn text, không phải rich text.
export function PostStyleTools({
  textColor,
  backgroundColor,
  fontSize,
  onTextColorChange,
  onBackgroundColorChange,
  onFontSizeChange,
}: PostStyleToolsProps) {
  return (
    <View className="mt-4 gap-3">
      <StyleRow label="MÀU CHỮ">
        {TEXT_COLOR_PRESETS.map((preset) => (
          <ColorSwatch
            key={preset.label}
            color={preset.value ?? colors.ink.DEFAULT}
            selected={textColor === preset.value}
            onPress={() => onTextColorChange(preset.value)}
            showDefaultRing={preset.value === null}
          />
        ))}
      </StyleRow>

      <StyleRow label="NỀN">
        {BACKGROUND_COLOR_PRESETS.map((preset) => (
          <ColorSwatch
            key={preset.label}
            color={preset.value ?? colors.cream.DEFAULT}
            selected={backgroundColor === preset.value}
            onPress={() => onBackgroundColorChange(preset.value)}
            showDefaultRing={preset.value === null}
          />
        ))}
      </StyleRow>

      <StyleRow label="CỠ CHỮ">
        {FONT_SIZE_PRESETS.map((preset) => (
          <Pressable
            key={preset.value}
            onPress={() => onFontSizeChange(preset.value)}
            className={`h-8 px-3 rounded-full border items-center justify-center ${
              (fontSize ?? 'medium') === preset.value ? 'border-primary bg-primary-50' : 'border-border bg-white'
            }`}
          >
            <Text
              className={`font-sans-semibold text-xs ${
                (fontSize ?? 'medium') === preset.value ? 'text-primary' : 'text-ink'
              }`}
            >
              {preset.label}
            </Text>
          </Pressable>
        ))}
      </StyleRow>
    </View>
  );
}

function StyleRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View>
      <Text className="font-mono-medium text-xs tracking-wide text-muted mb-2">{label}</Text>
      <View className="flex-row flex-wrap gap-2">{children}</View>
    </View>
  );
}

function ColorSwatch({
  color,
  selected,
  onPress,
  showDefaultRing,
}: {
  color: string;
  selected: boolean;
  onPress: () => void;
  showDefaultRing?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: color,
        borderWidth: selected ? 2.5 : showDefaultRing ? 1 : 0,
        borderColor: selected ? colors.primary.DEFAULT : colors.border.strong,
      }}
    />
  );
}
