import Svg, { Path } from 'react-native-svg';
import { Props } from '../types';

export default function HomeTabIcon({ color = '#D97706', size = 24, filled = false, ...rest }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      {/* casa simple estilo outline/filled */}
      <Path
        d="M3 11.5L12 4l9 7.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.5 10.5V19a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-8.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color + '22' : 'none'}
      />
    </Svg>
  );
}