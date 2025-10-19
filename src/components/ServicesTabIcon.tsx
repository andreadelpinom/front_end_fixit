import Svg, { Path } from "react-native-svg";

interface TabIconProps {
  color?: string;
  size?: number;
}

// Llave inglesa (wrench) estilo outline
export default function ServicesTabIcon({ color = "#000000", size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Mango */}
      <Path
        d="M14.5 13.5L6 22"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cabeza de la llave */}
      <Path
        d="M21 7a4 4 0 0 1-5.657 3.657L12 14l-2-2 3.343-3.343A4 4 0 1 1 21 7Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Orificio del mango */}
      <Path
        d="M5 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        fill={color}
      />
    </Svg>
  );
}
