import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/clients/Home";
import ServicesScreen from "../screens/clients/ServicesScreen";
import ProfileScreen from "../screens/clients/Profile";
import RequestDetailScreen from "../screens/clients/RequestDetail";
import CreateService from "../screens/clients/CreateService";
import { TabIcons } from "./tabIcons";
import { defaultTabOptions } from "./tabOptions";
import { client } from "../theme/colors";
import { ClientStackParamList, ClientTabParamList } from "../types";

const Stack = createNativeStackNavigator<ClientStackParamList>();
const Tab = createBottomTabNavigator<ClientTabParamList>();

function ClientTabs() {
  return (
    <Tab.Navigator screenOptions={defaultTabOptions(client.primary, client.dark)}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ tabBarLabel: "Inicio", tabBarIcon: TabIcons.Home }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{ tabBarLabel: "Servicios", tabBarIcon: TabIcons.Services }}
      />
      <Tab.Screen
        name="CreateService"
        component={CreateService}
        options={{ tabBarLabel: "Crear Servicio", tabBarIcon: TabIcons.CreateService }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Perfil", tabBarIcon: TabIcons.Profile }}
      />
    </Tab.Navigator>
  );
}

// Type props for RequestDetailScreen
export type RequestDetailProps = NativeStackScreenProps<ClientStackParamList, "RequestDetail">;

// Type props for CreateServiceScreen
export type CreateServiceProps = NativeStackScreenProps<ClientStackParamList, "CreateService">;

export default function ClientNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClientTabs" component={ClientTabs} />
      <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
      <Stack.Screen name="CreateService" component={CreateService} />
    </Stack.Navigator>
  );
}
