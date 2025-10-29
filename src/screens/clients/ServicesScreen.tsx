import React, { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import HeaderNav from "../../components/HeaderNav";
import { GenericModal } from "../../components/GenericModal";
import { FavoriteTechCard, HistoryItemCard, FrequentServiceCard } from "../../components/ServiceCards";
import { favoriteTechnicians, historyItems, frequentServices } from "../DummyData";
import { ServicesScreenStyles as styles } from "../../styles";
import { colors } from "../../theme/colors";

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [showNotifications, setShowNotifications] = useState(false);

  const goToCreateService = () => (navigation as any).navigate("CreateService");
  const goToRequestDetail = (item: any) => (navigation as any).navigate("RequestDetail", { requestId: item.id });

  const renderSection = (title: string, emoji: string, children: React.ReactNode) => (
    <View style={styles.cardSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionEmoji, { color: colors.status.success }]}>{emoji}</Text>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      </View>
      {children}
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
          <Text style={styles.title}>Mis servicios</Text>
          <Text style={styles.subtitle}>Gestiona tus técnicos favoritos y servicios frecuentes</Text>
        </View>

        {renderSection("Técnicos favoritos", "💗", favoriteTechnicians.map(t => (
          <FavoriteTechCard key={t.id} tech={t} onPress={goToCreateService} />
        )))}

        {renderSection("Historial de servicios", "📄", historyItems.map(h => (
          <HistoryItemCard key={h.id} item={h} onPress={() => goToRequestDetail(h)} />
        )))}

        {renderSection("Servicios frecuentes", "🌀", frequentServices.map(f => (
          <FrequentServiceCard key={f.id} service={f} onPress={goToCreateService} />
        )))}

        <View style={{ height: 20 }} />
      </ScrollView>

      <GenericModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Notificaciones"
        content={
          <ScrollView style={{ maxHeight: 300 }}>
            <Text>🔔 Tienes 2 nuevas notificaciones.</Text>
            <Text>✅ Servicio completado</Text>
            <Text>📅 Recordatorio: Solicitud pendiente</Text>
          </ScrollView>
        }
      />
    </View>
  );
}
