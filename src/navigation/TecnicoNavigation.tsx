import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TechnicianProfileScreen from "../screens/tecnicos/TechnicianProfileScreen";
import MyServicesScreen from "../screens/tecnicos/MyServicesScreen";
import RequestsScreen from "../screens/tecnicos/Requests";
import TechnicianPerformanceScreen from "../screens/tecnicos/TechnicianPerformanceScreen";
import TechnicianRequestsScreen from "../screens/tecnicos/TechnicianRequestsScreen";
import CertificationsScreen from "../screens/tecnicos/CertificationsScreens";

const Stack = createNativeStackNavigator();

/**
 * TecnicoNavigator
 * Stack principal para el rol técnico
 */
export default function TecnicoNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TechnicianProfile" component={TechnicianProfileScreen} />
      <Stack.Screen name="MyServices" component={MyServicesScreen} />
      <Stack.Screen name="Requests" component={RequestsScreen} />
      <Stack.Screen name="TechnicianPerformance" component={TechnicianPerformanceScreen} />
      <Stack.Screen name="TechnicianRequests" component={TechnicianRequestsScreen} />
      <Stack.Screen name="Certifications" component={CertificationsScreen} />
    </Stack.Navigator>
  );
}
