import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RequestsStyles as styles } from "../../styles";
import HeaderNav from "../../components/HeaderNav";
import { GenericModal } from "../../components/GenericModal";
import Separator from "../../helpers";
import { colors } from "../../theme/colors";
import { getData, saveData, StorageKeys } from "../../shared/storage";
import { REQUESTS } from "../DummyData";
import { RequestDetail } from "../../interface";

// ===== CONSTANTS =====
const STATUSES = ["Todos", "En progreso", "Finalizado", "Cancelado"];

const STATUS_COLORS: Record<string, string> = {
  "En progreso": colors.primary,
  Finalizado: colors.status.success,
  Cancelado: colors.status.error,
};

// ===== UTILITIES =====
const getStatusColor = (status: string): string =>
  STATUS_COLORS[status] || colors.text.secondary;

const filterRequests = (
  requests: RequestDetail[],
  filterStatus: string,
  searchQuery: string
): RequestDetail[] => {
  const query = searchQuery.toLowerCase();

  return requests.filter((request) => {
    const matchesStatus =
      filterStatus === "Todos" || request.status === filterStatus;
    const matchesSearch =
      request.tituloProblema.toLowerCase().includes(query) ||
      request.client.toLowerCase().includes(query) ||
      request.location.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });
};

const countByStatus = (requests: RequestDetail[], status: string): number =>
  requests.filter((r) => r.status === status).length;

// ===== HOOKS =====
const usePersistedState = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    (async () => {
      const saved = await getData<T>(key);
      if (saved !== null) setValue(saved);
    })();
  }, [key]);

  const updateValue = (newValue: T) => {
    setValue(newValue);
    saveData(key, newValue);
  };

  return [value, updateValue] as const;
};

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

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar = ({ value, onChangeText }: SearchBarProps) => (
  <View style={styles.searchContainer}>
    <TextInput
      style={styles.searchInput}
      placeholder="Buscar solicitudes..."
      placeholderTextColor={colors.text.tertiary}
      value={value}
      onChangeText={onChangeText}
    />
    <Text style={styles.searchIcon}>🔍</Text>
  </View>
);

interface FilterButtonProps {
  status: string;
  isActive: boolean;
  onPress: () => void;
}

const FilterButton = ({ status, isActive, onPress }: FilterButtonProps) => (
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
      {status}
    </Text>
  </TouchableOpacity>
);

interface StatusFiltersProps {
  activeFilter: string;
  onFilterChange: (status: string) => void;
}

const StatusFilters = ({ activeFilter, onFilterChange }: StatusFiltersProps) => (
  <View style={styles.filterContainer}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersList}
    >
      {STATUSES.map((status) => (
        <FilterButton
          key={status}
          status={status}
          isActive={activeFilter === status}
          onPress={() => onFilterChange(status)}
        />
      ))}
    </ScrollView>
  </View>
);

interface RequestCardProps {
  item: RequestDetail;
  statusColor: string;
}

const RequestCard = ({ item, statusColor }: RequestCardProps) => (
  <TouchableOpacity
    style={styles.requestCard}
    onPress={() => console.log("Navigate to request detail")}
  >
    <View style={styles.requestImageContainer}>
      <Text style={styles.requestImage}>
        {item.category === "Electricidad" ? "⚡" : "🔧"}
      </Text>
    </View>

    <View style={styles.requestInfo}>
      <Text style={styles.requestTitle} numberOfLines={1}>
        {item.tituloProblema}
      </Text>
      <View style={styles.clientRow}>
        <Text style={styles.clientName}>{item.client}</Text>
        <Text style={styles.requestDate}>
          {item.fechaProgramada || "Sin fecha"}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${statusColor}20` },
          ]}
        >
          <Text style={[styles.statusBadgeText, { color: statusColor }]}>
            {item.status}
          </Text>
        </View>
      </View>
    </View>

    <View style={styles.requestRight}>
      <Text style={styles.requestPrice}>
        {item.duracionEstimadaMin ? `${item.duracionEstimadaMin} min` : "--"}
      </Text>
      <Text style={{ color: statusColor, fontSize: 12 }}>
        {item.location}
      </Text>
    </View>
  </TouchableOpacity>
);

interface EmptyStateProps {
  message?: string;
  submessage?: string;
}

const EmptyState = ({
  message = "No hay solicitudes",
  submessage = "Aún no tienes solicitudes con este estado",
}: EmptyStateProps) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>📋</Text>
    <Text style={styles.emptyText}>{message}</Text>
    <Text style={styles.emptySubtext}>{submessage}</Text>
  </View>
);

interface StatItemProps {
  label: string;
  value: number;
}

const StatItem = ({ label, value }: StatItemProps) => (
  <View style={styles.statItem}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

interface StatsSectionProps {
  requests: RequestDetail[];
}

const StatsSection = ({ requests }: StatsSectionProps) => (
  <View style={styles.statsSection}>
    <StatItem
      label="Finalizados"
      value={countByStatus(requests, "Finalizado")}
    />
    <StatItem
      label="En Progreso"
      value={countByStatus(requests, "En progreso")}
    />
    <StatItem
      label="Cancelados"
      value={countByStatus(requests, "Cancelado")}
    />
  </View>
);

// ===== MAIN COMPONENT =====
export default function Requests() {
  const insets = useSafeAreaInsets();
  const [showNotifications, setShowNotifications] = useState(false);

  const [filterStatus, setFilterStatus] = usePersistedState(
    StorageKeys.Technician.Requests + ":filter",
    "Todos"
  );

  const [searchQuery, setSearchQuery] = usePersistedState(
    StorageKeys.Technician.Requests + ":search",
    ""
  );

  const filteredRequests = useMemo(
    () => filterRequests(REQUESTS, filterStatus, searchQuery),
    [filterStatus, searchQuery]
  );

  const renderRequestCard = ({ item }: { item: RequestDetail }) => (
    <RequestCard item={item} statusColor={getStatusColor(item.status)} />
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <HeaderNav
        userName="Carlos"
        location="Centro, Guayaquil"
        notificationCount={2}
        onNotificationClick={() => setShowNotifications(true)}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TitleSection
          title="Mis Solicitudes"
          subtitle="Historial de trabajos y servicios realizados"
        />

        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        <StatusFilters
          activeFilter={filterStatus}
          onFilterChange={setFilterStatus}
        />

        {filteredRequests.length > 0 ? (
          <FlatList
            data={filteredRequests}
            renderItem={renderRequestCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={Separator}
            contentContainerStyle={styles.requestsList}
          />
        ) : (
          <EmptyState />
        )}

        <StatsSection requests={REQUESTS} />

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
