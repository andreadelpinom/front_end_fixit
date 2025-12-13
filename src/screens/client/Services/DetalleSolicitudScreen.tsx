import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { detalleSolicitudStyles as styles } from './DetalleSolicitudScreen.styles';
import { useDetalleSolicitud, DetalleSolicitudStatusTone } from './useDetalleSolicitud';
import { theme } from '../../../theme';
import { ClientServicesStackParamList } from '../../../navigation/types';

const STATUS_TONE_STYLES: Record<DetalleSolicitudStatusTone, { badge: number; text: number }> = {
  waiting: {
    badge: styles.statusBadgeWaiting,
    text: styles.statusTextWaiting,
  },
  proposals: {
    badge: styles.statusBadgeProposals,
    text: styles.statusTextProposals,
  },
  assigned: {
    badge: styles.statusBadgeAssigned,
    text: styles.statusTextAssigned,
  },
  completed: {
    badge: styles.statusBadgeCompleted,
    text: styles.statusTextCompleted,
  },
  cancelled: {
    badge: styles.statusBadgeCancelled,
    text: styles.statusTextCancelled,
  },
  default: {
    badge: styles.statusBadgeDefault,
    text: styles.statusTextDefault,
  },
};

type Props = NativeStackScreenProps<ClientServicesStackParamList, 'RequestDetails'>;

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ActionButtonProps = {
  label: string;
  variant: ButtonVariant;
  onPress: () => void;
  disabled?: boolean;
};

const BUTTON_STYLE_MAP: Record<ButtonVariant, { container: number; text: number }> = {
  primary: {
    container: styles.primaryButton,
    text: styles.primaryButtonText,
  },
  secondary: {
    container: styles.secondaryButton,
    text: styles.secondaryButtonText,
  },
  ghost: {
    container: styles.ghostButton,
    text: styles.ghostButtonText,
  },
};

const renderActionButton = ({ label, variant, onPress, disabled }: ActionButtonProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => [
      styles.buttonBase,
      BUTTON_STYLE_MAP[variant].container,
      disabled && styles.buttonDisabled,
      pressed && !disabled && styles.buttonPressed,
    ]}
  >
    <Text style={BUTTON_STYLE_MAP[variant].text}>
      {label}
    </Text>
  </Pressable>
);

export default function DetalleSolicitudScreen({ navigation, route }: Props): React.ReactElement {
  const { idSolicitud } = route.params as { idSolicitud: number };
  const {
    details,
    loading,
    refreshing,
    canceling,
    error,
    statusInfo,
    proposalsCount,
    locationLabel,
    publishedAtLabel,
    budgetLabel,
    isWaiting,
    refresh,
    cancelRequest,
  } = useDetalleSolicitud(idSolicitud);

  const statusClasses = STATUS_TONE_STYLES[statusInfo.tone] ?? STATUS_TONE_STYLES.default;
  const title = details?.tituloProblema?.trim() || 'Solicitud sin título';
  const description = details?.descripcionProblema?.trim() || 'No disponible';
  const hasProposals = proposalsCount > 0;
  const proposalsButtonLabel = 'Ver propuestas';
  const editButtonVariant: ButtonVariant = hasProposals ? 'ghost' : 'primary';

  const handleRetry = () => {
    refresh();
  };

  const handleEdit = () => {
    if (!details) {
      return;
    }

    navigation.navigate('CreateRequestStack', {
      screen: 'RequestStepService',
      params: {
        editingDraft: {
          idSolicitud: details.idSolicitud,
          idTipoServicio: details.idTipoServicio,
          codigoParroquia: details.codigoParroquia,
          tituloProblema: details.tituloProblema,
          descripcionProblema: details.descripcionProblema,
          fechaProgramada: details.fechaProgramada,
        },
      },
    });
  };

  const handleViewProposals = () => {
    navigation.navigate('ProposalsList', { idSolicitud });
  };

  const handleCancel = () => {
    if (!details) {
      return;
    }

    Alert.alert(
      'Cancelar solicitud',
      '¿Quieres cancelar esta solicitud? Esta acción no se puede deshacer.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            const success = await cancelRequest();
            if (success) {
              Alert.alert('Solicitud cancelada', 'Tu solicitud fue cancelada correctamente.', [
                {
                  text: 'Aceptar',
                  onPress: () => navigation.goBack(),
                },
              ]);
            }

          },
        },
      ],
    );
  };

  if (loading && !details) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loaderText}>Cargando solicitud...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!loading && error && !details) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          <Text style={styles.errorText}>{error}</Text>
          {renderActionButton({ label: 'Reintentar', variant: 'primary', onPress: handleRetry })}
          {renderActionButton({ label: 'Volver', variant: 'secondary', onPress: () => navigation.goBack() })}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.colors.primary} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <View style={[styles.statusBadge, statusClasses.badge]}>
            <Text style={[styles.statusText, statusClasses.text]}>{statusInfo.label}</Text>
          </View>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={[styles.sectionContent, description === 'No disponible' && styles.emptyValue]}>
            {description}
          </Text>
        </View>

        <View style={styles.infoGrid}>
          {locationLabel ? (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Ubicación</Text>
              <Text style={styles.infoValue}>{locationLabel}</Text>
            </View>
          ) : null}

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Presupuesto</Text>
            <Text style={[styles.infoValue, !budgetLabel && styles.emptyValue]}>
              {budgetLabel ?? 'No disponible'}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Publicado</Text>
            <Text style={[styles.infoValue, !publishedAtLabel && styles.emptyValue]}>
              {publishedAtLabel ?? 'No disponible'}
            </Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          {hasProposals
            ? renderActionButton({
              label: proposalsButtonLabel,
              variant: 'primary',
              onPress: handleViewProposals,
              disabled: canceling,
            })
            : null}

          {renderActionButton({
            label: canceling ? 'Cancelando...' : 'Cancelar solicitud',
            variant: 'secondary',
            onPress: handleCancel,
            disabled: canceling || !isWaiting,
          })}

          {renderActionButton({
            label: 'Editar solicitud',
            variant: editButtonVariant,
            onPress: handleEdit,
            disabled: canceling || !isWaiting,
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
