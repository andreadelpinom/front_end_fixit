import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, client } from "../../theme/colors";
import HeaderNav from "../../components/HeaderNav";
import NotificationsModal from "../../components/NotificationModal";
import { getData, saveData, StorageKeys } from "../../shared/storage";

// Tipos de datos simulados (listos para conectar a backend)
interface Category {
  id: string;
  name: string;
  icon: string; // emoji por ahora
}

interface TechnicianCard {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  distanceKm: number;
  isOnline: boolean;
}

interface OfferCard {
  id: string;
  title: string;
  description: string;
  urgent?: boolean;
  validUntil: string; // fecha legible
  fromPrice: string; // texto como "$800"
}

const categoriesMock: Category[] = [
  { id: "electricidad", name: "Electricidad", icon: "⚡" },
  { id: "plomeria", name: "Plomería", icon: "💧" },
  { id: "pintura", name: "Pintura", icon: "🎨" },
  { id: "jardineria", name: "Jardinería", icon: "🌿" },
  { id: "aire", name: "Aire Acond.", icon: "❄️" },
  { id: "electro", name: "Electrodomést.", icon: "🛠️" }
];

const topTechniciansMock: TechnicianCard[] = [
  { id: "t1", name: "Carlos Méndez", specialty: "Electricista Certificado", rating: 4.9, distanceKm: 2.3, isOnline: true },
  { id: "t2", name: "Lucía Pérez", specialty: "Plomería", rating: 4.8, distanceKm: 1.1, isOnline: true },
  { id: "t3", name: "Jorge Ruiz", specialty: "Pintura", rating: 4.7, distanceKm: 3.5, isOnline: false }
];

const offersMock: OfferCard[] = [
  { id: "o1", title: "20% OFF en Plomería", description: "Reparación de fugas e instalaciones", urgent: true, validUntil: "Válido hasta hoy", fromPrice: "$800" },
  { id: "o2", title: "Limpieza de aire A/C", description: "Mantenimiento preventivo", validUntil: "Esta semana", fromPrice: "$600" },
  { id: "o3", title: "Pintura express", description: "Interiores de 1 habitación", validUntil: "Hasta fin de mes", fromPrice: "$1,200" }
];

