import Svg, { Path, Circle } from "react-native-svg";
import { TabIconProps } from "../interface";

export default function ProfileTabIcon({ color = "#000000", size = 24 }: Readonly<TabIconProps>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Ícono de persona para "Perfil" */}
      <Circle
        cx={12}
        cy={8}
        r={4}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
