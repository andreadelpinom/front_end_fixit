import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";

import Home from "../screens/clients/Home";
import ServicesScreen from "../screens/clients/ServicesScreen";
import ProfileScreen from "../screens/clients/Profile";
import RequestDetailScreen from "../screens/clients/RequestDetail";

import HomeTabIcon from "../components/HomeTabIcon";
import ServicesTabIcon from "../components/ServicesTabIcon";
import ProfileTabIcon from "../components/ProfileTabIcon";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#EA8B49",
        tabBarInactiveTintColor: "#999999",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
          borderTopWidth: 1,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          paddingTop: 10
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 5
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, size }) => <HomeTabIcon color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          tabBarLabel: "Servicios",
          tabBarIcon: ({ color, size }) => <ServicesTabIcon color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => <ProfileTabIcon color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * ClientNavigator
 * Stack principal del cliente para poder navegar a detalles de requests
 */
export default function ClientNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClientTabs" component={ClientTabs} />
      <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
    </Stack.Navigator>
  );
}
