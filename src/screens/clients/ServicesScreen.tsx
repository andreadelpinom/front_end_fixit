import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ServicesScreenStyles as styles } from "../../styles";
import { colors, client } from "../../theme/colors";
import HeaderNav from "../../components/HeaderNav";
import NotificationsModal from "../../components/NotificationModal";
import { FavoriteTechnician, FrequentService, ServiceHistoryItem } from "../../interface";
import { Status } from "../../types";

const favoriteTechnicians: FavoriteTechnician[] = [
  { id: "t1", name: "Carlos Mendoza", specialty: "Electricidad", rating: 4.8, jobs: 127 },
  { id: "t2", name: "Ana Rodriguez", specialty: "Plomería", rating: 4.9, jobs: 89 }
];

const historyItems: ServiceHistoryItem[] = [
  { id: "h1", title: "Electricidad - Reparación", code: "REQ-ABC123", status: "Finalizado", date: "14/1/2024" },
  { id: "h2", title: "Plomería - Instalación", code: "REQ-DEF456", status: "Cancelado", date: "9/1/2024" },
  { id: "h3", title: "Pintura - Mantenimiento", code: "REQ-GHI789", status: "Finalizado", date: "4/1/2024" }
];

const frequentServices: FrequentService[] = [
  { id: "f1", title: "Electricidad - Reparación", times: 3, lastDate: "14/1/2024", icon: "⚡" },
  { id: "f2", title: "Plomería - Instalación", times: 2, lastDate: "9/1/2024", icon: "�" }
];

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [showNotifications, setShowNotifications] = useState(false);

  const goToCreateService = () => (navigation as any).navigate("CreateService");
  const goToRequestDetail = (item: ServiceHistoryItem) =>
    (navigation as any).navigate("RequestDetail", { requestId: item.id });

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

        {/* Técnicos favoritos */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionEmoji}>💗</Text>
              <Text style={styles.sectionTitle}>Técnicos favoritos</Text>
            </View>
          </View>

          {favoriteTechnicians.map(t => (
            <View key={t.id} style={styles.favoriteCard}>
              <View style={styles.favoriteLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>👤</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.techName}>{t.name}</Text>
                  <Text style={styles.techSpecialty}>
                    {t.specialty === "Electricidad" ? "⚡" : "💧"}  {t.specialty}
                  </Text>
                  <View style={styles.ratingRow}>
                    <Text style={styles.stars}>⭐ ⭐ ⭐ ⭐</Text>
                    <Text style={styles.ratingNumber}>{t.rating.toFixed(1)}</Text>
                  </View>
                  <Text style={styles.jobsText}>{t.jobs} trabajos</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.primaryPill} onPress={goToCreateService}>
                <Text style={styles.primaryPillText}>Solicitar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Historial de servicios */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionEmoji, { color: client.primary }]}>📄</Text>
              <Text style={styles.sectionTitle}>Historial de servicios</Text>
            </View>
          </View>

          {historyItems.map(h => {
            // Extraer icono de estado
            let statusIcon: string;
            if (h.status === "Finalizado") {
              statusIcon = "✔";
            } else if (h.status === "Cancelado") {
              statusIcon = "✖";
            } else {
              statusIcon = "•";
            }

            return (
              <View key={h.id} style={styles.historyItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyTitle}>{h.title}</Text>
                  <Text style={styles.historyCode}>{h.code}</Text>
                  <View style={styles.historyMetaRow}>
                    <View style={[styles.statusBadge, statusStyle(h.status)]}>
                      <Text style={[styles.statusText, statusTextStyle(h.status)]}>
                        {statusIcon} {h.status}
                      </Text>
                    </View>
                    <View style={styles.datePill}>
                      <Text style={styles.dateText}>📅 {h.date}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity onPress={() => goToRequestDetail(h)}>
                  <Text style={styles.eyeIcon}>👁️</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Servicios frecuentes */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionEmoji, { color: colors.status.success }]}>🌀</Text>
              <Text style={styles.sectionTitle}>Servicios frecuentes</Text>
            </View>
          </View>

          {frequentServices.map(f => (
            <View key={f.id} style={styles.frequentItem}>
              <View style={styles.frequentLeft}>
                <View style={styles.frequentIconWrap}><Text style={styles.frequentIcon}>{f.icon}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.frequentTitle} numberOfLines={1}>{f.title}</Text>
                  <View style={styles.frequentMetaRow}>
                    <Text style={styles.frequentMeta}>{f.times} veces</Text>
                    <Text style={styles.frequentMeta}>• {f.lastDate}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.secondaryPill} onPress={goToCreateService}>
                <Text style={styles.secondaryPillText}>Solicitar</Text>
              </TouchableOpacity>
            </View>
          ))}
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

// Helpers para estilos de estado
function statusStyle(status: Status) {
  switch (status) {
    case "Finalizado":
      return { backgroundColor: "#ECFDF5", borderColor: "#10B981" };
    case "Cancelado":
      return { backgroundColor: "#FEF2F2", borderColor: "#EF4444" };
    default:
      return { backgroundColor: colors.surface, borderColor: colors.border };
  }
}

function statusTextStyle(status: Status) {
  switch (status) {
    case "Finalizado":
      return { color: "#065F46" };
    case "Cancelado":
      return { color: "#991B1B" };
    default:
      return { color: colors.text.secondary };
  }
}
