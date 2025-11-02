import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TechnicianPerformanceScreenStyles as styles } from "../../styles";
import { colors } from "../../theme/colors";
import HeaderNav from "../../components/HeaderNav";
import { GenericModal } from "../../components/GenericModal";
import { MetricSeparator, RecentServiceSeparator } from "../../helpers";
import { MONTHLY_DATA, PERFORMANCE_METRICS, REQUESTS } from "../DummyData";

// ===== TYPES =====
type MetricType = "earnings" | "services";

interface MetricItem {
  id: string;
  icon: string;
  label: string;
  value: string;
}

interface MonthItem {
  month: string;
  earnings: number;
  services: number;
}

interface ServiceItem {
  id: string;
  client: string;
  tituloProblema: string;
  fechaProgramada?: string; // ✅ made optional to match RequestDetail
  clientRating: number;
}

// ===== UTILITIES =====
const getBarHeight = (value: number, max: number): number =>
  (value / max) * 100; // ✅ numeric return for proper RN DimensionValue

const formatMetricValue = (
  selectedMetric: MetricType,
  item: MonthItem
): string =>
  selectedMetric === "earnings" ? `$${item.earnings}` : `${item.services}`;

// ===== RENDER FUNCTIONS =====
const renderMetricCard = ({ item }: { item: MetricItem }) => (
  <View style={styles.metricCard}>
    <Text style={styles.metricIcon}>{item.icon}</Text>
    <Text style={styles.metricLabel}>{item.label}</Text>
    <Text style={styles.metricValue}>{item.value}</Text>
  </View>
);

const renderMonthData = (selectedMetric: MetricType, item: MonthItem) => {
  const maxValues = { earnings: 2000, services: 25 };
  const value = selectedMetric === "earnings" ? item.earnings : item.services;
  const height = getBarHeight(value, maxValues[selectedMetric]);

  return (
    <View style={styles.monthContainer}>
      <View style={styles.barContainer}>
        {/* ✅ Fixed type error by casting height to a valid DimensionValue */}
        <View style={[styles.bar, { height: `${height}%` as any }]} />
      </View>
      <Text style={styles.monthLabel}>{item.month}</Text>
      <Text style={styles.monthValue}>
        {formatMetricValue(selectedMetric, item)}
      </Text>
    </View>
  );
};

const renderRecentService = ({ item }: { item: ServiceItem }) => (
  <View style={styles.serviceItem}>
    <View style={styles.serviceLeft}>
      <View style={styles.clientAvatar}>
        <Text style={styles.clientInitial}>{item.client.charAt(0)}</Text>
      </View>
      <View>
        <Text style={styles.serviceName}>{item.tituloProblema}</Text>
        <Text style={styles.clientName}>{item.client}</Text>
        <Text style={styles.serviceDate}>
          {item.fechaProgramada || "Sin fecha"}
        </Text>
      </View>
    </View>
    <View style={styles.serviceRight}>
      <Text style={styles.serviceAmount}>$25</Text>
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>⭐ {item.clientRating}</Text>
      </View>
    </View>
  </View>
);

const renderRecentServiceSeparator = () => (
  <RecentServiceSeparator color={colors.border} />
);

// ===== COMPONENTS =====
interface TitleSectionProps {
  title: string;
  subtitle: string;
}

const TitleSection = ({ title, subtitle }: TitleSectionProps) => (
  <View style={styles.titleSection}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

interface ToggleButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const ToggleButton = ({ label, isActive, onPress }: ToggleButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.toggleButton, isActive && styles.toggleButtonActive]}
  >
    <Text
      style={[
        styles.toggleButtonText,
        isActive && styles.toggleButtonTextActive,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

interface ChartHeaderProps {
  selectedMetric: MetricType;
  onMetricChange: (metric: MetricType) => void;
}

const ChartHeader = ({ selectedMetric, onMetricChange }: ChartHeaderProps) => (
  <View style={styles.chartHeader}>
    <Text style={styles.chartTitle}>
      {selectedMetric === "earnings" ? "Ganancias" : "Servicios"} (Últimos 6
      meses)
    </Text>
    <View style={styles.toggleButtons}>
      <ToggleButton
        label="Servicios"
        isActive={selectedMetric === "services"}
        onPress={() => onMetricChange("services")}
      />
      <ToggleButton
        label="Ganancias"
        isActive={selectedMetric === "earnings"}
        onPress={() => onMetricChange("earnings")}
      />
    </View>
  </View>
);

interface StatsFooterProps {
  monthlyIncome: string;
  monthlyServices: number;
}

const StatsFooter = ({ monthlyIncome, monthlyServices }: StatsFooterProps) => (
  <View style={styles.statsFooter}>
    <View style={styles.statFooterItem}>
      <Text style={styles.statFooterLabel}>Ingresos Este Mes</Text>
      <Text style={styles.statFooterValue}>{monthlyIncome}</Text>
    </View>
    <View style={styles.statFooterDivider} />
    <View style={styles.statFooterItem}>
      <Text style={styles.statFooterLabel}>Servicios Este Mes</Text>
      <Text style={styles.statFooterValue}>{monthlyServices}</Text>
    </View>
  </View>
);

// ===== MAIN COMPONENT =====
export default function TechnicianPerformanceScreen() {
  const insets = useSafeAreaInsets();
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("earnings");

  const renderMonth = useCallback(
    ({ item }: { item: MonthItem }) => renderMonthData(selectedMetric, item),
    [selectedMetric]
  );

  const recentServices: ServiceItem[] = REQUESTS.slice(0, 3) as ServiceItem[];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <HeaderNav
        userName="Carlos"
        location="Centro, Guayaquil"
        notificationCount={1}
        onNotificationClick={() => setShowNotifications(true)}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TitleSection
          title="Mi Desempeño"
          subtitle="Análisis de tus servicios y ganancias"
        />

        <FlatList
          data={PERFORMANCE_METRICS}
          renderItem={renderMetricCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          numColumns={2}
          columnWrapperStyle={styles.metricsGrid}
          ItemSeparatorComponent={MetricSeparator}
        />

        <View style={styles.chartSection}>
          <ChartHeader
            selectedMetric={selectedMetric}
            onMetricChange={setSelectedMetric}
          />

          <View style={styles.chart}>
            <FlatList
              data={MONTHLY_DATA}
              renderItem={renderMonth}
              keyExtractor={(item) => item.month}
              scrollEnabled={false}
              numColumns={6}
              columnWrapperStyle={{ gap: 8, justifyContent: "space-between" }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios Recientes</Text>
          <FlatList
            data={recentServices}
            renderItem={renderRecentService}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={renderRecentServiceSeparator}
          />
        </View>

        <StatsFooter monthlyIncome="$4,320" monthlyServices={18} />

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
