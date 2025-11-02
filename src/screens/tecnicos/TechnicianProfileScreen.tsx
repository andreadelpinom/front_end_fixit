import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TechnicianProfileScreenStyles as styles } from "../../styles";
import CertificationBanner from "../../components/CertificationBanner";
import { GenericModal } from "../../components/GenericModal";
import Separator from "../../helpers";
import { getData, saveData, StorageKeys } from "../../shared/storage";
import { useAuth } from "../../context/AuthContext";
import { technician } from "../../theme/colors";
import { CERTIFICATIONS, SKILLS, USER_DATA } from "../DummyData";
import {
  CertificationsSectionProps,
  SkillsSectionProps,
  StatsSectionProps,
  ProfileCardProps,
  ActionButtonsProps,
  LogoutButtonProps,
} from "../../interface";
import { CertificationItemProps, SkillItemProps } from "../../types";

// ===== UTILITIES =====
const getSkillWidth = (level: string): string => {
  const widths: Record<string, string> = {
    Avanzado: "90%",
    Intermedio: "60%",
  };
  return widths[level] || "40%";
};

const transformCertifications = (certifications: typeof CERTIFICATIONS) =>
  certifications.map((cert) => ({
    id: cert.id,
    name: cert.name,
    issuer: cert.issuer,
    date: `Emitido: ${cert.issueDate}`,
  }));

// ===== ITEM RENDERERS =====
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

export const SkillItem = ({ item }: SkillItemProps) => (
  <View style={styles.skillCard}>
    <View>
      <Text style={styles.skillName}>{item.name}</Text>
      <Text style={styles.skillLevel}>{item.level}</Text>
    </View>
    <View style={styles.skillLevelBar}>
      {/* ✅ Fixed width typing by casting to a valid DimensionValue */}
      <View
        style={[styles.skillLevelFill, { width: getSkillWidth(item.level) as any }]}
      />
    </View>
  </View>
);

// ===== SECTION COMPONENTS =====
const CertificationsSection = ({
  certifications,
}: CertificationsSectionProps) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, { color: technician.dark }]}>
      Certificaciones
    </Text>
    <FlatList
      data={certifications}
      renderItem={({ item }) => <CertificationItem item={item} />}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      ItemSeparatorComponent={Separator}
    />
  </View>
);

const SkillsSection = ({ skills }: SkillsSectionProps) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, { color: technician.dark }]}>
      Habilidades
    </Text>
    <FlatList
      data={skills}
      renderItem={({ item }) => <SkillItem item={item} />}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      ItemSeparatorComponent={Separator}
    />
  </View>
);

const StatsSection = ({ userData }: StatsSectionProps) => (
  <View style={styles.statsGrid}>
    <View
      style={[
        styles.statCard,
        { borderColor: technician.primary, backgroundColor: "#FFFFFF" },
      ]}
    >
      <Text style={styles.statIcon}>⭐</Text>
      <Text style={[styles.statValue, { color: technician.dark }]}>
        {userData.averageRating}
      </Text>
      <Text style={styles.statLabel}>Rating</Text>
    </View>
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>✔</Text>
      <Text style={[styles.statValue, { color: technician.dark }]}>
        {userData.completedServices}
      </Text>
      <Text style={styles.statLabel}>Servicios</Text>
    </View>
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>⏱️</Text>
      <Text style={[styles.statValue, { color: technician.dark }]}>
        {userData.responseTime}
      </Text>
      <Text style={styles.statLabel}>Respuesta</Text>
    </View>
  </View>
);

const ProfileCard = ({ userData }: ProfileCardProps) => (
  <View
    style={[
      styles.profileCard,
      { borderColor: technician.primary, backgroundColor: "#FFFFFF" },
    ]}
  >
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
          <View
            style={[
              styles.certificationBadge,
              { backgroundColor: technician.dark },
            ]}
          >
            <Text style={styles.certificationBadgeText}>
              🛡️ Técnico Certificado
            </Text>
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
  <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
    <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
  </TouchableOpacity>
);

// ===== HOOKS =====
const useBannerState = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const fetchBannerStatus = async () => {
      const seen = await getData<boolean>(
        StorageKeys.Technician.CertBannerSeen
      );
      setShowBanner(!seen);
    };
    fetchBannerStatus();
  }, []);

  const handleBannerClose = async (): Promise<void> => {
    setShowBanner(false);
    await saveData(StorageKeys.Technician.CertBannerSeen, true);
  };

  return { showBanner, handleBannerClose };
};

const useLogoutHandler = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        // ✅ FIXED: wrap async in void arrow so callback type stays void
        onPress: () => {
          void (async () => {
            try {
              await logout();
              console.log("Logout exitoso");
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "No se pudo cerrar sesión");
            }
          })();
        },
      },
    ]);
  };

  return handleLogout;
};

// ===== MAIN COMPONENT =====
export default function TechnicianProfileScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [showNotifications, setShowNotifications] = useState(false);

  const { showBanner, handleBannerClose } = useBannerState();
  const handleLogout = useLogoutHandler();

  const handleContact = () => console.log("Contactar técnico");
  const handleViewRequests = () => console.log("Ver solicitudes");

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: technician.light, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {navigation.canGoBack() && (
          <View style={styles.backButtonContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={[styles.backButton, { color: technician.primary }]}>
                ← Atrás
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowNotifications(true)}>
              <Text style={styles.notificationIcon}>🔔</Text>
            </TouchableOpacity>
          </View>
        )}

        {showBanner && (
          <CertificationBanner isOpen={showBanner} onClose={handleBannerClose} />
        )}

        <ProfileCard userData={USER_DATA} />
        <StatsSection userData={USER_DATA} />
        <CertificationsSection
          certifications={transformCertifications(CERTIFICATIONS)}
        />
        <SkillsSection skills={SKILLS} />
        <ActionButtons
          onContact={handleContact}
          onViewRequests={handleViewRequests}
        />
        <LogoutButton onLogout={handleLogout} />

        <View style={{ height: 20 }} />
      </ScrollView>

      <GenericModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Notifications"
        content={<Text>You have new notifications!</Text>}
      />
    </View>
  );
}
