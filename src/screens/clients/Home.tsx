import { useState } from "react";
import { Text, View, ScrollView, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import HeaderNav from "../../components/HeaderNav";
import { SERVICE_CATEGORIES, TOP_TECHNICIANS, OFFERS } from "../DummyData";
import { CategoryChip, HeroSlide, TechnicianCard, OfferCard } from "../../components/HomeComponents";
import { useSearchQuery } from "../../hooks/useSearchQuery";
import { HomeStyles as styles } from "../../styles";
import { GenericModal } from "../../components/GenericModal";

export default function Home() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useSearchQuery();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

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
        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="¿Qué servicio necesitas hoy?"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Hero */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled contentContainerStyle={{ gap: 12 }}>
          {[1, 2, 3].map(i => <HeroSlide key={i} />)}
        </ScrollView>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {SERVICE_CATEGORIES.map(cat => (
            <CategoryChip
              key={cat.id}
              category={cat}
              selected={selectedCategory === cat.id}
              onPress={id => {
                setSelectedCategory(id);
                navigation.navigate("Services" as never);
              }}
            />
          ))}
        </ScrollView>

        {/* Top Technicians */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {TOP_TECHNICIANS.map(t => (
            <TechnicianCard key={t.id} tech={t} onPress={() => navigation.navigate("Services" as never)} />
          ))}
        </ScrollView>

        {/* Offers */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {OFFERS.map(o => <OfferCard key={o.id} offer={o} />)}
        </ScrollView>

        <View style={{ height: 20 }} />
      </ScrollView>

      <GenericModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Notificaciones"
        content={<ScrollView style={{ maxHeight: 300 }}><Text>🔔 Tienes 3 nuevas notificaciones.</Text></ScrollView>}
      />
    </View>
  );
}
