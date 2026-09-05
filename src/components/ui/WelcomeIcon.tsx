import { SvgXml } from 'react-native-svg';

import { welcomeIcons } from '../../constants/welcome-icons';
import type { IconProps } from './icon/types';

export type WelcomeIconProps = IconProps & {
  name: keyof typeof welcomeIcons;
};

export function WelcomeIcon({ name, size, color, ...svgProps }: WelcomeIconProps) {
  const icon = welcomeIcons[name];
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
