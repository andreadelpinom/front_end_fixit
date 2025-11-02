import { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TechnicianRequestScreenStyles as styles } from "../../styles";
import { colors } from "../../theme/colors";
import HeaderNav from "../../components/HeaderNav";
import AcceptRequestFlow from "../../components/AcceptRequestFlow";
import { GenericModal } from "../../components/GenericModal";
import Separator from "../../helpers";
import { RequestDetail } from "../../interface";
import { REQUESTS } from "../DummyData";

// ===== TYPES =====
interface Tab {
  id: string;
  label: string;
  count: number;
}

// ===== CONSTANTS =====
const TABS: Tab[] = [
  { id: "disponibles", label: "Disponibles", count: 3 },
  { id: "enProgreso", label: "En Progreso", count: 2 },
  { id: "finalizadas", label: "Finalizadas", count: 2 },
];

// ===== UTILITIES =====
const filterRequests = (
  requests: RequestDetail[],
  searchQuery: string
): RequestDetail[] => {
  const query = searchQuery.toLowerCase();
  return requests.filter(
    (request) =>
      request.tituloProblema.toLowerCase().includes(query) ||
      request.location.toLowerCase().includes(query) ||
      request.client.toLowerCase().includes(query)
  );
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

interface TabButtonProps {
  tab: Tab;
  isActive: boolean;
  onPress: () => void;
}

const TabButton = ({ tab, isActive, onPress }: TabButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tab, isActive && styles.tabActive]}
  >
    <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
      {tab.label}
    </Text>
    <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
      <Text
        style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}
      >
        {tab.count}
      </Text>
    </View>
  </TouchableOpacity>
);

interface TabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Tabs = ({ activeTab, onTabChange }: TabsProps) => (
  <View style={styles.tabsContainer}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsList}
    >
      {TABS.map((tab) => (
        <TabButton
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.id}
          onPress={() => onTabChange(tab.id)}
        />
      ))}
    </ScrollView>
  </View>
);

interface RequestMetaProps {
  icon: string;
  text: string;
}

const RequestMeta = ({ icon, text }: RequestMetaProps) => (
  <Text style={styles.metaText}>
    {icon} {text}
  </Text>
);

interface RequestCardProps {
  item: RequestDetail;
  onViewDetails: () => void;
  onAccept: () => void;
}

const RequestCard = ({ item, onViewDetails, onAccept }: RequestCardProps) => (
  <View style={styles.requestCard}>
    {item.isNew && <View style={styles.newBadge} />}
    <View style={styles.requestHeader}>
      <View style={styles.requestIcon}>
        <Text style={styles.iconText}>{item.category || "🛠️"}</Text>
      </View>
      <View style={styles.requestInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.requestTitle} numberOfLines={1}>
            {item.tituloProblema}
          </Text>
          {item.status === "Publicado" && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>Nuevo</Text>
            </View>
          )}
        </View>
        <Text style={styles.requestDescription} numberOfLines={1}>
          {item.descripcionProblema}
        </Text>
        <View style={styles.metaInfo}>
          <RequestMeta icon="👤" text={item.client} />
          <RequestMeta icon="📍" text={item.location} />
        </View>
        <View style={styles.dateTimeRow}>
          <RequestMeta icon="📅" text={item.fechaProgramada ?? "Por definir"} />
          <RequestMeta icon="🕐" text={item.time} />
        </View>
      </View>
    </View>

    <View style={styles.requestFooter}>
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Precio estimado:</Text>
        <Text style={styles.priceAmount}>${item.costoEstimado ?? 0}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.detailButton} onPress={onViewDetails}>
          <Text style={styles.detailButtonText}>Ver detalles</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
          <Text style={styles.acceptButtonText}>Aceptar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({
  message = "No hay solicitudes disponibles",
}: EmptyStateProps) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>🔍</Text>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

// ===== MAIN COMPONENT =====
export default function TechnicianRequestsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("disponibles");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAcceptFlow, setShowAcceptFlow] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestDetail | null>(
    null
  );

  const filteredRequests = useMemo(
    () => filterRequests(REQUESTS, searchQuery),
    [searchQuery]
  );

  const handleAcceptRequest = (request: RequestDetail) => {
    setSelectedRequest({
      ...request,
      id: request.id,
      tituloProblema: request.tituloProblema,
      descripcionProblema: request.descripcionProblema,
      costoEstimado: request.costoEstimado,
      fechaProgramada: request.fechaProgramada,
      duracionEstimadaMin: request.duracionEstimadaMin,
    });
    setShowAcceptFlow(true);
  };

  const handleCloseAcceptFlow = () => {
    setShowAcceptFlow(false);
    setSelectedRequest(null);
  };

  const renderRequestCard = ({ item }: { item: RequestDetail }) => (
    <RequestCard
      item={item}
      onViewDetails={() =>
        navigation.navigate("TechnicianRequestDetail", { requestId: item.id })
      }
      onAccept={() => handleAcceptRequest(item)}
    />
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
          title="Solicitudes de Servicios"
          subtitle="Encuentra nuevas oportunidades"
        />

        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

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

        <View style={{ height: 20 }} />
      </ScrollView>

      <GenericModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Notificaciones"
        content={<Text>Tienes nuevas notificaciones</Text>}
      />

      {selectedRequest && (
        <AcceptRequestFlow
          isOpen={showAcceptFlow}
          onClose={handleCloseAcceptFlow}
          request={{
            ...selectedRequest,
            id: Number(selectedRequest.id),
          }}
        />
      )}
    </View>
  );
}
