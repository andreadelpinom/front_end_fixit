import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import HeaderNav from "../../components/HeaderNav";
import NotificationsModal from "../../components/NotificationModal";
import AcceptRequestFlow from "../../components/AcceptRequestFlow";

const sampleRequests = [
  {
    id: "REQ-001",
    title: "Electricidad - Instalación",
    description: "Instalar nuevos interruptores y tomacorrientes",
    client: "María González",
    date: "2024-03-15",
    time: "14:30",
    location: "Centro",
    price: 85,
    urgency: "Normal",
    status: "Publicado",
    isNew: true,
    image: "⚡"
  },
  {
    id: "REQ-002",
    title: "Plomería - Reparación",
    description: "Reparar fuga de agua en grifería de cocina",
    client: "Carlos Mendoza",
    date: "2024-03-15",
    time: "09:00",
    location: "Norte",
    price: 65,
    urgency: "Urgente",
    status: "Publicado",
    isNew: false,
    image: "🔧"
  },
  {
    id: "REQ-003",
    title: "Aire acondicionado - Mantenimiento",
    description: "Limpieza profunda y revisión de filtros",
    client: "Ana López",
    date: "2024-03-16",
    time: "10:00",
    location: "Sur",
    price: 45,
    urgency: "Normal",
    status: "Publicado",
    isNew: false,
    image: "❄️"
  }
];

export default function TechnicianRequestsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("disponibles");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAcceptFlow, setShowAcceptFlow] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const tabs = [
    { id: "disponibles", label: "Disponibles", count: 3 },
    { id: "enProgreso", label: "En Progreso", count: 2 },
    { id: "finalizadas", label: "Finalizadas", count: 2 }
  ];

  const handleAcceptRequest = (request: any) => {
    setSelectedRequest({
      id: request.id,
      title: request.title,
      client: request.client,
      location: request.location,
      suggestedPrice: request.price,
      suggestedDate: request.date,
      suggestedTime: request.time
    });
    setShowAcceptFlow(true);
  };

  const filteredRequests = sampleRequests.filter(request =>
    request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRequestCard = ({ item }: any) => (
    <View style={styles.requestCard}>
      {item.isNew && <View style={styles.newBadge} />}
      <View style={styles.requestHeader}>
        <View style={styles.requestIcon}>
          <Text style={styles.iconText}>{item.image}</Text>
        </View>
        <View style={styles.requestInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.requestTitle} numberOfLines={1}>
              {item.title}
            </Text>
            {item.urgency === "Urgente" && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentText}>Urgente</Text>
              </View>
            )}
          </View>
          <Text style={styles.requestDescription} numberOfLines={1}>
            {item.description}
          </Text>
          <View style={styles.metaInfo}>
            <Text style={styles.metaText}>👤 {item.client}</Text>
            <Text style={styles.metaText}>📍 {item.location}</Text>
          </View>
          <View style={styles.dateTimeRow}>
            <Text style={styles.metaText}>📅 {item.date}</Text>
            <Text style={styles.metaText}>🕐 {item.time}</Text>
          </View>
        </View>
      </View>

      <View style={styles.requestFooter}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Precio estimado:</Text>
          <Text style={styles.priceAmount}>${item.price}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.detailButton}>
            <Text style={styles.detailButtonText}>Ver detalles</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAcceptRequest(item)}
          >
            <Text style={styles.acceptButtonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
          <Text style={styles.title}>Solicitudes de Servicios</Text>
          <Text style={styles.subtitle}>Encuentra nuevas oportunidades</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar solicitudes..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsList}
          >
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[
                  styles.tab,
                  activeTab === tab.id && styles.tabActive
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.id && styles.tabTextActive
                  ]}
                >
                  {tab.label}
                </Text>
                <View
                  style={[
                    styles.tabBadge,
                    activeTab === tab.id && styles.tabBadgeActive
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      activeTab === tab.id && styles.tabBadgeTextActive
                    ]}
                  >
                    {tab.count}
                  </Text>
                </View>
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
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No hay solicitudes disponibles</Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {selectedRequest && (
        <AcceptRequestFlow
          isOpen={showAcceptFlow}
          onClose={() => {
            setShowAcceptFlow(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
        />
      )}
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
    fontSize: 18
  },
  tabsContainer: {
    marginBottom: 16
  },
  tabsList: {
    gap: 8,
    paddingRight: 16
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.secondary
  },
  tabTextActive: {
    color: "#FFFFFF"
  },
  tabBadge: {
    backgroundColor: colors.borderLight,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  tabBadgeActive: {
    backgroundColor: "rgba(255, 255, 255, 0.3)"
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.text.secondary
  },
  tabBadgeTextActive: {
    color: "#FFFFFF"
  },
  requestsList: {
    gap: 12
  },
  requestCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative"
  },
  newBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.success
  },
  requestHeader: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12
  },
  requestIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.borderLight,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0
  },
  iconText: {
    fontSize: 24
  },
  requestInfo: {
    flex: 1
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2
  },
  requestTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary,
    flex: 1
  },
  urgentBadge: {
    backgroundColor: colors.status.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  urgentText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700"
  },
  requestDescription: {
    fontSize: 11,
    color: colors.text.secondary,
    marginBottom: 6
  },
  metaInfo: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4
  },
  metaText: {
    fontSize: 10,
    color: colors.text.tertiary
  },
  dateTimeRow: {
    flexDirection: "row",
    gap: 12
  },
  requestFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    gap: 8
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  priceLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: "500"
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8
  },
  detailButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center"
  },
  detailButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center"
  },
  acceptButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF"
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
  }
});
