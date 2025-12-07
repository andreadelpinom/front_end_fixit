import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/client/HomeScreen';
import ClientRequestsScreen from '../screens/client/ClientRequestsScreen';
import RequestDetailsScreen from '../screens/client/RequestDetailsScreen';
import ClientProfileScreen from '../screens/client/ClientProfileScreen';
import RequestStepServiceScreen from '../screens/client/request-wizard/RequestStepServiceScreen';
import RequestStepProblemScreen from '../screens/client/request-wizard/RequestStepProblemScreen';
import RequestStepScheduleScreen from '../screens/client/request-wizard/RequestStepScheduleScreen';
import RequestStepPhotosScreen from '../screens/client/request-wizard/RequestStepPhotosScreen';
import RequestStepAddressScreen from '../screens/client/request-wizard/RequestStepAddressScreen';
import RequestStepReviewScreen from '../screens/client/request-wizard/RequestStepReviewScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CreateRequestStack() {
  return (
    <Stack.Navigator initialRouteName="RequestStepService">
      <Stack.Screen name="RequestStepService" component={RequestStepServiceScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RequestStepProblem" component={RequestStepProblemScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RequestStepSchedule" component={RequestStepScheduleScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RequestStepPhotos" component={RequestStepPhotosScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RequestStepAddress" component={RequestStepAddressScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RequestStepReview" component={RequestStepReviewScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function RequestsStack() {
  return (
    <Stack.Navigator initialRouteName="ClientRequests">
      <Stack.Screen name="ClientRequests" component={ClientRequestsScreen} options={{ title: 'Solicitudes' }} />
      <Stack.Screen name="RequestDetails" component={RequestDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreateRequestStack" component={CreateRequestStack as any} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function ClientNavigator(){
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="RequestsTab" component={RequestsStack} options={{ title: 'Solicitudes' }} />
      <Tab.Screen name="ProfileTab" component={ClientProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
