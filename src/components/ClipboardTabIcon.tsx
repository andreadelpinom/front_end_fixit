import Svg, { Path, Rect, Line, SvgProps } from 'react-native-svg';

type Props = SvgProps & { color?: string; size?: number; filled?: boolean };

export default function ClipboardTabIcon({ color = '#D97706', size = 24, filled = false, ...rest }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path d="M9 4.5c0-1.105.895-2 2-2h2c1.105 0 2 .895 2 2v.5h1.25c.744 0 1.25.506 1.25 1.25V18A3.5 3.5 0 0 1 15 21.5H9A3.5 3.5 0 0 1 5.5 18V6.25C5.5 5.506 6.006 5 6.75 5H8v-.5"
        stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Rect x={7} y={6.5} width={10} height={13} rx={2} ry={2}
        stroke={color} strokeWidth={2} fill={filled ? color + '22' : 'none'} />
      <Line x1={9.5} y1={10} x2={14.5} y2={10} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1={9.5} y1={13} x2={14.5} y2={13} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1={9.5} y1={16} x2={13}   y2={16} stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}