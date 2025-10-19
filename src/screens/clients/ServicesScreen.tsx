import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, client } from "../../theme/colors";
import HeaderNav from "../../components/HeaderNav";
import NotificationsModal from "../../components/NotificationModal";

// Tipos simulados
type Status = "Finalizado" | "Cancelado" | "En progreso";

interface FavoriteTechnician {
  id: string;
  name: string;
  specialty: "Electricidad" | "Plomería" | string;
  rating: number;
  jobs: number;
}

interface ServiceHistoryItem {
  id: string;
  title: string; // "Electricidad - Reparación"
  code: string; // REQ-ABC123
  status: Status;
  date: string; // 14/1/2024
}

interface FrequentService {
  id: string;
  title: string; // "Electricidad - Reparación"
  times: number; // 3
  lastDate: string; // 14/1/2024
  icon: string; // emoji temporal
}

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

          {historyItems.map(h => (
            <View key={h.id} style={styles.historyItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyTitle}>{h.title}</Text>
                <Text style={styles.historyCode}>{h.code}</Text>
                <View style={styles.historyMetaRow}>
                  <View style={[styles.statusBadge, statusStyle(h.status)]}>
                    <Text style={[styles.statusText, statusTextStyle(h.status)]}>
                      {h.status === "Finalizado" ? "✔" : h.status === "Cancelado" ? "✖" : "•"} {h.status}
                    </Text>
                  </View>
                  <View style={styles.datePill}>
                    <Text style={styles.dateText}>📅 {h.date}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => goToRequestDetail(h)}>
                <Text style={styles.eyeIcon}>�️</Text>
              </TouchableOpacity>
            </View>
          ))}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface
  },
  content: {
    flex: 1,
    paddingHorizontal: 16
  },
  titleSection: {
    marginTop: 24,
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text.primary,
    marginBottom: 4
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.secondary
  },
  // Section container card
  cardSection: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  sectionEmoji: {
    fontSize: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text.primary
  },
  // Favorite techs
  favoriteCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    marginTop: 8
  },
  favoriteLeft: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    flex: 1
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: client.light,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    fontSize: 20
  },
  techName: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text.primary
  },
  techSpecialty: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4
  },
  stars: {
    fontSize: 12
  },
  ratingNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.primary
  },
  jobsText: {
    fontSize: 11,
    color: colors.text.tertiary,
    marginTop: 2
  },
  primaryPill: {
    backgroundColor: client.dark,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999
  },
  primaryPillText: {
    color: "#fff",
    fontWeight: "800"
  },
  // History list
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginTop: 8
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text.primary,
    marginBottom: 2
  },
  historyCode: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8
  },
  historyMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800"
  },
  datePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border
  },
  dateText: {
    fontSize: 12,
    color: colors.text.secondary
  },
  eyeIcon: {
    fontSize: 18,
    color: colors.text.tertiary
  },
  // Frequent services
  frequentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginTop: 8
  },
  frequentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1
  },
  frequentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border
  },
  frequentIcon: {
    fontSize: 16
  },
  frequentTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text.primary
  },
  frequentMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2
  },
  frequentMeta: {
    fontSize: 12,
    color: colors.text.secondary
  },
  secondaryPill: {
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: client.primary
  },
  secondaryPillText: {
    color: client.primary,
    fontWeight: "800"
  }
});

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
