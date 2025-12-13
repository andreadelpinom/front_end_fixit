// TechnicianNavigator.tsx - Bottom tabs for technician role
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TechnicianHomeScreen from '../screens/technician/TechnicianHomeScreen';
import AvailableRequestsScreen from '../screens/technician/AvailableRequestsScreen';
import MyJobsScreen from '../screens/technician/MyJobsScreen';
import TechnicianProfileScreen from '../screens/technician/TechnicianProfileScreen';
import { TabIcon } from '../ui';
import { navigationStyles } from './navigation.styles';
import { theme } from '../theme';

type TechnicianTabParamList = {
  TechnicianHome: undefined;
  TechnicianExplore: undefined;
  TechnicianJobs: undefined;
  TechnicianProfile: undefined;
};

type TabIconName = Parameters<typeof TabIcon>[0]['name'];

const Tab = createBottomTabNavigator<TechnicianTabParamList>();

const technicianTabs: Array<{
  name: keyof TechnicianTabParamList;
  component: React.ComponentType<any>;
  title: string;
  icon: TabIconName;
}> = [
  {
    name: 'TechnicianHome',
    component: TechnicianHomeScreen,
    title: 'Inicio',
    icon: 'home-outline',
  },
  {
    name: 'TechnicianExplore',
    component: AvailableRequestsScreen,
    title: 'Explorar',
    icon: 'compass-outline',
  },
  {
    name: 'TechnicianJobs',
    component: MyJobsScreen,
    title: 'Trabajos',
    icon: 'briefcase-outline',
  },
  {
    name: 'TechnicianProfile',
    component: TechnicianProfileScreen,
    title: 'Perfil',
    icon: 'person-circle-outline',
  },
];

const iconMap = technicianTabs.reduce<Record<string, TabIconName>>(
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
      {technicianTabs.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ title: tab.title, tabBarLabel: tab.title }}
        />
      ))}
    </Tab.Navigator>
  );
}
