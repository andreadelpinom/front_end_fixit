import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import HeaderNav from "../../components/HeaderNav";
import NotificationsModal from "../../components/NotificationModal";
import { getData, saveData, StorageKeys } from "../../shared/storage";
import { Category, OfferCard, TechnicianCard } from "../../interface";
import { HomeStyles as styles } from "../../styles";

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
        role="client"
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
