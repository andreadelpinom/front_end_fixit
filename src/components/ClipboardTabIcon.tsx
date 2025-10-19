import Svg, { Path, Rect, Line } from "react-native-svg";

interface ClipboardTabIconProps {
  color?: string;
  size?: number;
}

export default function ClipboardTabIcon({ color = "#000000", size = 24 }: ClipboardTabIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* Clip / cabecera */}
      <Path
        d="M9 4.5c0-1.105.895-2 2-2h2c1.105 0 2 .895 2 2v.5h1.25C17.994 5 18.5 5.506 18.5 6.25V18A3.5 3.5 0 0 1 15 21.5H9A3.5 3.5 0 0 1 5.5 18V6.25C5.5 5.506 6.006 5 6.75 5H8v-.5"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tableta (rectángulo principal con esquinas redondeadas) */}
      <Rect
        x={7}
        y={6.5}
        width={10}
        height={13}
        rx={2}
        ry={2}
        stroke={color}
        strokeWidth={2.2}
      />
      {/* Líneas del contenido */}
      <Line x1={9.5} y1={10} x2={14.5} y2={10} stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      <Line x1={9.5} y1={13} x2={14.5} y2={13} stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      <Line x1={9.5} y1={16} x2={13} y2={16} stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}
