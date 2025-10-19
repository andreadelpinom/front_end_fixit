//import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";


import TechnicianProfileScreen from "../screens/tecnicos/TechnicianProfileScreen";
import TechnicianPerformanceScreen from "../screens/tecnicos/TechnicianPerformanceScreen";
import TechnicianRequestsScreen from "../screens/tecnicos/TechnicianRequestsScreen";
import TechnicianRequestDetail from "../screens/tecnicos/TechnicianRequestDetail";
import CertificationsScreen from "../screens/tecnicos/CertificationsScreens";

import HomeTabIcon from "../components/HomeTabIcon";
import ServicesTabIcon from "../components/ServicesTabIcon";
import ClipboardTabIcon from "../components/ClipboardTabIcon";
import ProfileTabIcon from "../components/ProfileTabIcon";
import { technician } from "../theme/colors";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/**
 * TecnicoTabs
 * Bottom Tab Navigator para técnicos con 3 pestañas principales
 */

function TecnicoTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: technician.primary,
        tabBarInactiveTintColor: technician.dark,
        tabBarStyle: {
          backgroundColor: technician.light,
          borderTopColor: technician.primary,
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
        component={TechnicianRequestsScreen}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, size }) => <HomeTabIcon color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Performance"
        component={TechnicianPerformanceScreen}
        options={{
          tabBarLabel: "Desempeño",
          tabBarIcon: ({ color, size }) => <ServicesTabIcon color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Solicitudes"
        component={TechnicianRequestsScreen}
        options={{
          tabBarLabel: "Solicitudes",
          tabBarIcon: ({ color, size }) => <ClipboardTabIcon color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={TechnicianProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => <ProfileTabIcon color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * TecnicoNavigator
 * Stack principal para el rol técnico con navegación por pestañas
 */

export default function TecnicoNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TecnicoTabs" component={TecnicoTabs} />
      <Stack.Screen name="TechnicianRequestDetail" component={TechnicianRequestDetail} />
      <Stack.Screen name="Certifications" component={CertificationsScreen} />
    </Stack.Navigator>
  );
}
