import React from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { WIZARD_COLORS } from './request-wizard/WizardShared';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ClientStackNavigationProp = NativeStackNavigationProp<any>;

interface Props {
  navigation: ClientStackNavigationProp;
}

const ClientProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            // AuthContext + AppNavigator automatically manage navigation
          } catch (error) {
            Alert.alert('Error', 'No se pudo cerrar la sesión');
          }
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleRequestsHistory = () => {
    navigation.navigate('RequestsHistory');
  };

  const handleActiveServices = () => {
    navigation.navigate('ActiveServices');
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  const handleSupport = () => {
    navigation.navigate('Support');
  };

  const handleRegisterAsTechnician = () => {
    navigation.navigate('RegisterTechnician');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={WIZARD_COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Usuario no autenticado</Text>
      </SafeAreaView>
    );
  }

  // Get first letter of name for avatar
  const avatarLetter = user.nombres?.charAt(0).toUpperCase() || 'U';
  
  // Format member since date from backend createdAt
  const memberSinceDate = new Date(user.createdAt);
  const formattedDate = memberSinceDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1️⃣ User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </View>
          </View>

          <Text style={styles.userName}>
            {user.nombres} {user.apellidos}
          </Text>

          <Text style={styles.userEmail}>{user.email}</Text>

          <Text style={styles.memberSince}>
            Miembro desde {formattedDate}
          </Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        {/* 2️⃣ Quick Access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accesos rápidos</Text>

          <QuickAccessItem
            icon="📋"
            label="Historial de solicitudes"
            onPress={handleRequestsHistory}
          />
          <QuickAccessItem
            icon="⚙️"
            label="Servicios activos"
            onPress={handleActiveServices}
          />
          <QuickAccessItem
            icon="🔔"
            label="Notificaciones"
            onPress={handleNotifications}
          />
          <QuickAccessItem
            icon="💬"
            label="Soporte técnico"
            onPress={handleSupport}
          />
        </View>

        {/* 3️⃣ Become Technician */}
        <View style={styles.technicianCard}>
          <Text style={styles.technicianTitle}>
            ¿Quieres convertirte en técnico?
          </Text>
          <Text style={styles.technicianDescription}>
            Únete a nuestra plataforma y genera ingresos reparando lo que amas.
            Miles de clientes esperan tu ayuda.
          </Text>
          <TouchableOpacity
            style={styles.technicianButton}
            onPress={handleRegisterAsTechnician}
            activeOpacity={0.7}
          >
            <Text style={styles.technicianButtonText}>
              Registrarse como Técnico
            </Text>
          </TouchableOpacity>
        </View>

        {/* 4️⃣ Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

interface QuickAccessItemProps {
  icon: string;
  label: string;
  onPress: () => void;
}

const QuickAccessItem: React.FC<QuickAccessItemProps> = ({
  icon,
  label,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.quickAccessItem}
    onPress={onPress}
    activeOpacity={0.6}
  >
    <Text style={styles.quickAccessIcon}>{icon}</Text>
    <Text style={styles.quickAccessLabel}>{label}</Text>
    <Text style={styles.quickAccessChevron}>›</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WIZARD_COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  errorText: {
    textAlign: 'center',
    color: WIZARD_COLORS.text,
    fontSize: 16,
    marginTop: 20,
  },

  // User Card
  userCard: {
    backgroundColor: WIZARD_COLORS.white,
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: WIZARD_COLORS.border,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: WIZARD_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: WIZARD_COLORS.white,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: WIZARD_COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: WIZARD_COLORS.textSecondary,
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 12,
    color: WIZARD_COLORS.textLight,
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: WIZARD_COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  editButtonText: {
    color: WIZARD_COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Quick Access Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: WIZARD_COLORS.text,
    marginBottom: 12,
  },
  quickAccessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WIZARD_COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: WIZARD_COLORS.border,
  },
  quickAccessIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  quickAccessLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: WIZARD_COLORS.text,
  },
  quickAccessChevron: {
    fontSize: 20,
    color: WIZARD_COLORS.textLight,
  },

  // Technician Card
  technicianCard: {
    backgroundColor: WIZARD_COLORS.profileTechBg,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: WIZARD_COLORS.primary,
  },
  technicianTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: WIZARD_COLORS.primary,
    marginBottom: 8,
  },
  technicianDescription: {
    fontSize: 13,
    color: WIZARD_COLORS.text,
    lineHeight: 18,
    marginBottom: 16,
  },
  technicianButton: {
    backgroundColor: WIZARD_COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  technicianButtonText: {
    color: WIZARD_COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Logout Button
  logoutButton: {
    backgroundColor: WIZARD_COLORS.logoutBg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: WIZARD_COLORS.logoutBorder,
  },
  logoutButtonText: {
    color: WIZARD_COLORS.logoutText,
    fontSize: 14,
    fontWeight: '600',
  },

  bottomSpacer: {
    height: 20,
  },
});

export default ClientProfileScreen;
