import Svg, { Path } from "react-native-svg";

interface TabIconProps {
  color?: string;
  size?: number;
}

export default function ServicesTabIcon({ color = "#000000", size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Ícono de gráfica de barras para "Desempeño" */}
      <Path
        d="M3 3v18h18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 16V12M12 16V8M17 16V14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
