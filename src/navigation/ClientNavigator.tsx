import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeClientScreen from '../screens/client/Home/HomeClientScreen';
import ClientServicesScreen from '../screens/client/Services/ClientServicesScreen';
import RequestDetailsScreen from '../screens/client/RequestDetailsScreen';
import ProposalsScreen from '../screens/client/ProposalsScreen';
import ClientProfileScreen from '../screens/client/ClientProfileScreen';
import EditProfileScreen from '../screens/client/EditProfileScreen';
import RequestsHistoryScreen from '../screens/client/RequestsHistoryScreen';
import ActiveServicesScreen from '../screens/client/ActiveServicesScreen';
import { NotificationsScreen } from '../screens/client/Notifications/NotificationsScreen';
import SupportScreen from '../screens/client/SupportScreen';
import BecomeTechnicianScreen from '../screens/BecomeTechnicianScreen';
import RequestStepServiceScreen from '../screens/client/request-wizard/RequestStepServiceScreen';
import RequestStepProblemScreen from '../screens/client/request-wizard/RequestStepProblemScreen';
import RequestStepScheduleScreen from '../screens/client/request-wizard/RequestStepScheduleScreen';
import RequestStepPhotosScreen from '../screens/client/request-wizard/RequestStepPhotosScreen';
import RequestStepAddressScreen from '../screens/client/request-wizard/RequestStepAddressScreen';
import RequestStepReviewScreen from '../screens/client/request-wizard/RequestStepReviewScreen';
import { TabIcon } from '../ui';
import { navigationStyles } from './navigation.styles';
import { theme } from '../theme';

type ClientTabParamList = {
  ClientHome: undefined;
  ClientServices: undefined;
  ClientActivity: undefined;
  ClientProfile: undefined;
};

type TabIconName = Parameters<typeof TabIcon>[0]['name'];

const Tab = createBottomTabNavigator<ClientTabParamList>();
const Stack = createNativeStackNavigator();

const stackScreenOptions = {
  headerStyle: navigationStyles.header,
  headerTintColor: theme.colors.text.inverse,
  headerTitleStyle: navigationStyles.headerTitle,
};

function CreateRequestStack() {
  return (
    <Stack.Navigator initialRouteName="RequestStepService" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RequestStepService" component={RequestStepServiceScreen} />
      <Stack.Screen name="RequestStepProblem" component={RequestStepProblemScreen} />
      <Stack.Screen name="RequestStepSchedule" component={RequestStepScheduleScreen} />
      <Stack.Screen name="RequestStepPhotos" component={RequestStepPhotosScreen} />
      <Stack.Screen name="RequestStepAddress" component={RequestStepAddressScreen} />
      <Stack.Screen name="RequestStepReview" component={RequestStepReviewScreen} />
    </Stack.Navigator>
  );
}

function ServicesStack() {
  return (
    <Stack.Navigator initialRouteName="ClientRequests" screenOptions={stackScreenOptions}>
      <Stack.Screen name="ClientRequests" component={ClientServicesScreen} options={{ title: 'Servicios' }} />
      <Stack.Screen name="RequestDetails" component={RequestDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Proposals" component={ProposalsScreen} options={{ title: 'Propuestas' }} />
      <Stack.Screen name="CreateRequestStack" component={CreateRequestStack as any} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function ActivityStack() {
  return (
    <Stack.Navigator initialRouteName="RequestsHistory" screenOptions={stackScreenOptions}>
      <Stack.Screen name="RequestsHistory" component={RequestsHistoryScreen} options={{ title: 'Actividad' }} />
      <Stack.Screen name="RequestDetails" component={RequestDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Proposals" component={ProposalsScreen} options={{ title: 'Propuestas' }} />
      <Stack.Screen name="ActiveServices" component={ActiveServicesScreen} options={{ title: 'Servicios Activos' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notificaciones' }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator initialRouteName="Profile" screenOptions={stackScreenOptions}>
      <Stack.Screen name="Profile" component={ClientProfileScreen} options={{ title: 'Perfil' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
      <Stack.Screen name="RequestsHistory" component={RequestsHistoryScreen} options={{ title: 'Historial de Solicitudes' }} />
      <Stack.Screen name="ActiveServices" component={ActiveServicesScreen} options={{ title: 'Servicios Activos' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notificaciones' }} />
      <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Soporte Técnico' }} />
      <Stack.Screen name="BecomeTechnician" component={BecomeTechnicianScreen} options={{ title: 'Convertirse en Técnico' }} />
    </Stack.Navigator>
  );
}

const clientTabConfig: Array<{
  name: keyof ClientTabParamList;
  component: React.ComponentType<any>;
  title: string;
  icon: TabIconName;
  options?: Record<string, unknown>;
}> = [
  {
    name: 'ClientHome',
    component: HomeClientScreen,
    title: 'Inicio',
    icon: 'home-outline',
  },
  {
    name: 'ClientServices',
    component: ServicesStack,
    title: 'Servicios',
    icon: 'construct-outline',
    options: { headerShown: false },
  },
  {
    name: 'ClientActivity',
    component: ActivityStack,
    title: 'Actividad',
    icon: 'time-outline',
    options: { headerShown: false },
  },
  {
    name: 'ClientProfile',
    component: ProfileStack,
    title: 'Perfil',
    icon: 'person-circle-outline',
    options: { headerShown: false },
  },
];

const iconMap = clientTabConfig.reduce<Record<string, TabIconName>>(
  (acc, item) => ({ ...acc, [item.name]: item.icon }),
  {},
);

export default function ClientNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: navigationStyles.header,
        headerTintColor: theme.colors.text.inverse,
        headerTitleStyle: navigationStyles.headerTitle,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.muted,
        tabBarStyle: navigationStyles.tabBar,
        tabBarIcon: ({ color, size }) => {
          const fallbackIcon = 'ellipse-outline' as TabIconName;
          const iconName = iconMap[route.name] ?? fallbackIcon;
          return <TabIcon name={iconName} color={color} size={size} />;
        },
      })}
    >
      {clientTabConfig.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ title: tab.title, tabBarLabel: tab.title, ...(tab.options ?? {}) }}
        />
      ))}
    </Tab.Navigator>
  );
}
