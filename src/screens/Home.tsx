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
import { colors } from "../theme/colors";
import HeaderNav from "../components/HeaderNav";
import NotificationsModal from "../components/NotificationModal";

const coursesData = [
  {
    id: "1",
    title: "Electricidad Residencial",
    subtitle: "Nivel básico",
    duration: "8 horas",
    rating: 4.8,
    price: "$49",
    originalPrice: "$89",
    category: "electricidad",
    level: "básico"
  },
  {
    id: "2",
    title: "Plomería Avanzada",
    subtitle: "Certificación",
    duration: "12 horas",
    rating: 4.9,
    price: "$69",
    originalPrice: "$120",
    category: "plomería",
    level: "avanzado"
  },
  {
    id: "3",
    title: "Carpintería Moderna",
    subtitle: "Técnicas nuevas",
    duration: "16 horas",
    rating: 4.7,
    price: "$79",
    originalPrice: "$140",
    category: "carpintería",
    level: "intermedio"
  },
  {
    id: "4",
    title: "Instalación Básica",
    subtitle: "Módulo inicial",
    duration: "6 horas",
    rating: 4.6,
    price: "Gratis",
    originalPrice: "$45",
    category: "instalación",
    level: "básico",
    type: "beca"
  }
];

const servicesData = [
  {
    id: "1",
    name: "María González",
    status: "En progreso",
    progress: 65,
    date: "Hoy, 14:30"
  },
  {
    id: "2",
    name: "Juan Pérez",
    status: "Completado",
    progress: 100,
    date: "Ayer"
  },
  {
    id: "3",
    name: "Carlos López",
    status: "En progreso",
    progress: 40,
    date: "Hoy, 10:00"
  }
];

export default function Home() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState(coursesData);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredCourses(coursesData);
      return;
    }

    const filtered = coursesData.filter(course =>
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      course.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const renderCourseCard = ({ item }: any) => (
    <View style={styles.courseCard}>
      <View style={styles.courseHeader}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        {item.type === "beca" && (
          <View style={styles.becaBadge}>
            <Text style={styles.becaText}>BECA</Text>
          </View>
        )}
      </View>
      <Text style={styles.courseSubtitle}>{item.subtitle}</Text>
      <View style={styles.courseDetails}>
        <Text style={styles.duration}>⏱ {item.duration}</Text>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
      </View>
      <View style={styles.courseFooter}>
        <Text style={styles.price}>{item.price}</Text>
        <TouchableOpacity style={styles.enrollButton}>
          <Text style={styles.enrollButtonText}>Inscribirse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderServiceCard = ({ item }: any) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceAvatar}>
        <Text style={styles.avatarInitial}>
          {item.name.charAt(0)}
        </Text>
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDate}>{item.date}</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${item.progress}%` }
            ]}
          />
        </View>
      </View>
      <View style={styles.serviceStatus}>
        <Text
          style={[
            styles.statusText,
            {
              color:
                item.progress === 100
                  ? colors.status.success
                  : colors.primary
            }
          ]}
        >
          {item.status}
        </Text>
      </View>
    </View>
  );

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
            Encuentra los mejores cursos para ti
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cursos..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Promociones Banner */}
        <View style={styles.promoBanner}>
          <View>
            <Text style={styles.promoTitle}>Becas y promociones activas</Text>
            <Text style={styles.promoSubtitle}>
              Acceso a cursos premium con descuento
            </Text>
          </View>
          <TouchableOpacity style={styles.promoButton}>
            <Text style={styles.promoButtonText}>Ver ofertas →</Text>
          </TouchableOpacity>
        </View>

        {/* Cursos disponibles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cursos disponibles para ti</Text>
          <FlatList
            data={filteredCourses}
            renderItem={renderCourseCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        </View>

        {/* Tus servicios */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tus servicios en curso</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>Ver todos →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={servicesData}
            renderItem={renderServiceCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        </View>

        {/* Solicitudes cercanas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Solicitudes cercanas</Text>
          <TouchableOpacity style={styles.requestCard}>
            <View style={styles.requestContent}>
              <View>
                <Text style={styles.requestTitle}>Reparación de lavadora</Text>
                <Text style={styles.requestDetails}>
                  Centro, Guayaquil • Hoy, 16:00
                </Text>
              </View>
            </View>
            <View style={styles.requestPrice}>
              <Text style={styles.priceAmount}>$85</Text>
              <Text style={styles.priceLabel}>precio</Text>
            </View>
          </TouchableOpacity>
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
  greetingSection: {
    marginTop: 24,
    marginBottom: 24
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
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingRight: 12
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
  promoBanner: {
    backgroundColor: colors.glass.background,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.glass.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4
  },
  promoSubtitle: {
    fontSize: 12,
    color: colors.text.secondary
  },
  promoButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8
  },
  promoButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600"
  },
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
    color: colors.primary,
    fontWeight: "600"
  },
  courseCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
    flex: 1
  },
  becaBadge: {
    backgroundColor: colors.status.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  becaText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700"
  },
  courseSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 12
  },
  courseDetails: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12
  },
  duration: {
    fontSize: 12,
    color: colors.text.tertiary
  },
  rating: {
    fontSize: 12,
    color: colors.text.tertiary
  },
  courseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary
  },
  enrollButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  enrollButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600"
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    gap: 12
  },
  serviceAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center"
  },
  avatarInitial: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700"
  },
  serviceInfo: {
    flex: 1
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 2
  },
  serviceDate: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 6
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3
  },
  serviceStatus: {
    alignItems: "flex-end"
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600"
  },
  requestCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  requestContent: {
    flex: 1
  },
  requestTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4
  },
  requestDetails: {
    fontSize: 12,
    color: colors.text.secondary
  },
  requestPrice: {
    alignItems: "flex-end"
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary
  },
  priceLabel: {
    fontSize: 10,
    color: colors.text.tertiary
  }
});
