import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";

import Home from "../screens/clients/Home";
import ServicesScreen from "../screens/clients/ServicesScreen";
import ProfileScreen from "../screens/clients/Profile";
import TechnicianProfileScreen from "../screens/tecnicos/TechnicianProfileScreen";
import MyServicesScreen from "../screens/tecnicos/MyServicesScreen";
import RequestsScreen from "../screens/tecnicos/Requests";
import TechnicianPerformanceScreen from "../screens/tecnicos/TechnicianPerformanceScreen";
import TechnicianRequestsScreen from "../screens/tecnicos/TechnicianRequestsScreen";
import RequestDetailScreen from "../screens/clients/RequestDetail";
import CertificationsScreen from "../screens/tecnicos/CertificationsScreens";
import LoginScreen from "../screens/common/Login";
import RegisterScreen from "../screens/common/Register";
import HomeTabIcon from "../components/HomeTabIcon";
import ServicesTabIcon from "../components/ServicesTabIcon";
import ProfileTabIcon from "../components/ProfileTabIcon";
import { useAuth } from "../context/AuthContext";



/**
 * Application Stack Parameter List
 * Defines all available routes in the authenticated app flow
 */
export type RootStackParamList = {
  MainTabs: undefined;
  TechnicianProfile: undefined;
  MyServices: undefined;
  Requests: undefined;
  TechnicianPerformance: undefined;
  TechnicianRequests: undefined;
  RequestDetail: { id: string };
  Certifications: undefined;
};

/**
 * Authentication Stack Parameter List
 * Defines routes for unauthenticated users
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator();

/**
 * MainTabs Component
 * Bottom tab navigation for authenticated users
 * Routes: Home (Discover), Services, Profile
 *
 * Architecture: Tab navigator wraps main app screens with quick access
 * Pattern: Observer pattern for notifications, used in HeaderNav component
 */
function MainTabs() {
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
          tabBarIcon: ({ color, size }) => (
            <HomeTabIcon color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          tabBarLabel: "Servicios",
          tabBarIcon: ({ color, size }) => (
            <ServicesTabIcon color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <ProfileTabIcon color={color} size={size} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * AuthStack Component
 * Navigation for unauthenticated users (Login & Register)
 */
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" }
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          animationTypeForReplace: "pop"
        }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          animationTypeForReplace: "pop"
        }}
      />
    </AuthStack.Navigator>
  );
}

/**
 * App Stack Component
 * Navigation for authenticated users (Main app with all screens)
 *
 * Architecture: Stack navigator for modal-style screens on top of bottom tabs
 * Screens:
 * - MainTabs: Bottom tab navigation (Home, Services, Profile)
 * - TechnicianProfile: View technician profile
 * - MyServices: Technician manages their services
 * - Requests: User views their requests
 * - TechnicianPerformance: Technician dashboard
 * - TechnicianRequests: Technician views available requests
 * - RequestDetail: View single request details
 * - Certifications: Manage certifications
 */
function AppStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" }
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="TechnicianProfile" component={TechnicianProfileScreen} />
      <Stack.Screen name="MyServices" component={MyServicesScreen} />
      <Stack.Screen name="Requests" component={RequestsScreen} />
      <Stack.Screen name="TechnicianPerformance" component={TechnicianPerformanceScreen} />
      <Stack.Screen name="TechnicianRequests" component={TechnicianRequestsScreen} />
      <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
      <Stack.Screen name="Certifications" component={CertificationsScreen} />
    </Stack.Navigator>
  );
}

/**
 * Root Navigator Component
 * Conditional routing: Shows auth flow or app based on login state
 *
 * Flow:
 * 1. AuthStackNavigator (Login/Register) - User not authenticated
 * 2. AppStackNavigator (MainTabs + detailed screens) - User authenticated
 */
export function RootNavigator() {
  const { isSignedIn } = useAuth();

  return (
    <NavigationContainer>
      {isSignedIn ? <AppStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}
