import Svg, { Path, Rect } from "react-native-svg";
import { TabIconProps } from "../interface";

// Ícono "crear servicio": caja con símbolo "+" interior
export default function CreateServiceTabIcon({ color = "#000000", size = 24 }: Readonly<TabIconProps>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={4} width={18} height={16} rx={3} stroke={color} strokeWidth={1.8} />
      <Path d="M12 8v8M8 12h8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
