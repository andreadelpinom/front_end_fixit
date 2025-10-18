import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import NotificationsModal from "../components/NotificationModal";
import CertificationBanner from "../components/CertificationBanner";

export default function TechnicianProfileScreen() {
  const insets = useSafeAreaInsets();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

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
    {
      id: "1",
      name: "Electricidad Residencial",
      issuer: "Instituto Técnico Nacional",
      date: "2023-06-15"
    },
    {
      id: "2",
      name: "Plomería Avanzada",
      issuer: "Colegio de Técnicos",
      date: "2023-08-20"
    },
    {
      id: "3",
      name: "Aire Acondicionado",
      issuer: "Asociación de Técnicos",
      date: "2023-10-10"
    }
  ];

  const skills = [
    { id: "1", name: "Electricidad", level: "Avanzado" },
    { id: "2", name: "Plomería", level: "Avanzado" },
    { id: "3", name: "Aire Acondicionado", level: "Intermedio" },
    { id: "4", name: "Carpintería", level: "Intermedio" }
  ];

  const handleBannerClose = () => {
    setShowBanner(false);
    localStorage?.setItem('certificationBannerSeen', 'true');
  };

  const renderCertification = ({ item }: any) => (
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

  const renderSkill = ({ item }: any) => (
    <View style={styles.skillCard}>
      <View>
        <Text style={styles.skillName}>{item.name}</Text>
        <Text style={styles.skillLevel}>{item.level}</Text>
      </View>
      <View style={styles.skillLevelBar}>
        <View
          style={[
            styles.skillLevelFill,
            {
              width:
                item.level === "Avanzado"
                  ? "90%"
                  : item.level === "Intermedio"
                  ? "60%"
                  : "40%"
            }
          ]}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => console.log("Go back")}>
            <Text style={styles.backButton}>← Atrás</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowNotifications(true)}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Certification Banner */}
        {showBanner && (
          <CertificationBanner
            isOpen={showBanner}
            onClose={handleBannerClose}
          />
        )}

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
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
                <View style={styles.certificationBadge}>
                  <Text style={styles.certificationBadgeText}>
                    🛡️ Técnico Certificado
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.email}>{userData.email}</Text>
            <Text style={styles.joinDate}>
              Miembro desde {userData.joinDate}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{userData.averageRating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✓</Text>
            <Text style={styles.statValue}>{userData.completedServices}</Text>
            <Text style={styles.statLabel}>Servicios</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statValue}>{userData.responseTime}</Text>
            <Text style={styles.statLabel}>Respuesta</Text>
          </View>
        </View>

        {/* Certifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certificaciones</Text>
          <FlatList
            data={certifications}
            renderItem={renderCertification}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          <FlatList
            data={skills}
            renderItem={renderSkill}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>💬 Contactar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>📋 Ver Solicitudes</Text>
          </TouchableOpacity>
        </View>

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
  backButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16
  },
  backButton: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary
  },
  notificationIcon: {
    fontSize: 20
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center"
  },
  avatarSection: {
    position: "relative",
    marginBottom: 12
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center"
  },
  avatarInitial: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700"
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.status.success,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.background
  },
  verifiedIcon: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700"
  },
  nameSection: {
    alignItems: "center"
  },
  nameRow: {
    alignItems: "center",
    marginBottom: 4
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4
  },
  certificationBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  certificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600"
  },
  email: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4
  },
  joinDate: {
    fontSize: 11,
    color: colors.text.tertiary
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4
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
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 12
  },
  certCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  certIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.borderLight,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0
  },
  certIconText: {
    fontSize: 20
  },
  certContent: {
    flex: 1
  },
  certName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 2
  },
  certIssuer: {
    fontSize: 11,
    color: colors.text.secondary,
    marginBottom: 2
  },
  certDate: {
    fontSize: 10,
    color: colors.text.tertiary
  },
  skillCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  skillName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4
  },
  skillLevel: {
    fontSize: 11,
    color: colors.text.secondary,
    marginBottom: 6
  },
  skillLevelBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: "hidden"
  },
  skillLevelFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3
  },
  actionButtons: {
    gap: 12
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center"
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600"
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center"
  },
  secondaryButtonText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600"
  }
});
