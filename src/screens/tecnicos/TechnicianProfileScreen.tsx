import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert
} from "react-native";
import { TechnicianProfileScreenStyles as styles } from "../../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NotificationsModal from "../../components/NotificationModal";
import CertificationBanner from "../../components/CertificationBanner";
import { getData, saveData, StorageKeys } from "../../shared/storage";
import { useAuth } from "../../context/AuthContext";
import { technician } from "../../theme/colors";
import { CertificationItemProps, SkillItemProps } from "../../types";
import { ActionButtonsProps, CertificationsSectionProps, LogoutButtonProps, ProfileCardProps, SkillsSectionProps, StatsSectionProps } from "../../interface";

// ----------------------------
// Componentes externos para FlatList
// ----------------------------

export const CertificationItem = ({ item }: CertificationItemProps) => (
  <View style={styles.certCard}>
    <View style={styles.certIcon}>
      <Text style={styles.certIconText}>🏆</Text>
    </View>
    <View style={styles.certContent}>
      <Text style={styles.certName}>{item.name}</Text>
      <Text style={styles.certIssuer}>{item.issuer}</Text>
      <Text style={styles.certDate}>{item.date}</Text>
    </View>
  </View>
);

export const SkillItem = ({ item }: SkillItemProps) => {
  const getSkillWidth = (level: string) => {
    if (level === "Avanzado") return "90%";
    if (level === "Intermedio") return "60%";
    return "40%";
  };

  return (
    <View style={styles.skillCard}>
      <View>
        <Text style={styles.skillName}>{item.name}</Text>
        <Text style={styles.skillLevel}>{item.level}</Text>
      </View>
      <View style={styles.skillLevelBar}>
        <View
          style={[
            styles.skillLevelFill,
            { width: getSkillWidth(item.level) }
          ]}
        />
      </View>
    </View>
  );
};

// ----------------------------
// Componentes para las secciones (extraídos del componente principal)
// ----------------------------
const ListSeparator = () => <View style={{ height: 10 }} />;

const CertificationsSection = ({ certifications }: CertificationsSectionProps) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, { color: technician.dark }]}>
      Certificaciones
    </Text>
    <FlatList
      data={certifications}
      renderItem={({ item }) => <CertificationItem item={item} />}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      ItemSeparatorComponent={ListSeparator}
    />
  </View>
);

const SkillsSection = ({ skills }: SkillsSectionProps) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, { color: technician.dark }]}>Habilidades</Text>
    <FlatList
      data={skills}
      renderItem={({ item }) => <SkillItem item={item} />}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      ItemSeparatorComponent={ListSeparator}
    />
  </View>
);

const StatsSection = ({ userData }: StatsSectionProps) => (
  <View style={styles.statsGrid}>
    <View style={[styles.statCard, { borderColor: technician.primary, backgroundColor: '#FFFFFF' }]}>
      <Text style={styles.statIcon}>⭐</Text>
      <Text style={[styles.statValue, { color: technician.dark }]}>{userData.averageRating}</Text>
      <Text style={styles.statLabel}>Rating</Text>
    </View>
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>✓</Text>
      <Text style={[styles.statValue, { color: technician.dark }]}>{userData.completedServices}</Text>
      <Text style={styles.statLabel}>Servicios</Text>
    </View>
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>⏱️</Text>
      <Text style={[styles.statValue, { color: technician.dark }]}>{userData.responseTime}</Text>
      <Text style={styles.statLabel}>Respuesta</Text>
    </View>
  </View>
);

const ProfileCard = ({ userData }: ProfileCardProps) => (
  <View style={[styles.profileCard, { borderColor: technician.primary, backgroundColor: '#FFFFFF' }]}>
    <View style={styles.avatarSection}>
      <View style={[styles.avatar, { backgroundColor: technician.dark }]}>
        <Text style={styles.avatarInitial}>C</Text>
      </View>
      {userData.isVerified && (
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedIcon}>✓</Text>
        </View>
      )}
    </View>

    <View style={styles.nameSection}>
      <View style={styles.nameRow}>
        <Text style={styles.name}>{userData.name}</Text>
        {userData.isVerified && (
          <View style={[styles.certificationBadge, { backgroundColor: technician.dark }]}>
            <Text style={styles.certificationBadgeText}>🛡️ Técnico Certificado</Text>
          </View>
        )}
      </View>
      <Text style={styles.email}>{userData.email}</Text>
      <Text style={styles.joinDate}>Miembro desde {userData.joinDate}</Text>
    </View>
  </View>
);

