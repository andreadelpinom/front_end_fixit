// TechnicianNavigator.tsx - Bottom tabs for technician role
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TechnicianHomeScreen from '../screens/technician/Home/TechnicianHomeScreen';
import AvailableRequestsScreen from '../screens/technician/AvailableRequestsScreen';
import RequestDetailScreen from '../screens/technician/RequestDetailScreen';
import MyJobsScreen from '../screens/technician/Activity/MyJobsScreen';
import TechnicianProfileScreen from '../screens/technician/Profile/TechnicianProfileScreen';
import TechnicianProposalsScreen from '../screens/technician/Proposals/TechnicianProposalsScreen';
import { NotificationsScreen } from '../screens/client/Notifications/NotificationsScreen';
import SupportScreen from '../screens/client/SupportScreen';
import { TabIcon } from '../ui';
import { navigationStyles } from './navigation.styles';
import { theme } from '../theme';
import {
  TechnicianExploreStackParamList,
  TechnicianJobsStackParamList,
  TechnicianProfileStackParamList,
  TechnicianProposalsStackParamList,
  TechnicianTabParamList,
} from './types';

type TabIconName = Parameters<typeof TabIcon>[0]['name'];

const Tab = createBottomTabNavigator<TechnicianTabParamList>();
const ExploreStackNavigator = createNativeStackNavigator<TechnicianExploreStackParamList>();
const JobsStackNavigator = createNativeStackNavigator<TechnicianJobsStackParamList>();
const ProfileStackNavigator = createNativeStackNavigator<TechnicianProfileStackParamList>();
const ProposalsStackNavigator = createNativeStackNavigator<TechnicianProposalsStackParamList>();

const stackScreenOptions = {
  headerStyle: navigationStyles.header,
  headerTintColor: theme.colors.text.inverse,
  headerTitleStyle: navigationStyles.headerTitle,
  headerBackTitleVisible: false,
};

function TechnicianExploreStack() {
  return (
    <ExploreStackNavigator.Navigator initialRouteName="AvailableRequests" screenOptions={stackScreenOptions}>
      <ExploreStackNavigator.Screen name="AvailableRequests" component={AvailableRequestsScreen} options={{ title: 'Solicitudes Disponibles' }} />
      <ExploreStackNavigator.Screen name="RequestDetail" component={RequestDetailScreen} options={{ title: 'Detalle de Solicitud' }} />
    </ExploreStackNavigator.Navigator>
  );
}

function TechnicianJobsStack() {
  return (
    <JobsStackNavigator.Navigator initialRouteName="MyJobs" screenOptions={stackScreenOptions}>
      <JobsStackNavigator.Screen name="MyJobs" component={MyJobsScreen} options={{ title: 'Mis Trabajos' }} />
      <JobsStackNavigator.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notificaciones' }} />
    </JobsStackNavigator.Navigator>
  );
}

function TechnicianProfileStack() {
  return (
    <ProfileStackNavigator.Navigator initialRouteName="TechnicianProfile" screenOptions={stackScreenOptions}>
      <ProfileStackNavigator.Screen name="TechnicianProfile" component={TechnicianProfileScreen} options={{ title: 'Perfil' }} />
      <ProfileStackNavigator.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notificaciones' }} />
      <ProfileStackNavigator.Screen name="Support" component={SupportScreen} options={{ title: 'Soporte Técnico' }} />
    </ProfileStackNavigator.Navigator>
  );
}

function TechnicianProposalsStack() {
  return (
    <ProposalsStackNavigator.Navigator initialRouteName="TechnicianProposals" screenOptions={stackScreenOptions}>
      <ProposalsStackNavigator.Screen name="TechnicianProposals" component={TechnicianProposalsScreen} options={{ title: 'Mis Propuestas' }} />
    </ProposalsStackNavigator.Navigator>
  );
}

const technicianTabConfig: Array<{
  name: keyof TechnicianTabParamList;
  component: React.ComponentType<any>;
  title: string;
  icon: TabIconName;
  options?: Record<string, unknown>;
}> = [
  {
    name: 'TechnicianHome',
    component: TechnicianHomeScreen,
    title: 'Inicio',
    icon: 'home-outline',
  },
  {
    name: 'TechnicianExplore',
    component: TechnicianExploreStack,
    title: 'Explorar',
    icon: 'compass-outline',
    options: { headerShown: false },
  },
  {
    name: 'TechnicianJobs',
    component: TechnicianJobsStack,
    title: 'Trabajos',
    icon: 'briefcase-outline',
    options: { headerShown: false },
  },
  {
    name: 'TechnicianProfile',
    component: TechnicianProfileStack,
    title: 'Perfil',
    icon: 'person-circle-outline',
    options: { headerShown: false },
  },
  {
    name: 'TechnicianProposals',
    component: TechnicianProposalsStack,
    title: 'Propuestas',
    icon: 'document-text-outline',
    options: { headerShown: false },
  },
];

const iconMap = technicianTabConfig.reduce<Record<string, TabIconName>>(
  (acc, tab) => ({ ...acc, [tab.name]: tab.icon }),
  {},
);

export default function TechnicianNavigator() {
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
      {technicianTabConfig.map(tab => (
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
