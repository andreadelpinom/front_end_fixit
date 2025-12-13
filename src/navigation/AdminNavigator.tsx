// src/navigation/AdminNavigator.tsx
import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import UsersManagementScreen from '../screens/admin/UsersManagementScreen';
import TechniciansManagementScreen from '../screens/admin/TechniciansManagementScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2C3E50',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: () => <TabIcon name="📊" />,
        }}
      />
      <Tab.Screen
        name="Users"
        component={UsersManagementScreen}
        options={{
          tabBarLabel: 'Usuarios',
          tabBarIcon: () => <TabIcon name="👥" />,
        }}
      />
      <Tab.Screen
        name="Technicians"
        component={TechniciansManagementScreen}
        options={{
          tabBarLabel: 'Verificación',
          tabBarIcon: () => <TabIcon name="🔧" />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={AdminProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: () => <TabIcon name="👤" />,
        }}
      />
    </Tab.Navigator>
  );
}

function TabIcon({ name }: { name: string }) {
  return (
    <Text style={{ fontSize: 24 }}>
      {name}
    </Text>
  );
}

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#2C3E50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="AdminTabs"
        component={AdminTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
