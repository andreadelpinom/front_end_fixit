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
import { TechnicianHomeScreen } from "../screens/tecnicos/TechnicianHomeScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Definir los componentes de iconos fuera del componente principal
const renderHomeIcon = (props: { color: string; size: number }) => (
  <HomeTabIcon color={props.color} size={props.size} />
);

const renderServicesIcon = (props: { color: string; size: number }) => (
  <ServicesTabIcon color={props.color} size={props.size} />
);

const renderClipboardIcon = (props: { color: string; size: number }) => (
  <ClipboardTabIcon color={props.color} size={props.size} />
);

const renderProfileIcon = (props: { color: string; size: number }) => (
  <ProfileTabIcon color={props.color} size={props.size} />
);

/**
 * TecnicoTabs
 * Bottom Tab Navigator para técnicos con 4 pestañas principales
 */
function TecnicoTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: technician.primary, // Naranja cuando está activo
        tabBarInactiveTintColor: "#999999", // Gris cuando está inactivo
        tabBarStyle: {
          backgroundColor: "#FFFFFF", // Fondo blanco
          borderTopColor: "#E5E7EB", // Borde gris claro
          borderTopWidth: 1,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          paddingTop: 10,
          height: Platform.OS === "ios" ? 85 : 65
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
        component={TechnicianHomeScreen}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: renderHomeIcon
        }}
      />
      <Tab.Screen
        name="Performance"
        component={TechnicianPerformanceScreen}
        options={{
          tabBarLabel: "Desempeño",
          tabBarIcon: renderServicesIcon
        }}
      />
      <Tab.Screen
        name="Solicitudes"
        component={TechnicianRequestsScreen}
        options={{
          tabBarLabel: "Solicitudes",
          tabBarIcon: renderClipboardIcon
        }}
      />
      <Tab.Screen
        name="Profile"
        component={TechnicianProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: renderProfileIcon
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
