import { View } from "react-native";

interface TabIconProps {
  color: string;
  size: number;
}

export default function ProfileTabIcon({ color, size }: TabIconProps) {
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
          width: size * 0.6,
          height: size * 0.6,
          backgroundColor: color,
          borderRadius: size * 0.3
        }}
      />
    </View>
  );
}
