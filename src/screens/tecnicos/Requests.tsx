import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import HeaderNav from "../../components/HeaderNav";
import NotificationsModal from "../../components/NotificationModal";
import { getData, saveData, StorageKeys } from "../../shared/storage";

const requestsData = [
  {
    id: "1",
    title: "Reparación de lavadora",
    client: "María González",
    status: "En progreso",
    date: "Hoy, 14:30",
    location: "Centro",
    price: "$95",
    progress: 75,
    image: "🧺"
  },
  {
    id: "2",
    title: "Instalación aire acondicionado",
    client: "Juan Pérez",
    status: "Completada",
    date: "Ayer",
    location: "Norte",
    price: "$220",
    progress: 100,
    image: "❄️"
  },
  {
    id: "3",
    title: "Reparación de tubería",
    client: "Ana López",
    status: "En progreso",
    date: "Hoy, 10:00",
    location: "Sur",
    price: "$75",
    progress: 40,
    image: "🔧"
  },
  {
    id: "4",
    title: "Cambio de grifo",
    client: "Carlos Mendoza",
    status: "Completada",
    date: "Hace 3 días",
    location: "Centro",
    price: "$45",
    progress: 100,
    image: "💧"
  },
  {
    id: "5",
    title: "Reparación electricidad",
    client: "Rosa García",
    status: "Cancelada",
    date: "Hace 5 días",
    location: "Este",
    price: "$85",
    progress: 0,
    image: "⚡"
  }
];

export default function Requests() {
  const insets = useSafeAreaInsets();
  const [showNotifications, setShowNotifications] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  // Hydrate filters/search from storage
  useEffect(() => {
    (async () => {
      const savedFilter = await getData<string>(StorageKeys.Technician.Requests + ":filter");
      const savedSearch = await getData<string>(StorageKeys.Technician.Requests + ":search");
      if (savedFilter) setFilterStatus(savedFilter);
      if (savedSearch) setSearchQuery(savedSearch);
    })();
  }, []);

  const statuses = ["Todos", "En progreso", "Completadas", "Canceladas"];

  const filteredRequests = requestsData.filter(request => {
    const matchesStatus = filterStatus === "Todos" || request.status === filterStatus;
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleChangeFilter = (value: string) => {
    setFilterStatus(value);
    saveData(StorageKeys.Technician.Requests + ":filter", value);
  };

  const handleChangeSearch = (value: string) => {
    setSearchQuery(value);
    saveData(StorageKeys.Technician.Requests + ":search", value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En progreso":
        return colors.primary;
      case "Completada":
        return colors.status.success;
      case "Cancelada":
        return colors.status.error;
      default:
        return colors.text.secondary;
    }
  };

  const renderRequestCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => console.log("Navigate to request detail")}
    >
      <View style={styles.requestImageContainer}>
        <Text style={styles.requestImage}>{item.image}</Text>
      </View>

      <View style={styles.requestInfo}>
        <Text style={styles.requestTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.clientRow}>
          <Text style={styles.clientName}>{item.client}</Text>
          <Text style={styles.requestDate}>{item.date}</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${item.progress}%`, backgroundColor: getStatusColor(item.status) }
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: getStatusColor(item.status) }]}>
            {item.progress}%
          </Text>
        </View>
      </View>

      <View style={styles.requestRight}>
        <Text style={styles.requestPrice}>{item.price}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(item.status)}20` }
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              { color: getStatusColor(item.status) }
            ]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Mis Solicitudes</Text>
          <Text style={styles.subtitle}>
            Historial de trabajos y servicios realizados
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar solicitudes..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={handleChangeSearch}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>

        {/* Status Filters */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          >
            {statuses.map(status => (
              <TouchableOpacity
                key={status}
                onPress={() => handleChangeFilter(status)}
                style={[
                  styles.filterButton,
                  filterStatus === status && styles.filterButtonActive
                ]}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterStatus === status && styles.filterButtonTextActive
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Requests List */}
        {filteredRequests.length > 0 ? (
          <FlatList
            data={filteredRequests}
            renderItem={renderRequestCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={styles.requestsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No hay solicitudes</Text>
            <Text style={styles.emptySubtext}>
              Aún no tienes solicitudes con este estado
            </Text>
          </View>
        )}

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Completadas</Text>
            <Text style={styles.statValue}>
              {requestsData.filter(r => r.status === "Completada").length}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>En Progreso</Text>
            <Text style={styles.statValue}>
              {requestsData.filter(r => r.status === "En progreso").length}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Ingreso</Text>
            <Text style={styles.statValue}>$720</Text>
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
    marginBottom: 16
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 44
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    paddingVertical: 10
  },
  searchIcon: {
    fontSize: 18,
    marginLeft: 8
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
  requestsList: {
    gap: 12,
    marginBottom: 16
  },
  requestCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  requestImageContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.borderLight,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0
  },
  requestImage: {
    fontSize: 20
  },
  requestInfo: {
    flex: 1
  },
  requestTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4
  },
  clientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4
  },
  clientName: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: "500"
  },
  requestDate: {
    fontSize: 10,
    color: colors.text.tertiary
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 2
  },
  progressText: {
    fontSize: 10,
    fontWeight: "700",
    minWidth: 20
  },
  requestRight: {
    alignItems: "flex-end",
    gap: 6
  },
  requestPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700"
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
    color: colors.text.primary,
    marginBottom: 4
  },
  emptySubtext: {
    fontSize: 12,
    color: colors.text.secondary
  },
  statsSection: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  statItem: {
    flex: 1,
    alignItems: "center"
  },
  statLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: "500",
    marginBottom: 4
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary
  }
});