import { Platform, TextStyle } from "react-native";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

const labelStyle: TextStyle = {
    fontSize: 12,
    fontWeight: "600" as TextStyle["fontWeight"],
    marginTop: 5,
};

export const defaultTabOptions = (
    activeColor: string,
    inactiveColor: string
): BottomTabNavigationOptions => ({
    headerShown: false,
    tabBarActiveTintColor: activeColor,
    tabBarInactiveTintColor: inactiveColor,
    tabBarStyle: {
        backgroundColor: "#FFFFFF",
        borderTopColor: "#E5E7EB",
        borderTopWidth: 1,
        paddingBottom: Platform.OS === "ios" ? 20 : 10,
        paddingTop: 10,
        height: Platform.OS === "ios" ? 85 : 65,
    },
    tabBarLabelStyle: labelStyle,
});

