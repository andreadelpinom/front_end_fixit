import { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { client, technician } from "../../theme/colors";
import { GenericModal } from "../../components/GenericModal";
import { ProfileStyles as styles } from "../../styles";
import { useAuth } from "../../context/AuthContext";
import { renderSeparator, renderSettingSeparator } from "../../helpers";
import { UserData, QuickAccessItem, SettingItem } from "../../interface";
import { QUICK_ACCESS_ITEMS, SETTINGS_ITEMS } from "../DummyData";
import { RoleButton } from "../../components/RoleButton";

export default function Profile() {
  const { user, logout, isLoading, requestTechnician } = useAuth();
  const insets = useSafeAreaInsets();

  const [showNotifications, setShowNotifications] = useState(false);
  const [currentRole, setCurrentRole] = useState<"cliente" | "tecnico">(user?.role || "cliente");

  const palette = currentRole === "tecnico" ? technician : client;

  const userData: UserData = useMemo(() => ({
    name: user?.name || "Carlos Mendoza",
    email: user?.email || "carlos.mendoza@fixit.com",
    completedServices: user?.completedServices ?? 156,
    averageRating: user?.averageRating ?? 4.8,
    responseTime: "15 min",
    joinDate: user ? new Date(user.joinDate).toLocaleDateString("es-ES", { month: "long", year: "numeric" }) : "Enero 2023",
    isVerified: user?.isVerified ?? false,
    isTechnicianRequested: user?.isTechnicianRequested,
  }), [user]);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar Sesión", onPress: () => void logout().catch(console.error) }
      ]
    );
  };

  const handleRoleChange = (role: "cliente" | "tecnico") => {
    setCurrentRole(role);
    if (role === "tecnico" && user && !user.isTechnicianRequested) requestTechnician();
  };

  const renderQuickAccessItem = ({ item }: { item: QuickAccessItem }) => (
    <TouchableOpacity style={styles.quickAccessItem} onPress={() => console.log(`Navigating to ${item.id}`)}>
      <View style={styles.quickAccessIcon}><Text style={styles.iconText}>{item.icon}</Text></View>
      <View style={styles.quickAccessContent}>
        <Text style={styles.quickAccessTitle}>{item.title}</Text>
        <Text style={styles.quickAccessSubtitle}>{item.subtitle}</Text>
      </View>
      {item.count !== undefined && item.count !== null && (
        <View style={styles.countBadge}><Text style={styles.countText}>{item.count}</Text></View>
      )}
    </TouchableOpacity>
  );

  const renderSettingItem = ({ item }: { item: SettingItem }) => (
    <TouchableOpacity style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{item.icon}</Text>
        <Text style={styles.settingTitle}>{item.title}</Text>
      </View>
      <Text style={styles.settingArrow}>→</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: palette.light, paddingBottom: insets.bottom }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => setShowNotifications(true)}><Text style={styles.headerIcon}>🔔</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.headerIcon}>⚙️</Text></TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { borderColor: palette.primary, backgroundColor: palette.light }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: palette.primary }]}><Text style={styles.avatarInitial}>{userData.name[0]}</Text></View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.email}>{userData.email}</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            {[
              { value: userData.completedServices, label: "Servicios" },
              { value: userData.averageRating, label: "Rating" },
              { value: userData.responseTime, label: "Respuesta" }
            ].map((stat, i, arr) => (
              <View key={stat.label} style={styles.statBox}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                {i < arr.length - 1 && <View style={styles.statDivider} />}
              </View>
            ))}
          </View>

          <TouchableOpacity style={[styles.editButton, { backgroundColor: palette.primary }]}>
            <Text style={styles.editButtonIcon}>✏️</Text>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Role Selection */}
        <View style={styles.roleSection}>
          <Text style={styles.roleSectionTitle}>Mi Rol</Text>
          <View style={styles.roleButtons}>
            <RoleButton role="cliente" label="Cliente" currentRole={currentRole} onPress={handleRoleChange} />
            <RoleButton role="tecnico" label="Técnico" currentRole={currentRole} onPress={handleRoleChange} />
          </View>
        </View>

        {/* Quick Access */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.dark }]}>Acceso Rápido</Text>
          <FlatList
            data={QUICK_ACCESS_ITEMS}
            renderItem={renderQuickAccessItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={renderSeparator}
          />
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.dark }]}>Configuración</Text>
          <FlatList
            data={SETTINGS_ITEMS}
            renderItem={renderSettingItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={renderSettingSeparator}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, isLoading && styles.buttonDisabled, { borderColor: palette.primary }]}
          onPress={handleLogout}
          disabled={isLoading}
        >
          <Text style={[styles.logoutButtonText, { color: palette.dark }]}>{isLoading ? "Cerrando..." : "Cerrar Sesión"}</Text>
        </TouchableOpacity>
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Notifications Modal */}
      <GenericModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Notificaciones"
        content={
          <ScrollView style={{ maxHeight: 300 }}>
            <Text>🔔 Configura tus alertas</Text>
            <Text>📌 Recordatorio de servicio próximo</Text>
            <Text>⚠️ Nueva solicitud pendiente</Text>
          </ScrollView>
        }
      />
    </View>
  );
}
