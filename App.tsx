import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/state/auth';
import { Text, View } from 'react-native';

// Screens
import Login from '@/screens/Login';
import Register from '@/screens/Register';
import Home from '@/screens/Home';
import Discover from '@/screens/Discover';
import Requests from '@/screens/Requests';
import RequestDetail from '@/screens/RequestDetail';
import Profile from '@/screens/Profile';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function TabsNavigator() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Inicio" component={Home} />
      <Tabs.Screen name="Descubrir" component={Discover} />
      <Tabs.Screen name="Solicitudes" component={Requests} />
      <Tabs.Screen name="Perfil" component={Profile} />
    </Tabs.Navigator>
  );
}

function RootNavigation() {
  const { sessionChecked, user } = useAuth();

  if (!sessionChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando…</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      {user ? (
        <>
          <Stack.Screen name="App" component={TabsNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="DetalleSolicitud" component={RequestDetail} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Registro" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer theme={DefaultTheme}>
        <StatusBar style="dark" />
        <RootNavigation />
      </NavigationContainer>
    </AuthProvider>
  );
}
