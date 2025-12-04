import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TechnicianHomeScreen from '../screens/technician/TechnicianHomeScreen';

const Stack = createNativeStackNavigator();

export default function TechnicianNavigator(){
  return (
    <Stack.Navigator initialRouteName="TechnicianHome">
      <Stack.Screen name="TechnicianHome" component={TechnicianHomeScreen} options={{ title: 'Technician' }} />
    </Stack.Navigator>
  );
}