export default function Home() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );

  // Rehidratar búsqueda (para futura API)
  useEffect(() => {
    (async () => {
      const saved = await getData<string>(StorageKeys.Client.SearchQuery);
      if (saved) setSearchQuery(saved);
    })();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    saveData(StorageKeys.Client.SearchQuery, query);
    // En el futuro: llamar API con query
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <HeaderNav
        userName="Carlos"
        location="Centro, Guayaquil"
        notificationCount={3}
        onNotificationClick={() => setShowNotifications(true)}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>Hola, Carlos 👋</Text>
          <Text style={styles.greetingSubtext}>
            ¿Qué servicio necesitas hoy?
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="¿Qué servicio necesitas hoy?"
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Hero / Carrusel simple */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          style={styles.heroCarousel}
          contentContainerStyle={{ gap: 12 }}
        >
          {[1, 2, 3].map(i => (
            <View key={i} style={styles.heroCard}>
              <Text style={styles.heroTitle}>Encuentra los mejores técnicos verificados</Text>
              <Text style={styles.heroSubtitle}>
                Servicio garantizado y profesionales certificados
              </Text>
              <TouchableOpacity
                style={styles.heroButton}
                onPress={() => navigation.navigate("Services" as never)}
              >
                <Text style={styles.heroButtonText}>Explorar ahora</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Categorías */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios Populares</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {categoriesMock.map(cat => {
              const selected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryChip, selected && styles.categoryChipSelected]}
                  onPress={() => {
                    setSelectedCategory(cat.id);
                    // Navegar a servicios (filtro simulado)
                    navigation.navigate("Services" as never);
                  }}
                >
                  <Text style={[styles.categoryIcon, selected && { color: "#FFF" }]}>{cat.icon}</Text>
                  <Text style={[styles.categoryText, selected && { color: "#FFF" }]}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Top técnicos del mes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Top técnicos del mes</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Services" as never)}>
              <Text style={styles.seeAllLink}>Ver todos →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {topTechniciansMock.map(t => (
              <View key={t.id} style={styles.techCard}>
                <View style={styles.techHeader}>
                  <View style={styles.techAvatar}>
                    <Text style={styles.techAvatarText}>{t.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.techInfo}>
                    <Text style={styles.techName}>{t.name}</Text>
                    <Text style={styles.techRole}>{t.specialty}</Text>
                    <View style={styles.techMetaRow}>
                      <Text style={styles.techMeta}>⭐ {t.rating}</Text>
                      <Text style={styles.techMeta}>• {t.distanceKm} km</Text>
                    </View>
                  </View>
                  <View style={[styles.onlineDot, { backgroundColor: t.isOnline ? colors.status.success : colors.text.light }]} />
                </View>
                <TouchableOpacity
                  style={styles.viewProfileBtn}
                  onPress={() => navigation.navigate("Services" as never)}
                >
                  <Text style={styles.viewProfileText}>👁️ Ver perfil</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Ofertas cerca de ti */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💸 Ofertas cerca de ti</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Services" as never)}>
              <Text style={styles.seeAllLink}>Ver más</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {offersMock.map(o => (
              <View key={o.id} style={styles.offerCard}>
                <View style={styles.offerHeader}>
                  <Text style={styles.offerTitle} numberOfLines={1}>{o.title}</Text>
                  {o.urgent && (
                    <View style={styles.urgentBadge}>
                      <Text style={styles.urgentText}>Urgente</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.offerDesc} numberOfLines={2}>{o.description}</Text>
                <View style={styles.offerFooter}>
                  <Text style={styles.offerValid}>⏱ {o.validUntil}</Text>
                  <Text style={styles.offerPrice}>Desde {o.fromPrice}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
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
    backgroundColor: colors.surface
  },
  content: {
    flex: 1,
    paddingHorizontal: 16
  },
  greetingSection: {
    marginTop: 24,
    marginBottom: 16
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4
  },
  greetingSubtext: {
    fontSize: 14,
    color: colors.text.secondary
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingRight: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.text.primary
  },
  filterButton: {
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  filterIcon: {
    fontSize: 18
  },
  // Hero
  heroCarousel: {
    marginBottom: 24
  },
  heroCard: {
    width: 320,
    backgroundColor: client.dark,
    borderRadius: 20,
    padding: 16
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6
  },
  heroSubtitle: {
    color: "#E5E7EB",
    fontSize: 12,
    marginBottom: 12
  },
  heroButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999
  },
  heroButtonText: {
    color: client.dark,
    fontWeight: "700"
  },
  // Secciones
  section: {
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary
  },
  seeAllLink: {
    fontSize: 12,
    color: client.primary,
    fontWeight: "700"
  },
  // Categorías
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  categoryChipSelected: {
    backgroundColor: client.primary,
    borderColor: client.primary
  },
  categoryIcon: {
    fontSize: 16,
    color: client.primary
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary
  },
  // Top técnicos
  techCard: {
    width: 260,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  techHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  techAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: client.light,
    justifyContent: "center",
    alignItems: "center"
  },
  techAvatarText: {
    color: client.dark,
    fontSize: 18,
    fontWeight: "800"
  },
  techInfo: {
    flex: 1
  },
  techName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary
  },
  techRole: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4
  },
  techMetaRow: {
    flexDirection: "row",
    gap: 6
  },
  techMeta: {
    fontSize: 11,
    color: colors.text.tertiary
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  viewProfileBtn: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center"
  },
  viewProfileText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary
  },
  // Ofertas
  offerCard: {
    width: 260,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text.primary,
    flex: 1,
    marginRight: 8
  },
  urgentBadge: {
    backgroundColor: colors.status.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  urgentText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800"
  },
  offerDesc: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 10
  },
  offerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  offerValid: {
    fontSize: 12,
    color: colors.text.tertiary
  },
  offerPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: client.primary
  }
});
