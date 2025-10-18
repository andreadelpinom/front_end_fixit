import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/common/Login";
import RegisterScreen from "../screens/common/Register";

/**
 * Authentication Stack Navigator
 * Handles login and registration flow before user is authenticated
 * 
 * Routes:
 * - Login: Main login screen
 * - Register: User registration screen
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" },
        animation: "default"
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          animation: "slide_from_right"
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          animation: "slide_from_right"
        }}
      />
    </Stack.Navigator>
  );
}
