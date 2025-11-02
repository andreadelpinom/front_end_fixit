import { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CertificationsScreensStyles as styles } from "../../styles";
import HeaderNav from "../../components/HeaderNav";
import { GenericModal } from "../../components/GenericModal";
import Separator from "../../helpers";
import { colors } from "../../theme/colors";
import { CERTIFICATIONS } from "../DummyData";

// ===== TYPES =====
interface Certification {
  id: string;
  name: string;
  issuer: string;
  status: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  icon: string;
}

// ===== CONSTANTS =====
const FILTERS = ["Todos", "Vigente", "Por Expirar", "Expirado"];

const STATUS_COLORS: Record<string, string> = {
  Vigente: colors.status.success,
  "Por Expirar": colors.status.warning,
  Expirado: colors.status.error,
};

// ===== UTILITIES =====
const getStatusColor = (status: string): string =>
  STATUS_COLORS[status] || colors.text.secondary;

const filterCertifications = (
  certifications: Certification[],
  filterStatus: string
): Certification[] =>
  filterStatus === "Todos"
    ? certifications
    : certifications.filter((cert) => cert.status === filterStatus);

const countByStatus = (
  certifications: Certification[],
  status: string
): number => certifications.filter((c) => c.status === status).length;

// ===== COMPONENTS =====
interface TitleSectionProps {
  title: string;
  subtitle: string;
}

const TitleSection = ({ title, subtitle }: TitleSectionProps) => (
  <View style={styles.titleSection}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

interface SummaryCardProps {
  icon: string;
  value: number;
  label: string;
}

const SummaryCard = ({ icon, value, label }: SummaryCardProps) => (
  <View style={styles.summaryCard}>
    <Text style={styles.summaryIcon}>{icon}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
  </View>
);

interface SummarySectionProps {
  certifications: Certification[];
}

const SummarySection = ({ certifications }: SummarySectionProps) => (
  <View style={styles.summaryGrid}>
    <SummaryCard
      icon="📜"
      value={countByStatus(certifications, "Vigente")}
      label="Vigentes"
    />
    <SummaryCard
      icon="⚠️"
      value={countByStatus(certifications, "Por Expirar")}
      label="Por Expirar"
    />
    <SummaryCard
      icon="❌"
      value={countByStatus(certifications, "Expirado")}
      label="Expirados"
    />
  </View>
);

interface FilterButtonProps {
  filter: string;
  isActive: boolean;
  onPress: () => void;
}

const FilterButton = ({ filter, isActive, onPress }: FilterButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.filterButton, isActive && styles.filterButtonActive]}
  >
    <Text
      style={[
        styles.filterButtonText,
        isActive && styles.filterButtonTextActive,
      ]}
    >
      {filter}
    </Text>
  </TouchableOpacity>
);

interface FiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const Filters = ({ activeFilter, onFilterChange }: FiltersProps) => (
  <View style={styles.filterContainer}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersList}
    >
      {FILTERS.map((filter) => (
        <FilterButton
          key={filter}
          filter={filter}
          isActive={activeFilter === filter}
          onPress={() => onFilterChange(filter)}
        />
      ))}
    </ScrollView>
  </View>
);

interface DetailRowProps {
  label: string;
  value: string;
  valueColor?: string;
}

const DetailRow = ({ label, value, valueColor }: DetailRowProps) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, valueColor && { color: valueColor }]}>
      {value}
    </Text>
  </View>
);

interface CertificationCardProps {
  item: Certification;
}

const CertificationCard = ({ item }: CertificationCardProps) => {
  const statusColor = getStatusColor(item.status);

  return (
    <View style={styles.certCard}>
      <View style={styles.certHeader}>
        <View style={styles.certImageContainer}>
          <Text style={styles.certImage}>{item.icon}</Text>
        </View>
        <View style={styles.certTitleSection}>
          <Text style={styles.certName}>{item.name}</Text>
          <Text style={styles.certIssuer}>{item.issuer}</Text>
        </View>
        <View
          style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}
        >
          <Text style={[styles.statusText, { color: statusColor }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.certDetails}>
        <DetailRow label="Emitido:" value={item.issueDate} />
        <DetailRow
          label="Expira:"
          value={item.expiryDate}
          valueColor={statusColor}
        />
        <DetailRow label="ID Certificado:" value={item.credentialId} />
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
};

interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({
  message = "No hay certificaciones con este estado",
}: EmptyStateProps) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>📜</Text>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

const AddCertificationButton = () => (
  <TouchableOpacity style={styles.addCertButton}>
    <Text style={styles.addCertIcon}>+</Text>
    <Text style={styles.addCertText}>Agregar Certificación</Text>
  </TouchableOpacity>
);

const InfoCard = () => (
  <View style={styles.infoCard}>
    <Text style={styles.infoIcon}>ℹ️</Text>
    <View>
      <Text style={styles.infoTitle}>
        Mantén tus certificaciones actualizadas
      </Text>
      <Text style={styles.infoText}>
        Los clientes valoran técnicos con certificaciones vigentes. Renueva
        antes de que expiren.
      </Text>
    </View>
  </View>
);

// ===== MAIN COMPONENT =====
export default function CertificationsScreen() {
  const insets = useSafeAreaInsets();
  const [showNotifications, setShowNotifications] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Todos");

  const filteredCertifications = useMemo(
    () => filterCertifications(CERTIFICATIONS, filterStatus),
    [filterStatus]
  );

  const renderCertificationCard = ({ item }: { item: Certification }) => (
    <CertificationCard item={item} />
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
        <TitleSection
          title="Mis Certificaciones"
          subtitle="Gestiona tus certificados profesionales"
        />

        <SummarySection certifications={CERTIFICATIONS} />

        <Filters activeFilter={filterStatus} onFilterChange={setFilterStatus} />

        {filteredCertifications.length > 0 ? (
          <FlatList
            data={filteredCertifications}
            renderItem={renderCertificationCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={Separator}
            contentContainerStyle={styles.certsList}
          />
        ) : (
          <EmptyState />
        )}

        <AddCertificationButton />

        <InfoCard />

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