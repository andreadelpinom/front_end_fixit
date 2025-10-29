import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getData, saveData, StorageKeys } from "../../shared/storage";
import { RequestsStyles as styles } from "../../styles";
import HeaderNav from "../../components/HeaderNav";
import { colors } from "../../theme/colors";
import { GenericModal } from "../../components/GenericModal";

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

function RequestSeparator() {
  return <View style={{ height: 12 }} />;
}

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
            ItemSeparatorComponent={RequestSeparator}
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

      <GenericModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Notifications"
        content={<Text>You have new notifications!</Text>}
      />
    </View>
  );
}
