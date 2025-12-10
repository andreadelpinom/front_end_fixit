import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/client/HomeScreen';
import ClientRequestsScreen from '../screens/client/ClientRequestsScreen';
import RequestDetailsScreen from '../screens/client/RequestDetailsScreen';
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

function ProfileStack() {
  return (
    <Stack.Navigator initialRouteName="Profile">
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

export default function ClientNavigator(){
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="RequestsTab" component={RequestsStack} options={{ title: 'Solicitudes' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ headerShown: false, title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
