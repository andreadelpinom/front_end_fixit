// TechnicianNavigator.tsx - Con Bottom Tabs
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TechnicianHomeScreen from '../screens/technician/TechnicianHomeScreen';
import AvailableRequestsScreen from '../screens/technician/AvailableRequestsScreen';
import MyJobsScreen from '../screens/technician/MyJobsScreen';
import TechnicianProfileScreen from '../screens/technician/TechnicianProfileScreen';

const Tab = createBottomTabNavigator();

export default function TechnicianNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={TechnicianHomeScreen}
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
        }}
      />
      <Tab.Screen 
        name="AvailableRequests" 
        component={AvailableRequestsScreen}
        options={{
          title: 'Solicitudes Disponibles',
          tabBarLabel: 'Disponibles',
        }}
      />
      <Tab.Screen 
        name="MyJobs" 
        component={MyJobsScreen}
        options={{
          title: 'Mis Trabajos',
          tabBarLabel: 'Trabajos',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={TechnicianProfileScreen}
        options={{
          title: 'Mi Perfil',
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
}
