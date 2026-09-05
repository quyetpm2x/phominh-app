import { SvgXml } from 'react-native-svg';

import { icons } from '../../constants/icons';
import type { IconProps } from './icon/types';

export type CustomIconProps = IconProps & {
  name: keyof typeof icons;
};

export function CustomIcon({ name, size, color, ...svgProps }: CustomIconProps) {
  const icon = icons[name];
  const resolvedSize = size ?? icon.size;

  return (
    <SvgXml
      xml={icon.xml}
      width={resolvedSize}
      height={resolvedSize * icon.heightRatio}
      color={color ?? icon.color}
      {...svgProps}
    />
  );
}
