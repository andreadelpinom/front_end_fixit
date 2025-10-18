import { View } from "react-native";

interface TabIconProps {
  color: string;
  size: number;
}

export default function HomeTabIcon({ color, size }: TabIconProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <View
        style={{
          width: size * 0.7,
          height: size * 0.7,
          backgroundColor: color,
          borderRadius: 6
        }}
      />
    </View>
  );
}
