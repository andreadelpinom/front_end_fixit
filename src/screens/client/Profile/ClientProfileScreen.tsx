import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { profileStyles } from './ProfileScreen.styles';
import { useClientProfile } from './hooks/useClientProfile';
import { ProfileHeaderCard } from './components/ProfileHeaderCard';
import {
  ProfileQuickActions,
  ProfileQuickAction,
} from './components/ProfileQuickActions';
import { ProfileTechnicianCard } from './components/ProfileTechnicianCard';
import { ProfileDangerZoneCard } from './components/ProfileDangerZoneCard';
import { ProfileInfoList, ProfileInfoItem } from './components/ProfileInfoList';
import { ThemedText } from '../../../ui';
import { theme } from '../../../theme';
import { ErrorUtils } from '../../../utils/error.utils';
import { ClientProfileStackParamList } from '../../../navigation/types';
import { RolUsuario } from '../../../types/auth.types';

export type ClientProfileScreenProps = NativeStackScreenProps<
  ClientProfileStackParamList,
  'Profile'
>;

function formatMemberSince(date: string | null | undefined): string {
  if (!date) {
    return 'Miembro desde este año';
  }

  try {
    const formatted = new Date(date).toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    });
    return `Miembro desde ${formatted}`;
  } catch (error) {
    return 'Miembro desde este año';
  }
}

const FALLBACK_NAME = 'Usuario FixIt';

const ROLE_LABELS: Record<RolUsuario, string> = {
  [RolUsuario.ADMIN]: 'Administrador',
  [RolUsuario.CLIENTE]: 'Cliente',
  [RolUsuario.TECNICO]: 'Técnico',
};

export function ClientProfileScreen({ navigation }: ClientProfileScreenProps) {
  const {
    profile,
    loading,
    error,
    refreshing,
    onRefresh,
    switchToTechnician,
    logout,
  } = useClientProfile();

  const fullName = useMemo(() => {
    if (!profile) {
      return FALLBACK_NAME;
    }
    return `${profile.nombres ?? ''} ${profile.apellidos ?? ''}`.trim() || FALLBACK_NAME;
  }, [profile]);

  const infoItems = useMemo<ProfileInfoItem[]>(() => {
    if (!profile) {
      return [];
    }

    const readableRoles = profile.roles
      .map(role => ROLE_LABELS[role] ?? role)
      .join(', ');

    return [
      {
        id: 'email',
        icon: 'mail-outline',
        label: 'Correo electrónico',
        value: profile.email,
      },
      {
        id: 'cedula',
        icon: 'id-card-outline',
        label: 'Cédula',
        value: profile.cedula,
      },
      {
        id: 'roles',
        icon: 'people-circle-outline',
        label: 'Roles vinculados',
        value: readableRoles,
      },
    ];
  }, [profile]);

  const quickActions = useMemo<ProfileQuickAction[]>(
    () => [
      {
        id: 'edit-profile',
        icon: 'create-outline',
        label: 'Editar perfil',
        onPress: () => navigation.navigate('EditProfile'),
      },
      {
        id: 'requests-history',
        icon: 'time-outline',
        label: 'Historial de solicitudes',
        onPress: () => navigation.navigate('RequestsHistory'),
      },
      {
        id: 'active-services',
        icon: 'construct-outline',
        label: 'Servicios activos',
        onPress: () => navigation.navigate('ActiveServices'),
      },
      {
        id: 'notifications',
        icon: 'notifications-outline',
        label: 'Notificaciones',
        onPress: () => navigation.navigate('Notifications'),
      },
      {
        id: 'support',
        icon: 'help-circle-outline',
        label: 'Soporte y ayuda',
        onPress: () => navigation.navigate('Support'),
      },
    ],
    [navigation],
  );

  const confirmSwitchToTechnician = () => {
    Alert.alert(
      'Cambiar a vista de técnico',
      'Podrás regresar a la vista de cliente desde tu perfil de técnico cuando lo necesites.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cambiar',
          style: 'default',
          onPress: async () => {
            try {
              await switchToTechnician();
            } catch (err) {
              Alert.alert('Error', ErrorUtils.getErrorMessage(err));
            }
          },
        },
      ],
    );
  };

  const confirmLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Deseas cerrar tu sesión en este dispositivo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (err) {
              Alert.alert('Error', ErrorUtils.getErrorMessage(err));
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={profileStyles.safeArea}>
        <View style={profileStyles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <ThemedText variant="caption" color="muted" style={profileStyles.loaderMessage}>
            Cargando tu perfil...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={profileStyles.safeArea}>
        <View style={profileStyles.loaderContainer}>
          <ThemedText variant="subtitle" style={profileStyles.errorText}>
            No pudimos obtener tu información de perfil.
          </ThemedText>
          <ThemedText variant="caption" color="muted" style={profileStyles.loaderMessage}>
            Desliza hacia abajo para volver a intentar.
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={profileStyles.safeArea}>
      <ScrollView
        style={profileStyles.scroll}
        contentContainerStyle={profileStyles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
      >
        <ProfileHeaderCard
          fullName={fullName}
          email={profile.email}
          memberSinceLabel={formatMemberSince(profile.createdAt)}
          onEditPress={() => navigation.navigate('EditProfile')}
        />

        {!!error && (
          <View style={profileStyles.errorBanner}>
            <ThemedText variant="body" style={profileStyles.errorBannerText}>
              {error}
            </ThemedText>
          </View>
        )}

        <ProfileInfoList title="Información de la cuenta" items={infoItems} />

        <ProfileQuickActions title="Accesos rápidos" actions={quickActions} />

        <ProfileTechnicianCard onSwitchPress={confirmSwitchToTechnician} />

        <ProfileDangerZoneCard onLogoutPress={confirmLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default ClientProfileScreen;
