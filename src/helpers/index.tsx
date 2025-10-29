import { View, ViewStyle } from 'react-native';
import { colors } from "../theme/colors";
import { Status } from "../types";

interface SeparatorProps {
  /** Height of the space between items */
  height?: number;
  /** Optionally customize style (e.g., add backgroundColor, width, etc.) */
  style?: ViewStyle;
}

export default function Separator({ height = 12, style }: Readonly<SeparatorProps>) {
  return <View style={[{ height }, style]} />;
}

export const DefaultSeparator = () => <Separator />;
export const LargeSeparator = () => <Separator height={12} />;
export const renderSeparator = () => <View style={{ height: 12 }} />;

export const renderSettingSeparator = () => (
  <View style={{ height: 1, backgroundColor: colors.border }} />
);

export function statusStyle(status: Status) {
  switch (status) {
    case "Finalizado":
      return { backgroundColor: "#ECFDF5", borderColor: "#10B981" };
    case "Cancelado":
      return { backgroundColor: "#FEF2F2", borderColor: "#EF4444" };
    default:
      return { backgroundColor: colors.surface, borderColor: colors.border };
  }
}

export function statusTextStyle(status: Status) {
  switch (status) {
    case "Finalizado":
      return { color: "#065F46" };
    case "Cancelado":
      return { color: "#991B1B" };
    default:
      return { color: colors.text.secondary };
  }
}