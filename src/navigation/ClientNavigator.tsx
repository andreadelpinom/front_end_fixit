import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/client/HomeScreen';
import BecomeTechnicianScreen from '../screens/BecomeTechnicianScreen';

const Stack = createNativeStackNavigator();

export default function ClientNavigator(){
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="BecomeTechnician" component={BecomeTechnicianScreen} options={{ title: 'Convertirse en Técnico' }} />
    </Stack.Navigator>
  );
}
