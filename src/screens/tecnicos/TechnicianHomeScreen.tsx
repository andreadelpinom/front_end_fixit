import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

import { TechnicianHomeScreenStyles as styles } from "../../styles";
import HeaderNav from "../../components/HeaderNav";
import { GenericModal } from "../../components/GenericModal";
import { TecnicoStackParamList, TecnicoTabParamList } from "../../types";
import {
  CERTIFICATIONS,
  OFFERS,
  SERVICE_CATEGORIES,
  REQUESTS,
} from "../DummyData";

// ===== TYPES =====
type NavigationType = NativeStackNavigationProp<TecnicoStackParamList> &
  BottomTabNavigationProp<TecnicoTabParamList>;

type RoleType = "tecnico" | "client";

// ===== UTILITIES =====
const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    Finalizado: "#2ecc71",
    "En progreso": "#3498db",
    Cancelado: "#e74c3c",
  };
  return statusColors[status] || "#999";
};

// ===== COMPONENTS =====
interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </>
);

interface CourseCardProps {
  course: typeof CERTIFICATIONS[0];
  onPress: () => void;
}

const CourseCard = ({ course, onPress }: CourseCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.cardTitle}>
      {course.icon} {course.name}
    </Text>
    <Text style={styles.cardDesc}>Emitido por: {course.issuer}</Text>
    <Text style={styles.cardDesc}>Estado: {course.status}</Text>
  </TouchableOpacity>
);

interface PromoCardProps {
  promo: typeof OFFERS[0];
}

const PromoCard = ({ promo }: PromoCardProps) => (
  <View style={styles.promoCard}>
    <Text style={styles.promoTitle}>
      {promo.title} {promo.urgent ? "🔥" : ""}
    </Text>
    <Text style={styles.promoDesc}>{promo.description}</Text>
    <Text style={styles.promoDesc}>
      Desde {promo.fromPrice} — {promo.validUntil}
    </Text>
  </View>
);

interface ServiceCardProps {
  service: typeof SERVICE_CATEGORIES[0];
  onPress: () => void;
}

const ServiceCard = ({ service, onPress }: ServiceCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.cardTitle}>
      {service.icon} {service.label}
    </Text>
    <Text style={styles.cardDesc}>{service.description}</Text>
  </TouchableOpacity>
);

interface RequestCardProps {
  request: typeof REQUESTS[0];
  statusColor: string;
}

const RequestCard = ({ request, statusColor }: RequestCardProps) => (
  <View style={styles.requestCard}>
    <Text style={styles.requestClient}>{request.client}</Text>
    <Text style={styles.requestService}>{request.tituloProblema}</Text>
    <Text style={[styles.requestStatus, { color: statusColor }]}>
      {request.status}
    </Text>
  </View>
);

// ===== MAIN COMPONENT =====
export const TechnicianHomeScreen = () => {
  const navigation = useNavigation<NavigationType>();
  const [showNotifications, setShowNotifications] = useState(false);
  const [role, setRole] = useState<RoleType>("tecnico");

  const handleProfileClick = () => {
    setRole((prev) => (prev === "tecnico" ? "client" : "tecnico"));
  };

  const handleNavigateToCertifications = () => {
    navigation.navigate("Certifications");
  };

  const handleNavigateToPerformance = () => {
    navigation.navigate("Performance");
  };

  const recentRequests = REQUESTS.slice(0, 3);

  return (
    <View style={styles.container}>
      <HeaderNav
        userName="Carlos"
        location="Centro, Guayaquil"
        notificationCount={2}
        showProfilePhoto={true}
        onNotificationClick={() => setShowNotifications(true)}
        onProfileClick={handleProfileClick}
        role={role}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Section title="Cursos y Certificaciones">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {CERTIFICATIONS.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onPress={handleNavigateToCertifications}
              />
            ))}
          </ScrollView>
        </Section>

        <Section title="Promociones y Ofertas">
          <View style={styles.promosContainer}>
            {OFFERS.map((promo) => (
              <PromoCard key={promo.id} promo={promo} />
            ))}
          </View>
        </Section>

        <Section title="Servicios Destacados">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {SERVICE_CATEGORIES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={handleNavigateToPerformance}
              />
            ))}
          </ScrollView>
        </Section>

        <Section title="Solicitudes Recientes">
          <View style={styles.requestsContainer}>
            {recentRequests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                statusColor={getStatusColor(req.status)}
              />
            ))}
          </View>
        </Section>
      </ScrollView>

      <GenericModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Notificaciones"
        content={<Text>Tienes nuevas notificaciones 📬</Text>}
      />
    </View>
  );
};
