import type { SvgProps } from "react-native-svg";

/** Shared contract for scalable project SVG icons. */
export type IconProps = Omit<
  SvgProps,
  "fill" | "height" | "viewBox" | "width"
> & {
  color?: string;
  size?: number;
};
