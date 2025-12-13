import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { clientServicesStyles as styles } from './ClientServicesScreen.styles';
import { ServicesTabsSection } from './sections/ServicesTabsSection';
import { ServicesListSection } from './sections/ServicesListSection';
import { EmptyServicesSection } from './sections/EmptyServicesSection';
import { useClientServices, ClientServicesTab } from './useClientServices';
import { RequestPreview } from '../../../services/home.service';
import { theme } from '../../../theme';
import { ClientServicesStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<ClientServicesStackParamList, 'ClientServicesScreen'>;

type EmptyStateConfig = Record<
  ClientServicesTab,
  {
    iconName: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
  }
>;

const EMPTY_STATE_COPY: EmptyStateConfig = {
  ACTIVE: {
    iconName: 'briefcase-outline',
    title: 'Sin servicios activos',
    description: 'Cuando tengas técnicos trabajando en tus servicios, los verás aquí.',
  },
  PUBLISHED: {
    iconName: 'clipboard-outline',
    title: 'Sin solicitudes publicadas',
    description: 'Crea una nueva solicitud para recibir propuestas de técnicos certificados.',
  },
  COMPLETED: {
    iconName: 'checkmark-done-outline',
    title: 'Sin servicios completados',
    description: 'Tus servicios completados aparecerán en esta sección.',
  },
};

const TAB_ITEMS: Array<{ key: ClientServicesTab; label: string }> = [
  { key: 'ACTIVE', label: 'Activos' },
  { key: 'PUBLISHED', label: 'Publicados' },
  { key: 'COMPLETED', label: 'Completados' },
];

export default function ClientServicesScreen({ navigation }: Props): React.ReactElement {
  const {
    activeTab,
    onSelectTab,
    currentRequests,
    counts,
    loading,
    refreshing,
    error,
    onRetry,
    onRefresh,
  } = useClientServices();

  const tabsWithCounts = useMemo(
    () => TAB_ITEMS.map(item => ({ ...item, count: counts[item.key] })),
    [counts],
  );

  const handleOpenDetails = (request: RequestPreview) => {
    navigation.navigate('RequestDetails', { idSolicitud: request.idSolicitud });
  };

  const handleCreateRequest = () => {
    navigation.navigate('CreateRequestStack');
  };

  const handleOpenMaestritoChat = () => {
    navigation.navigate('MaestritoChat');
  };

  const emptyState = EMPTY_STATE_COPY[activeTab];

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.loaderContainer]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loaderText}>Cargando tus solicitudes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Servicios</Text>
          </View>
          <Text style={styles.subtitle}>Gestiona tus solicitudes en un mismo lugar</Text>
          <View style={styles.actionsRow}>
            <Pressable
              onPress={handleCreateRequest}
              style={({ pressed }) => [
                styles.createButton,
                pressed && styles.createButtonPressed,
              ]}
            >
              <Text style={styles.createButtonText}>Crear nueva solicitud</Text>
            </Pressable>
            <Pressable
              onPress={handleOpenMaestritoChat}
              style={({ pressed }) => [
                styles.maestritoButton,
                pressed && styles.maestritoButtonPressed,
              ]}
            >
              <Text style={styles.maestritoButtonText}>Hablar con Maestrito</Text>
            </Pressable>
          </View>
        </View>

        <ServicesTabsSection
          tabs={tabsWithCounts}
          activeTab={activeTab}
          onTabPress={onSelectTab}
        />

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              onPress={onRetry}
              style={({ pressed }) => [
                styles.retryButton,
                pressed && styles.retryButtonPressed,
              ]}
            >
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </Pressable>
          </View>
        ) : currentRequests.length === 0 ? (
          <EmptyServicesSection
            iconName={emptyState.iconName}
            title={emptyState.title}
            description={emptyState.description}
            actionLabel={activeTab === 'PUBLISHED' ? 'Crear nueva solicitud' : undefined}
            onActionPress={activeTab === 'PUBLISHED' ? handleCreateRequest : undefined}
          />
        ) : (
          <View style={styles.content}>
            <ServicesListSection
              requests={currentRequests}
              refreshing={refreshing}
              onRefresh={onRefresh}
              onRequestPress={handleOpenDetails}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
