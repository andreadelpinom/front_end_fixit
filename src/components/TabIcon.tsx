import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';
import { IconOnlyProps } from '../interface';

export default function TabIcon({ type, color = '#000', size = 24, filled = false }: Readonly<IconOnlyProps>) {
    switch (type) {
        case 'clipboard':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                    <Path d="M9 4.5c0-1.105.895-2 2-2h2c1.105 0 2 .895 2 2v.5h1.25c.744 0 1.25.506 1.25 1.25V18A3.5 3.5 0 0 1 15 21.5H9A3.5 3.5 0 0 1 5.5 18V6.25C5.5 5.506 6.006 5 6.75 5H8v-.5"
                        stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    <Rect x={7} y={6.5} width={10} height={13} rx={2} ry={2}
                        stroke={color} strokeWidth={2} fill={filled ? color + '22' : 'none'} />
                    <Line x1={9.5} y1={10} x2={14.5} y2={10} stroke={color} strokeWidth={2} strokeLinecap="round" />
                    <Line x1={9.5} y1={13} x2={14.5} y2={13} stroke={color} strokeWidth={2} strokeLinecap="round" />
                    <Line x1={9.5} y1={16} x2={13} y2={16} stroke={color} strokeWidth={2} strokeLinecap="round" />
                </Svg>
            );

        case 'home':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                    <Path d="M3 11.5L12 4l9 7.5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M5.5 10.5V19a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-8.5"
                        stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill={filled ? color + '22' : 'none'} />
                </Svg>
            );

        case 'createService':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                    <Rect x={3} y={4} width={18} height={16} rx={3} stroke={color} strokeWidth={1.8} />
                    <Path d="M12 8v8M8 12h8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
                </Svg>
            );

        case 'profile':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                    <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
            );

        case 'services':
            return (
                <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                    <Path d="M14.5 13.5L6 22" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M21 7a4 4 0 0 1-5.657 3.657L12 14l-2-2 3.343-3.343A4 4 0 1 1 21 7Z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M5 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill={color} />
                </Svg>
            );

        default:
            return null;
    }
}
