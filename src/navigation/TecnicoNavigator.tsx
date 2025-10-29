import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TechnicianProfileScreen from "../screens/tecnicos/TechnicianProfileScreen";
import TechnicianPerformanceScreen from "../screens/tecnicos/TechnicianPerformanceScreen";
import TechnicianRequestsScreen from "../screens/tecnicos/TechnicianRequestsScreen";
import TechnicianRequestDetail from "../screens/tecnicos/TechnicianRequestDetail";
import CertificationsScreen from "../screens/tecnicos/CertificationsScreens";
import { TechnicianHomeScreen } from "../screens/tecnicos/TechnicianHomeScreen";
import { TabIcons } from "./tabIcons";
import { defaultTabOptions } from "./tabOptions";
import { technician } from "../theme/colors";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TecnicoTabs() {
  return (
    <Tab.Navigator screenOptions={defaultTabOptions(technician.primary, "#999999")}>
      <Tab.Screen name="Home" component={TechnicianHomeScreen} options={{ tabBarLabel: "Inicio", tabBarIcon: TabIcons.Home }} />
      <Tab.Screen name="Performance" component={TechnicianPerformanceScreen} options={{ tabBarLabel: "Desempeño", tabBarIcon: TabIcons.Services }} />
      <Tab.Screen name="Solicitudes" component={TechnicianRequestsScreen} options={{ tabBarLabel: "Solicitudes", tabBarIcon: TabIcons.Clipboard }} />
      <Tab.Screen name="Profile" component={TechnicianProfileScreen} options={{ tabBarLabel: "Perfil", tabBarIcon: TabIcons.Profile }} />
    </Tab.Navigator>
  );
}

export default function TecnicoNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TecnicoTabs" component={TecnicoTabs} />
      <Stack.Screen name="TechnicianRequestDetail" component={TechnicianRequestDetail} />
      <Stack.Screen name="Certifications" component={CertificationsScreen} />
    </Stack.Navigator>
  );
}
