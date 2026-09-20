import { SvgXml } from 'react-native-svg';

import { icons } from '../../constants/icons';
import type { IconProps } from './icon/types';

export type CustomIconProps = IconProps & {
  name: keyof typeof icons;
  /** Override single-tone exported SVG fills when a design needs a light-on-dark treatment. */
  forceColor?: boolean;
};

export function CustomIcon({ name, size, color, forceColor = false, ...svgProps }: CustomIconProps) {
  const icon = icons[name];
  const resolvedSize = size ?? icon.size;

  return (
    <SvgXml
      xml={forceColor && color ? icon.xml.replace(/fill="([^"]+)"/g, (_, value: string) => value === 'none' ? 'fill="none"' : `fill="${color}"`) : icon.xml}
      width={resolvedSize}
      height={resolvedSize * icon.heightRatio}
      color={color ?? icon.color}
      {...svgProps}
    />
  );
}