const ActionButtons = ({ onContact, onViewRequests }: ActionButtonsProps) => (
  <View style={styles.actionButtons}>
    <TouchableOpacity
      style={[styles.primaryButton, { backgroundColor: technician.dark }]}
      onPress={onContact}
    >
      <Text style={styles.primaryButtonText}>💬 Contactar</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.secondaryButton, { borderColor: technician.dark }]}
      onPress={onViewRequests}
    >
      <Text style={styles.secondaryButtonText}>📋 Ver Solicitudes</Text>
    </TouchableOpacity>
  </View>
);

const LogoutButton = ({ onLogout }: LogoutButtonProps) => (
  <TouchableOpacity
    style={styles.logoutButton}
    onPress={onLogout}
  >
    <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
  </TouchableOpacity>
);

// ----------------------------
// Pantalla principal
// ----------------------------
export default function TechnicianProfileScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const userData = {
    name: "Carlos Mendoza",
    email: "carlos.mendoza@fixit.com",
    completedServices: 156,
    averageRating: 4.8,
    responseTime: "15 min",
    joinDate: "Enero 2023",
    isVerified: true
  };

  const certifications = [
    { id: "1", name: "Electricidad Residencial", issuer: "Instituto Técnico Nacional", date: "2023-06-15" },
    { id: "2", name: "Plomería Avanzada", issuer: "Colegio de Técnicos", date: "2023-08-20" },
    { id: "3", name: "Aire Acondicionado", issuer: "Asociación de Técnicos", date: "2023-10-10" }
  ];

  const skills = [
    { id: "1", name: "Electricidad", level: "Avanzado" },
    { id: "2", name: "Plomería", level: "Avanzado" },
    { id: "3", name: "Aire Acondicionado", level: "Intermedio" },
    { id: "4", name: "Carpintería", level: "Intermedio" }
  ];

  useEffect(() => {
    (async () => {
      const seen = await getData<boolean>(StorageKeys.Technician.CertBannerSeen);
      setShowBanner(!seen);
    })();
  }, []);

  const handleBannerClose = async () => {
    setShowBanner(false);
    await saveData(StorageKeys.Technician.CertBannerSeen, true);
  };

  const handleContact = () => {
    // Lógica para contactar
    console.log("Contactar técnico");
  };

  const handleViewRequests = () => {
    // Lógica para ver solicitudes
    console.log("Ver solicitudes");
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: () => {
            (async () => {
              try {
                await logout();
              } catch (error) {
                console.error("Logout error:", error);
                Alert.alert("Error", "No se pudo cerrar sesión");
              }
            })();
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: technician.light, paddingBottom: insets.bottom }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        {navigation.canGoBack() && (
          <View style={styles.backButtonContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={[styles.backButton, { color: technician.primary }]}>← Atrás</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowNotifications(true)}>
              <Text style={styles.notificationIcon}>🔔</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Certification Banner */}
        {showBanner && (
          <CertificationBanner isOpen={showBanner} onClose={handleBannerClose} />
        )}

        {/* Profile Card */}
        <ProfileCard userData={userData} />

        {/* Stats */}
        <StatsSection userData={userData} />

        {/* Certifications */}
        <CertificationsSection certifications={certifications} />

        {/* Skills */}
        <SkillsSection skills={skills} />

        {/* Action Buttons */}
        <ActionButtons
          onContact={handleContact}
          onViewRequests={handleViewRequests}
        />

        {/* Logout Button */}
        <LogoutButton onLogout={handleLogout} />

        <View style={{ height: 20 }} />
      </ScrollView>

      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </View>
  );
}
