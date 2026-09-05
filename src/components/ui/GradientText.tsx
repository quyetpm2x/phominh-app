import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import type { ReactNode } from "react";
import type { TextStyle } from "react-native";
import { Text } from "react-native";

interface GradientTextProps {
  children: ReactNode;
  colors: [string, string, ...string[]];
  direction?: "horizontal" | "vertical";
  style?: TextStyle;
  className?: string;
}

// Chữ tô gradient thật — mockup dùng CSS `bg-clip-text text-transparent` (cắt gradient theo hình
// chữ), RN không có tương đương native nên cần MaskedView: render gradient full-size, rồi dùng chữ
// (transparent, chỉ giữ hình dạng alpha) làm "khuôn" che — đúng cơ chế reverse của CSS. Trước đó
// dùng màu đặc (text-primary) do chưa cài @react-native-masked-view/masked-view.
export function GradientText({
  children,
  colors,
  direction = "horizontal",
  style,
  className,
}: GradientTextProps) {
  const isVertical = direction === "vertical";

  return (
    <MaskedView
      maskElement={
        <Text style={style} className={className}>
          {children}
        </Text>
      }
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={isVertical ? { x: 0, y: 1 } : { x: 1, y: 0 }}
      >
        <Text style={[style, { opacity: 0 }]} className={className}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}
