import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Switch
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MyServicesScreenStyles as styles } from "../../styles";
import NotificationsModal from "../../components/NotificationModal";
import { getData, saveData, StorageKeys } from "../../shared/storage";
import HeaderNav from "../../components/HeaderNav";
import { colors } from "../../theme/colors";

const myServices = [
  {
    id: "1",
    title: "Reparación de aire acondicionado",
    description: "Limpieza y mantenimiento general",
    price: "$95",
    isActive: true,
    rating: 4.9,
    completions: 45
  },
  {
    id: "2",
    title: "Instalación de interruptores",
    description: "Nuevos interruptores y tomacorrientes",
    price: "$45",
    isActive: true,
    rating: 4.8,
    completions: 32
  },
  {
    id: "3",
    title: "Reparación de tuberías",
    description: "Fugas y goteos",
    price: "$75",
    isActive: false,
    rating: 4.7,
    completions: 28
  },
  {
    id: "4",
    title: "Carpintería general",
    description: "Puertas, marcos y muebles",
    price: "$120",
    isActive: true,
    rating: 4.6,
    completions: 19
  }
];

function ServiceSeparator() {
  return <View style={{ height: 12 }} />;
}

export default function MyServicesScreen() {
  const insets = useSafeAreaInsets();
  const [showNotifications, setShowNotifications] = useState(false);
  const [services, setServices] = useState(myServices);

  // Hydrate services from storage on mount
  useEffect(() => {
    (async () => {
      const saved = await getData<typeof myServices>(StorageKeys.Technician.MyServices);
      if (saved && Array.isArray(saved)) {
        setServices(saved);
      }
    })();
  }, []);

  const handleToggleService = async (id: string) => {
    setServices(prev => {
      const next = prev.map(service =>
        service.id === id ? { ...service, isActive: !service.isActive } : service
      );
      // Fire and forget persist
      saveData(StorageKeys.Technician.MyServices, next);
      return next;
    });
  };

  const renderServiceCard = ({ item }: any) => (
    <View
      style={[
        styles.serviceCard,
        !item.isActive && styles.serviceCardInactive
      ]}
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
          onValueChange={() => handleToggleService(item.id)}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={item.isActive ? colors.primary : colors.text.tertiary}
          style={styles.toggle}
        />
      </View>
    </View>
  );

  const activeCount = services.filter(s => s.isActive).length;
  const totalEarnings = services
    .filter(s => s.isActive)
    .reduce((sum, s) => sum + Number.parseInt(s.price.replace("$", "")), 0);

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
          <Text style={styles.title}>Mis Servicios</Text>
          <Text style={styles.subtitle}>Gestiona tus servicios disponibles</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Servicios Activos</Text>
            <Text style={styles.statValue}>{activeCount}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Precio Promedio</Text>
            <Text style={styles.statValue}>
              ${activeCount > 0 ? Math.round(totalEarnings / activeCount) : 0}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Servicios</Text>
            <Text style={styles.statValue}>{services.length}</Text>
          </View>
        </View>

        {/* Services List */}
        <FlatList
          data={services}
          renderItem={renderServiceCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={ServiceSeparator}
          contentContainerStyle={styles.servicesList}
        />


        {/* Add Service Button */}
        <TouchableOpacity style={styles.addServiceButton}>
          <Text style={styles.addServiceIcon}>+</Text>
          <Text style={styles.addServiceText}>Agregar Nuevo Servicio</Text>
        </TouchableOpacity>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>💡</Text>
            <View>
              <Text style={styles.infoTitle}>Consejos para más solicitudes</Text>
              <Text style={styles.infoText}>
                Mantén tus servicios activos y con descripciones claras para atraer más clientes.
              </Text>
            </View>
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
