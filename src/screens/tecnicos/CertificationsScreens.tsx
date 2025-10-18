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
import { colors } from "../../theme/colors";
import HeaderNav from "../../components/HeaderNav";
import NotificationsModal from "../../components/NotificationModal";

const certificationData = [
  {
    id: "1",
    name: "Electricidad Residencial",
    issuer: "Instituto Técnico Nacional",
    issueDate: "2023-06-15",
    expiryDate: "2026-06-15",
    status: "Vigente",
    credentialId: "ETRN-2023-001",
    image: "⚡"
  },
  {
    id: "2",
    name: "Plomería Avanzada",
    issuer: "Colegio de Técnicos",
    issueDate: "2023-08-20",
    expiryDate: "2025-08-20",
    status: "Vigente",
    credentialId: "PLOM-2023-002",
    image: "🔧"
  },
  {
    id: "3",
    name: "Aire Acondicionado",
    issuer: "Asociación de Técnicos",
    issueDate: "2023-10-10",
    expiryDate: "2024-10-10",
    status: "Por Expirar",
    credentialId: "AIRE-2023-003",
    image: "❄️"
  },
  {
    id: "4",
    name: "Mantenimiento General",
    issuer: "Centro de Capacitación",
    issueDate: "2022-12-05",
    expiryDate: "2022-12-05",
    status: "Expirado",
    credentialId: "MANT-2022-004",
    image: "🔨"
  }
];

export default function CertificationsScreen() {
  const insets = useSafeAreaInsets();
  const [showNotifications, setShowNotifications] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Todos");

  const filters = ["Todos", "Vigente", "Por Expirar", "Expirado"];

  const filteredCertifications =
    filterStatus === "Todos"
      ? certificationData
      : certificationData.filter(cert => cert.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Vigente":
        return colors.status.success;
      case "Por Expirar":
        return colors.status.warning;
      case "Expirado":
        return colors.status.error;
      default:
        return colors.text.secondary;
    }
  };

  const renderCertificationCard = ({ item }: any) => (
    <View style={styles.certCard}>
      <View style={styles.certHeader}>
        <View style={styles.certImageContainer}>
          <Text style={styles.certImage}>{item.image}</Text>
        </View>
        <View style={styles.certTitleSection}>
          <Text style={styles.certName}>{item.name}</Text>
          <Text style={styles.certIssuer}>{item.issuer}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(item.status)}20` }
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.certDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Emitido:</Text>
          <Text style={styles.detailValue}>{item.issueDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Expira:</Text>
          <Text
            style={[
              styles.detailValue,
              { color: getStatusColor(item.status) }
            ]}
          >
            {item.expiryDate}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ID Certificado:</Text>
          <Text style={styles.detailValue}>{item.credentialId}</Text>
        </View>
      </View>

      <View style={styles.certFooter}>
        <TouchableOpacity style={styles.verifyButton}>
          <Text style={styles.verifyButtonText}>Verificar Credencial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadIcon}>⬇️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <HeaderNav
        userName="Carlos"
        location="Centro, Guayaquil"
        notificationCount={1}
        onNotificationClick={() => setShowNotifications(true)}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Mis Certificaciones</Text>
          <Text style={styles.subtitle}>
            Gestiona tus certificados profesionales
          </Text>
        </View>

        {/* Certifications Summary */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>📜</Text>
            <Text style={styles.summaryValue}>
              {certificationData.filter(c => c.status === "Vigente").length}
            </Text>
            <Text style={styles.summaryLabel}>Vigentes</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>⚠️</Text>
            <Text style={styles.summaryValue}>
              {certificationData.filter(c => c.status === "Por Expirar").length}
            </Text>
            <Text style={styles.summaryLabel}>Por Expirar</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>❌</Text>
            <Text style={styles.summaryValue}>
              {certificationData.filter(c => c.status === "Expirado").length}
            </Text>
            <Text style={styles.summaryLabel}>Expirados</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          >
            {filters.map(filter => (
              <TouchableOpacity
                key={filter}
                onPress={() => setFilterStatus(filter)}
                style={[
                  styles.filterButton,
                  filterStatus === filter && styles.filterButtonActive
                ]}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterStatus === filter && styles.filterButtonTextActive
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Certifications List */}
        {filteredCertifications.length > 0 ? (
          <FlatList
            data={filteredCertifications}
            renderItem={renderCertificationCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={styles.certsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📜</Text>
            <Text style={styles.emptyText}>
              No hay certificaciones con este estado
            </Text>
          </View>
        )}

        {/* Add Certification Button */}
        <TouchableOpacity style={styles.addCertButton}>
          <Text style={styles.addCertIcon}>+</Text>
          <Text style={styles.addCertText}>Agregar Certificación</Text>
        </TouchableOpacity>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <View>
            <Text style={styles.infoTitle}>Mantén tus certificaciones actualizadas</Text>
            <Text style={styles.infoText}>
              Los clientes valoran técnicos con certificaciones vigentes. Renueva antes de que expiren.
            </Text>
          </View>
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
  titleSection: {
    marginTop: 20,
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.secondary
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border
  },
  summaryIcon: {
    fontSize: 20,
    marginBottom: 4
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 2
  },
  summaryLabel: {
    fontSize: 10,
    color: colors.text.secondary
  },
  filterContainer: {
    marginBottom: 16
  },
  filtersList: {
    gap: 8,
    paddingRight: 16
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.secondary
  },
  filterButtonTextActive: {
    color: "#FFFFFF"
  },
  certsList: {
    gap: 12,
    marginBottom: 16
  },
  certCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  certHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12
  },
  certImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.borderLight,
    justifyContent: "center",
    alignItems: "center"
  },
  certImage: {
    fontSize: 24
  },
  certTitleSection: {
    flex: 1
  },
  certName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 2
  },
  certIssuer: {
    fontSize: 11,
    color: colors.text.secondary
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700"
  },
  certDetails: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    gap: 4
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  detailLabel: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: "500"
  },
  detailValue: {
    fontSize: 11,
    color: colors.text.primary,
    fontWeight: "600"
  },
  certFooter: {
    flexDirection: "row",
    gap: 8
  },
  verifyButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center"
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600"
  },
  downloadButton: {
    width: 40,
    borderRadius: 8,
    backgroundColor: colors.borderLight,
    justifyContent: "center",
    alignItems: "center"
  },
  downloadIcon: {
    fontSize: 16
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    marginTop: 20
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary
  },
  addCertButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
    marginBottom: 20
  },
  addCertIcon: {
    fontSize: 18,
    color: "#FFFFFF"
  },
  addCertText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600"
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  infoIcon: {
    fontSize: 20,
    marginTop: 2
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4
  },
  infoText: {
    fontSize: 11,
    color: colors.text.secondary,
    lineHeight: 15
  }
});
