import { useState } from "react";
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

const servicesData = [
  {
    id: "1",
    title: "Reparación de aire acondicionado",
    description: "Limpieza y mantenimiento general",
    price: "$95",
    rating: 4.9,
    reviews: 156,
    category: "Climatización",
    duration: "2-3 horas",
    image: "🌬️"
  },
  {
    id: "2",
    title: "Instalación de interruptores",
    description: "Nuevos interruptores y tomacorrientes",
    price: "$45",
    rating: 4.8,
    reviews: 89,
    category: "Electricidad",
    duration: "1 hora",
    image: "⚡"
  },
  {
    id: "3",
    title: "Reparación de tuberías",
    description: "Fugas y goteos",
    price: "$75",
    rating: 4.7,
    reviews: 234,
    category: "Plomería",
    duration: "1-2 horas",
    image: "🔧"
  },
  {
    id: "4",
    title: "Carpintería general",
    description: "Puertas, marcos y muebles",
    price: "$120",
    rating: 4.6,
    reviews: 112,
    category: "Carpintería",
    duration: "3-4 horas",
    image: "🪚"
  },
  {
    id: "5",
    title: "Limpieza profunda",
    description: "Hogar completo o áreas específicas",
    price: "$65",
    rating: 4.8,
    reviews: 445,
    category: "Limpieza",
    duration: "2-3 horas",
    image: "🧹"
  },
  {
    id: "6",
    title: "Reparación de puertas",
    description: "Cerraduras y bisagras",
    price: "$55",
    rating: 4.5,
    reviews: 78,
    category: "Carpintería",
    duration: "1-2 horas",
    image: "🚪"
  }
];

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showNotifications, setShowNotifications] = useState(false);

  const categories = ["Todos", "Electricidad", "Plomería", "Carpintería", "Climatización", "Limpieza"];

  const filteredServices = servicesData.filter(service => {
    const matchesSearch = service.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      service.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderServiceCard = ({ item }: any) => (
    <TouchableOpacity style={styles.serviceCard}>
      <View style={styles.serviceImageContainer}>
        <Text style={styles.serviceImage}>{item.image}</Text>
      </View>
      <View style={styles.serviceContent}>
        <View>
          <Text style={styles.serviceCategory}>{item.category}</Text>
          <Text style={styles.serviceTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.serviceDescription} numberOfLines={1}>
            {item.description}
          </Text>
        </View>
        <View style={styles.serviceFooter}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviews})</Text>
          </View>
          <Text style={styles.duration}>⏱ {item.duration}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCategoryButton = (category: string) => (
    <TouchableOpacity
      key={category}
      onPress={() => setSelectedCategory(category)}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.categoryButtonActive
      ]}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === category && styles.categoryButtonTextActive
        ]}
      >
        {category}
      </Text>
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
          <Text style={styles.title}>Mis Servicios</Text>
          <Text style={styles.subtitle}>
            Explore nuestras ofertas disponibles
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar servicios..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {categories.map(renderCategoryButton)}
          </ScrollView>
        </View>

        {/* Services List */}
        {filteredServices.length > 0 ? (
          <FlatList
            data={filteredServices}
            renderItem={renderServiceCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={styles.servicesList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No se encontraron servicios</Text>
          </View>
        )}

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
    marginTop: 24,
    marginBottom: 20
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
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
  categoriesContainer: {
    marginBottom: 16
  },
  categoriesList: {
    paddingRight: 16,
    gap: 8
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.secondary
  },
  categoryButtonTextActive: {
    color: "#FFFFFF"
  },
  servicesList: {
    gap: 12
  },
  serviceCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  serviceImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.borderLight,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0
  },
  serviceImage: {
    fontSize: 28
  },
  serviceContent: {
    flex: 1,
    justifyContent: "space-between"
  },
  serviceCategory: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 2
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 2
  },
  serviceDescription: {
    fontSize: 11,
    color: colors.text.secondary,
    marginBottom: 6
  },
  serviceFooter: {
    gap: 2
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2
  },
  rating: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text.primary
  },
  reviewCount: {
    fontSize: 10,
    color: colors.text.tertiary
  },
  duration: {
    fontSize: 10,
    color: colors.text.tertiary
  },
  price: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24
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
  }
});
