import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeClientScreen from '../screens/client/Home/HomeClientScreen';
import ClientServicesScreen from '../screens/client/Services/ClientServicesScreen';
import DetalleSolicitudScreen from '../screens/client/Services/DetalleSolicitudScreen';
import ProposalsListScreen from '../screens/client/Proposals/ProposalsListScreen';
import ProposalDetailScreen from '../screens/client/Proposals/ProposalDetailScreen';
import ClientProfileScreen from '../screens/client/Profile/ClientProfileScreen';
import EditClientProfileScreen from '../screens/client/Profile/EditClientProfileScreen';
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
import {
  ClientProfileStackParamList,
  ClientServicesStackParamList,
  ClientTabParamList,
  RequestWizardStackParamList,
} from './types';

type TabIconName = Parameters<typeof TabIcon>[0]['name'];

const Tab = createBottomTabNavigator<ClientTabParamList>();
const ServicesStackNavigator = createNativeStackNavigator<ClientServicesStackParamList>();
const RequestWizardStackNavigator = createNativeStackNavigator<RequestWizardStackParamList>();
const ActivityStackNavigator = createNativeStackNavigator();
const ProfileStackNavigator =
  createNativeStackNavigator<ClientProfileStackParamList>();

const stackScreenOptions = {
  headerStyle: navigationStyles.header,
  headerTintColor: theme.colors.text.inverse,
  headerTitleStyle: navigationStyles.headerTitle,
  headerBackTitleVisible: false,
};

function CreateRequestStack() {
  return (
    <RequestWizardStackNavigator.Navigator initialRouteName="RequestStepService" screenOptions={{ headerShown: false }}>
      <RequestWizardStackNavigator.Screen name="RequestStepService" component={RequestStepServiceScreen} />
      <RequestWizardStackNavigator.Screen name="RequestStepProblem" component={RequestStepProblemScreen} />
      <RequestWizardStackNavigator.Screen name="RequestStepSchedule" component={RequestStepScheduleScreen} />
      <RequestWizardStackNavigator.Screen name="RequestStepPhotos" component={RequestStepPhotosScreen} />
      <RequestWizardStackNavigator.Screen name="RequestStepAddress" component={RequestStepAddressScreen} />
      <RequestWizardStackNavigator.Screen name="RequestStepReview" component={RequestStepReviewScreen} />
    </RequestWizardStackNavigator.Navigator>
  );
}

function ServicesStack() {
  return (
    <ServicesStackNavigator.Navigator
      initialRouteName="ClientServicesScreen"
      screenOptions={{
        ...stackScreenOptions,
        headerLargeTitle: false,
        headerShadowVisible: false,
      }}
    >
      <ServicesStackNavigator.Screen
        name="ClientServicesScreen"
        component={ClientServicesScreen}
        options={{ title: 'Servicios' }}
      />
      <ServicesStackNavigator.Screen
        name="ClientRequests"
        component={ClientServicesScreen}
        options={{ title: 'Servicios' }}
      />
      <ServicesStackNavigator.Screen
        name="RequestDetails"
        component={DetalleSolicitudScreen}
        options={{ title: 'Detalle de solicitud' }}
      />
      <ServicesStackNavigator.Screen
        name="ProposalsList"
        component={ProposalsListScreen}
        options={{ title: 'Propuestas' }}
      />
      <ServicesStackNavigator.Screen
        name="ProposalDetail"
        component={ProposalDetailScreen}
        options={{ title: 'Detalle de propuesta' }}
      />
      <ServicesStackNavigator.Screen
        name="CreateRequestStack"
        component={CreateRequestStack as any}
        options={{ headerShown: false }}
      />
    </ServicesStackNavigator.Navigator>
  );
}

function ActivityStack() {
  return (
    <ActivityStackNavigator.Navigator initialRouteName="RequestsHistory" screenOptions={stackScreenOptions}>
      <ActivityStackNavigator.Screen name="RequestsHistory" component={RequestsHistoryScreen} options={{ title: 'Actividad' }} />
      <ActivityStackNavigator.Screen
        name="RequestDetails"
        component={DetalleSolicitudScreen}
        options={{ title: 'Detalle de solicitud' }}
      />
      <ActivityStackNavigator.Screen name="ProposalsList" component={ProposalsListScreen} options={{ title: 'Propuestas' }} />
      <ActivityStackNavigator.Screen name="ProposalDetail" component={ProposalDetailScreen} options={{ title: 'Detalle de propuesta' }} />
      <ActivityStackNavigator.Screen name="ActiveServices" component={ActiveServicesScreen} options={{ title: 'Servicios Activos' }} />
      <ActivityStackNavigator.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notificaciones' }} />
    </ActivityStackNavigator.Navigator>
  );
}

function ProfileStack() {
  return (
    <ProfileStackNavigator.Navigator initialRouteName="Profile" screenOptions={stackScreenOptions}>
      <ProfileStackNavigator.Screen name="Profile" component={ClientProfileScreen} options={{ title: 'Perfil' }} />
      <ProfileStackNavigator.Screen name="EditProfile" component={EditClientProfileScreen} options={{ title: 'Editar Perfil' }} />
      <ProfileStackNavigator.Screen name="RequestsHistory" component={RequestsHistoryScreen} options={{ title: 'Historial de Solicitudes' }} />
      <ProfileStackNavigator.Screen name="ActiveServices" component={ActiveServicesScreen} options={{ title: 'Servicios Activos' }} />
      <ProfileStackNavigator.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notificaciones' }} />
      <ProfileStackNavigator.Screen name="Support" component={SupportScreen} options={{ title: 'Soporte Técnico' }} />
      <ProfileStackNavigator.Screen name="BecomeTechnician" component={BecomeTechnicianScreen} options={{ title: 'Convertirse en Técnico' }} />
    </ProfileStackNavigator.Navigator>
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
