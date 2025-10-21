import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NotificationModal from "../../components/NotificationModal";
import { colors, client, technician } from "../../theme/colors";
import { ProfileStyles as styles } from "../../styles";
import { useAuth } from "../../context/AuthContext";

const renderSeparator = () => <View style={{ height: 12 }} />;

const renderSettingSeparator = () => (
  <View style={{ height: 1, backgroundColor: colors.border }} />
);

export default function Profile() {
  const { user, logout, isLoading, requestTechnician } = useAuth();
  const insets = useSafeAreaInsets();
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentRole, setCurrentRole] = useState<"cliente" | "tecnico">(user?.role || "cliente");
  const palette = currentRole === "tecnico" ? technician : client;

  const quickAccessItems = [
    { id: "history", title: "Historial de solicitudes", subtitle: "Ver todas mis solicitudes completadas", icon: "📋", count: 156 },
    { id: "active", title: "Servicios activos", subtitle: "Solicitudes en progreso", icon: "⚙️", count: 3 },
    { id: "notifications", title: "Notificaciones", subtitle: "Configurar alertas y avisos", icon: "🔔", count: 2 },
    { id: "support", title: "Soporte técnico", subtitle: "Ayuda y contacto", icon: "🎧", count: null }
  ];

  const settingsItems = [
    { id: "privacy", title: "Privacidad", icon: "🔒" },
    { id: "notifications", title: "Notificaciones", icon: "🔔" },
    { id: "payments", title: "Métodos de pago", icon: "💳" },
    { id: "language", title: "Idioma", icon: "🌐" }
  ];

  const userData = user ? {
    name: user.name,
    email: user.email,
    completedServices: user.completedServices,
    averageRating: user.averageRating,
    responseTime: "15 min",
    joinDate: new Date(user.joinDate).toLocaleDateString("es-ES", { month: "long", year: "numeric" }),
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

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", onPress: () => { }, style: "cancel" },
        {
          text: "Cerrar Sesión",
          onPress: () => {
            logout().catch(err => {
              console.error("Error al cerrar sesión:", err);
            });
          }
        }
      ]
    );
  };


  const renderQuickAccessItem = ({ item }: any) => (
    <TouchableOpacity style={styles.quickAccessItem} onPress={() => console.log(`Navigating to ${item.id}`)}>
      <View style={styles.quickAccessIcon}><Text style={styles.iconText}>{item.icon}</Text></View>
      <View style={styles.quickAccessContent}>
        <Text style={styles.quickAccessTitle}>{item.title}</Text>
        <Text style={styles.quickAccessSubtitle}>{item.subtitle}</Text>
      </View>
      {item.count !== null && (
        <View style={styles.countBadge}><Text style={styles.countText}>{item.count}</Text></View>
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
    <View style={[styles.container, { backgroundColor: palette.light, paddingBottom: insets.bottom }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => setShowNotifications(true)}><Text style={styles.headerIcon}>🔔</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.headerIcon}>⚙️</Text></TouchableOpacity>
        </View>
        <View style={[styles.profileCard, { borderColor: palette.primary, backgroundColor: palette.light }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: palette.primary }]}> <Text style={styles.avatarInitial}>C</Text></View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.email}>{userData.email}</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}><Text style={styles.statValue}>{userData.completedServices}</Text><Text style={styles.statLabel}>Servicios</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}><Text style={styles.statValue}>{userData.averageRating}</Text><Text style={styles.statLabel}>Rating</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}><Text style={styles.statValue}>{userData.responseTime}</Text><Text style={styles.statLabel}>Respuesta</Text></View>
          </View>
          <TouchableOpacity style={[styles.editButton, { backgroundColor: palette.primary }]}><Text style={styles.editButtonIcon}>✏️</Text><Text style={styles.editButtonText}>Editar Perfil</Text></TouchableOpacity>
        </View>
        <View style={styles.roleSection}>
          <Text style={styles.roleSectionTitle}>Mi Rol</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              onPress={() => setCurrentRole("cliente")}
              style={[styles.roleButton, { borderColor: client.primary }, currentRole === "cliente" && { backgroundColor: client.primary, borderColor: client.primary }]}
            >
              <Text style={[styles.roleButtonText, currentRole === "cliente" && { color: "#fff" }]}>Cliente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setCurrentRole("tecnico"); if (user && !user.isTechnicianRequested) requestTechnician(); }}
              style={[styles.roleButton, { borderColor: technician.primary }, currentRole === "tecnico" && { backgroundColor: technician.primary, borderColor: technician.primary }]}
            >
              <Text style={[styles.roleButtonText, currentRole === "tecnico" && { color: "#fff" }]}>Técnico</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.dark }]}>Acceso Rápido</Text>
          <FlatList
            data={quickAccessItems}
            renderItem={renderQuickAccessItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={renderSeparator}
          />
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.dark }]}>Configuración</Text>
          <FlatList
            data={settingsItems}
            renderItem={renderSettingItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={renderSettingSeparator}
          />
        </View>
        <TouchableOpacity
          style={[styles.logoutButton, isLoading && styles.buttonDisabled, { borderColor: palette.primary }]}
          onPress={handleLogout}
          disabled={isLoading}
        >
          <Text style={[styles.logoutButtonText, { color: palette.dark }]}>{isLoading ? "Cerrando..." : "Cerrar Sesión"}</Text>
        </TouchableOpacity>
        <View style={{ height: 20 }} />
      </ScrollView>
      <NotificationModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </View>
  );
}
