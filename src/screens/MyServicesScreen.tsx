import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Switch
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import HeaderNav from "../components/HeaderNav";
import NotificationsModal from "../components/NotificationModal";

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

export default function MyServicesScreen() {
  const insets = useSafeAreaInsets();
  const [showNotifications, setShowNotifications] = useState(false);
  const [services, setServices] = useState(myServices);

  const handleToggleService = (id: string) => {
    setServices(
      services.map(service =>
        service.id === id
          ? { ...service, isActive: !service.isActive }
          : service
      )
    );
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
    .reduce((sum, s) => sum + parseInt(s.price.replace("$", "")), 0);

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
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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
  statsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border
  },
  statLabel: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: "500",
    marginBottom: 4
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary
  },
  servicesList: {
    gap: 12,
    marginBottom: 16
  },
  serviceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  serviceCardInactive: {
    opacity: 0.6
  },
  serviceLeft: {
    flex: 1
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary,
    flex: 1
  },
  activeBadge: {
    backgroundColor: colors.status.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  activeBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700"
  },
  inactiveBadge: {
    backgroundColor: colors.text.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  inactiveBadgeText: {
    color: colors.text.tertiary,
    fontSize: 9,
    fontWeight: "700"
  },
  serviceDescription: {
    fontSize: 11,
    color: colors.text.secondary,
    marginBottom: 6
  },
  serviceStats: {
    flexDirection: "row",
    gap: 8
  },
  statBadge: {
    fontSize: 10,
    color: colors.text.tertiary,
    fontWeight: "500"
  },
  serviceRight: {
    alignItems: "center",
    gap: 8,
    marginLeft: 12
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary
  },
  toggle: {
    marginVertical: 0
  },
  addServiceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    marginBottom: 20
  },
  addServiceIcon: {
    fontSize: 20,
    color: "#FFFFFF"
  },
  addServiceText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600"
  },
  infoSection: {
    marginTop: 8
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
    fontSize: 24,
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
