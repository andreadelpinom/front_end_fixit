import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList
} from "react-native";
import { TechnicianPerformanceScreenStyles as styles } from "../../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import HeaderNav from "../../components/HeaderNav";
import { GenericModal } from "../../components/GenericModal";


const performanceMetrics = [
  { id: "1", label: "Servicios Completados", value: "156", icon: "✓" },
  { id: "2", label: "Rating Promedio", value: "4.8", icon: "⭐" },
  { id: "3", label: "Clientes Satisfechos", value: "98%", icon: "😊" },
  { id: "4", label: "Tiempo Respuesta", value: "15 min", icon: "⏱️" }
];

const monthlyData = [
  { month: "Ene", services: 12, earnings: 1200 },
  { month: "Feb", services: 15, earnings: 1450 },
  { month: "Mar", services: 18, earnings: 1680 },
  { month: "Abr", services: 14, earnings: 1320 },
  { month: "May", services: 20, earnings: 1950 },
  { month: "Jun", services: 17, earnings: 1620 }
];

const recentServices = [
  {
    id: "1",
    client: "María González",
    service: "Reparación AC",
    date: "2024-03-15",
    rating: 5,
    amount: "$95"
  },
  {
    id: "2",
    client: "Juan Pérez",
    service: "Instalación eléctrica",
    date: "2024-03-14",
    rating: 4.8,
    amount: "$120"
  },
  {
    id: "3",
    client: "Ana López",
    service: "Reparación plomería",
    date: "2024-03-13",
    rating: 4.9,
    amount: "$85"
  }
];

function MetricSeparator() {
  return <View style={{ height: 12 }} />;
}

function RecentServiceSeparator({ color }: Readonly<{ color: string }>) {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: color,
        marginVertical: 8,
      }}
    />
  );
}

// Define this outside your component
const ItemSeparator = () => (
  <RecentServiceSeparator color={colors.border} />
);


export default function TechnicianPerformanceScreen() {
  const insets = useSafeAreaInsets();
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("earnings");

  const renderMetricCard = ({ item }: any) => (
    <View style={styles.metricCard}>
      <Text style={styles.metricIcon}>{item.icon}</Text>
      <Text style={styles.metricLabel}>{item.label}</Text>
      <Text style={styles.metricValue}>{item.value}</Text>
    </View>
  );

  const renderMonthData = ({ item }: any) => (
    <View style={styles.monthContainer}>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            {
              height: selectedMetric === "earnings"
                ? `${(item.earnings / 2000) * 100}%`
                : `${(item.services / 25) * 100}%`
            }
          ]}
        />
      </View>
      <Text style={styles.monthLabel}>{item.month}</Text>
      <Text style={styles.monthValue}>
        {selectedMetric === "earnings" ? `$${item.earnings}` : `${item.services}`}
      </Text>
    </View>
  );

  const renderRecentService = ({ item }: any) => (
    <View style={styles.serviceItem}>
      <View style={styles.serviceLeft}>
        <View style={styles.clientAvatar}>
          <Text style={styles.clientInitial}>
            {item.client.charAt(0)}
          </Text>
        </View>
        <View>
          <Text style={styles.serviceName}>{item.service}</Text>
          <Text style={styles.clientName}>{item.client}</Text>
          <Text style={styles.serviceDate}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.serviceRight}>
        <Text style={styles.serviceAmount}>{item.amount}</Text>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {item.rating}</Text>
        </View>
      </View>
    </View>
  );

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
          <Text style={styles.title}>Mi Desempeño</Text>
          <Text style={styles.subtitle}>
            Análisis de tus servicios y ganancias
          </Text>
        </View>

        {/* Key Metrics */}
        <FlatList
          data={performanceMetrics}
          renderItem={renderMetricCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          numColumns={2}
          columnWrapperStyle={styles.metricsGrid}
          ItemSeparatorComponent={MetricSeparator}
          scrollIndicatorInsets={{ right: 1 }}
        />


        {/* Chart Section */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>
              {selectedMetric === "earnings" ? "Ganancias" : "Servicios"} (Últimos 6 meses)
            </Text>
            <View style={styles.toggleButtons}>
              <TouchableOpacity
                onPress={() => setSelectedMetric("services")}
                style={[
                  styles.toggleButton,
                  selectedMetric === "services" && styles.toggleButtonActive
                ]}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    selectedMetric === "services" && styles.toggleButtonTextActive
                  ]}
                >
                  Servicios
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedMetric("earnings")}
                style={[
                  styles.toggleButton,
                  selectedMetric === "earnings" && styles.toggleButtonActive
                ]}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    selectedMetric === "earnings" && styles.toggleButtonTextActive
                  ]}
                >
                  Ganancias
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.chart}>
            <FlatList
              data={monthlyData}
              renderItem={renderMonthData}
              keyExtractor={(item) => item.month}
              scrollEnabled={false}
              numColumns={6}
              columnWrapperStyle={{ gap: 8, justifyContent: "space-between" }}
            />
          </View>
        </View>

        {/* Recent Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios Recientes</Text>
          <FlatList
            data={recentServices}
            renderItem={renderRecentService}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={ItemSeparator}
          />

        </View>

        {/* Stats Footer */}
        <View style={styles.statsFooter}>
          <View style={styles.statFooterItem}>
            <Text style={styles.statFooterLabel}>Ingresos Este Mes</Text>
            <Text style={styles.statFooterValue}>$4,320</Text>
          </View>
          <View style={styles.statFooterDivider} />
          <View style={styles.statFooterItem}>
            <Text style={styles.statFooterLabel}>Servicios Este Mes</Text>
            <Text style={styles.statFooterValue}>18</Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <GenericModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Notifications"
        content={<Text>You have new notifications!</Text>}
      />
    </View>
  );
}
