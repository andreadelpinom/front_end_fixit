import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MyServicesScreenStyles as styles } from "../../styles";
import HeaderNav from "../../components/HeaderNav";
import { GenericModal } from "../../components/GenericModal";
import Separator from "../../helpers";
import { colors } from "../../theme/colors";
import { getData, saveData, StorageKeys } from "../../shared/storage";
import { MY_SERVICES } from "../DummyData";

// ===== TYPES =====
interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  rating: number;
  completions: number;
  isActive: boolean;
}

// ===== UTILITIES =====
const extractPrice = (priceString: string): number =>
  Number.parseInt(priceString.replace("$", ""), 10) || 0;

const calculateStats = (services: Service[]) => {
  const activeServices = services.filter((s) => s.isActive);
  const activeCount = activeServices.length;
  const totalEarnings = activeServices.reduce(
    (sum, s) => sum + extractPrice(s.price),
    0
  );
  const averagePrice = activeCount > 0 ? Math.round(totalEarnings / activeCount) : 0;

  return { activeCount, averagePrice, totalCount: services.length };
};

// ===== HOOKS =====
const useServices = () => {
  const [services, setServices] = useState<Service[]>(MY_SERVICES);

  useEffect(() => {
    const loadServices = async () => {
      const saved = await getData<Service[]>(StorageKeys.Technician.MyServices);
      if (saved && Array.isArray(saved)) {
        setServices(saved);
      }
    };
    loadServices();
  }, []);

  const handleToggleService = async (id: string) => {
    setServices((prev) => {
      const next = prev.map((service) =>
        service.id === id ? { ...service, isActive: !service.isActive } : service
      );
      saveData(StorageKeys.Technician.MyServices, next);
      return next;
    });
  };

  return { services, handleToggleService };
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

interface StatBoxProps {
  label: string;
  value: string | number;
}

const StatBox = ({ label, value }: StatBoxProps) => (
  <View style={styles.statBox}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

interface StatsContainerProps {
  stats: ReturnType<typeof calculateStats>;
}

const StatsContainer = ({ stats }: StatsContainerProps) => (
  <View style={styles.statsContainer}>
    <StatBox label="Servicios Activos" value={stats.activeCount} />
    <StatBox label="Precio Promedio" value={`$${stats.averagePrice}`} />
    <StatBox label="Total Servicios" value={stats.totalCount} />
  </View>
);

interface ServiceCardProps {
  item: Service;
  onToggle: (id: string) => void;
}

const ServiceCard = ({ item, onToggle }: ServiceCardProps) => (
  <View
    style={[styles.serviceCard, !item.isActive && styles.serviceCardInactive]}
  >
    <View style={styles.serviceLeft}>
      <View>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {item.isActive ? (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Activo</Text>
            </View>
          ) : (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveBadgeText}>Inactivo</Text>
            </View>
          )}
        </View>
        <Text style={styles.serviceDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <View style={styles.serviceStats}>
          <Text style={styles.statBadge}>⭐ {item.rating}</Text>
          <Text style={styles.statBadge}>✓ {item.completions}</Text>
        </View>
      </View>
    </View>
    <View style={styles.serviceRight}>
      <Text style={styles.servicePrice}>{item.price}</Text>
      <Switch
        value={item.isActive}
        onValueChange={() => onToggle(item.id)}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={item.isActive ? colors.primary : colors.text.tertiary}
        style={styles.toggle}
      />
    </View>
  </View>
);

const AddServiceButton = () => (
  <TouchableOpacity style={styles.addServiceButton}>
    <Text style={styles.addServiceIcon}>+</Text>
    <Text style={styles.addServiceText}>Agregar Nuevo Servicio</Text>
  </TouchableOpacity>
);

const InfoSection = () => (
  <View style={styles.infoSection}>
    <View style={styles.infoCard}>
      <Text style={styles.infoIcon}>💡</Text>
      <View>
        <Text style={styles.infoTitle}>Consejos para más solicitudes</Text>
        <Text style={styles.infoText}>
          Mantén tus servicios activos y con descripciones claras para atraer
          más clientes.
        </Text>
      </View>
    </View>
  </View>
);

// ===== MAIN COMPONENT =====
export default function MyServicesScreen() {
  const insets = useSafeAreaInsets();
  const [showNotifications, setShowNotifications] = useState(false);
  const { services, handleToggleService } = useServices();

  const stats = useMemo(() => calculateStats(services), [services]);

  const renderServiceCard = ({ item }: { item: Service }) => (
    <ServiceCard item={item} onToggle={handleToggleService} />
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
          title="Mis Servicios"
          subtitle="Gestiona tus servicios disponibles"
        />

        <StatsContainer stats={stats} />

        <FlatList
          data={services}
          renderItem={renderServiceCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={styles.servicesList}
        />

        <AddServiceButton />

        <InfoSection />

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
