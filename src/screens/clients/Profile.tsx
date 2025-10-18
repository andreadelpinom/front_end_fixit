import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import NotificationsModal from "../../components/NotificationModal";
import { useAuth } from "../../context/AuthContext";

const quickAccessItems = [
  {
    id: "history",
    title: "Historial de solicitudes",
    subtitle: "Ver todas mis solicitudes completadas",
    icon: "📋",
    count: 156
  },
  {
    id: "active",
    title: "Servicios activos",
    subtitle: "Solicitudes en progreso",
    icon: "⚙️",
    count: 3
  },
  {
    id: "notifications",
    title: "Notificaciones",
    subtitle: "Configurar alertas y avisos",
    icon: "🔔",
    count: 2
  },
  {
    id: "support",
    title: "Soporte técnico",
    subtitle: "Ayuda y contacto",
    icon: "🎧",
    count: null
  }
];

const settingsItems = [
  { id: "privacy", title: "Privacidad", icon: "🔒" },
  { id: "notifications", title: "Notificaciones", icon: "🔔" },
  { id: "payments", title: "Métodos de pago", icon: "💳" },
  { id: "language", title: "Idioma", icon: "🌐" }
];

export default function Profile() {
  const { user, logout, isLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentRole, setCurrentRole] = useState<"cliente" | "tecnico">(
    user?.role || "cliente"
  );

  // Handle logout with confirmation
  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Cerrar Sesión",
          onPress: async () => {
            try {
              await logout();
            } catch (err) {
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  // Use auth user data if available, otherwise use defaults
  const userData = user ? {
    name: user.name,
    email: user.email,
    completedServices: user.completedServices,
    averageRating: user.averageRating,
    responseTime: "15 min",
    joinDate: new Date(user.joinDate).toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric"
    }),
    isVerified: user.isVerified
  } : {
    name: "Carlos Mendoza",
    email: "carlos.mendoza@fixit.com",
    completedServices: 156,
    averageRating: 4.8,
    responseTime: "15 min",
    joinDate: "Enero 2023",
    isVerified: false
  };

  const renderQuickAccessItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.quickAccessItem}
      onPress={() => console.log(`Navigating to ${item.id}`)}
    >
      <View style={styles.quickAccessIcon}>
        <Text style={styles.iconText}>{item.icon}</Text>
      </View>
      <View style={styles.quickAccessContent}>
        <Text style={styles.quickAccessTitle}>{item.title}</Text>
        <Text style={styles.quickAccessSubtitle}>{item.subtitle}</Text>
      </View>
      {item.count !== null && (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{item.count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderSettingItem = ({ item }: any) => (
    <TouchableOpacity style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{item.icon}</Text>
        <Text style={styles.settingTitle}>{item.title}</Text>
      </View>
      <Text style={styles.settingArrow}>→</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header with notification and settings */}
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => setShowNotifications(true)}>
            <Text style={styles.headerIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.headerIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>C</Text>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.email}>{userData.email}</Text>
            </View>
          </View>

          {/* User Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userData.completedServices}</Text>
              <Text style={styles.statLabel}>Servicios</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userData.averageRating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userData.responseTime}</Text>
              <Text style={styles.statLabel}>Respuesta</Text>
            </View>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonIcon}>✏️</Text>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Role Toggle */}
        <View style={styles.roleSection}>
          <Text style={styles.roleSectionTitle}>Mi Rol</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              onPress={() => setCurrentRole("cliente")}
              style={[
                styles.roleButton,
                currentRole === "cliente" && styles.roleButtonActive
              ]}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  currentRole === "cliente" && styles.roleButtonTextActive
                ]}
              >
                Cliente
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCurrentRole("tecnico")}
              style={[
                styles.roleButton,
                currentRole === "tecnico" && styles.roleButtonActive
              ]}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  currentRole === "tecnico" && styles.roleButtonTextActive
                ]}
              >
                Técnico
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acceso Rápido</Text>
          <FlatList
            data={quickAccessItems}
            renderItem={renderQuickAccessItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          <FlatList
            data={settingsItems}
            renderItem={renderSettingItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border }} />}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, isLoading && styles.buttonDisabled]}
          onPress={handleLogout}
          disabled={isLoading}
        >
          <Text style={styles.logoutButtonText}>
            {isLoading ? "Cerrando..." : "Cerrar Sesión"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flex: 1,
    paddingHorizontal: 16
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 16,
    marginBottom: 20
  },
  headerIcon: {
    fontSize: 24,
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16
  },
  avatarInitial: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700"
  },
  nameContainer: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 2
  },
  email: {
    fontSize: 12,
    color: colors.text.secondary
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },
  statBox: {
    alignItems: "center",
    flex: 1
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 2
  },
  statLabel: {
    fontSize: 11,
    color: colors.text.secondary
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8
  },
  editButtonIcon: {
    fontSize: 16
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600"
  },
  roleSection: {
    marginBottom: 24
  },
  roleSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 12
  },
  roleButtons: {
    flexDirection: "row",
    gap: 12
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center"
  },
  roleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  roleButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.secondary
  },
  roleButtonTextActive: {
    color: "#FFFFFF"
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 12
  },
  quickAccessItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  quickAccessIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.borderLight,
    justifyContent: "center",
    alignItems: "center"
  },
  iconText: {
    fontSize: 20
  },
  quickAccessContent: {
    flex: 1
  },
  quickAccessTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 2
  },
  quickAccessSubtitle: {
    fontSize: 11,
    color: colors.text.secondary
  },
  countBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 28
  },
  countText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center"
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  settingIcon: {
    fontSize: 18
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.text.primary
  },
  settingArrow: {
    fontSize: 16,
    color: colors.text.tertiary
  },
  logoutButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20
  },
  logoutButtonText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600"
  },
  buttonDisabled: {
    opacity: 0.6
  }
});

