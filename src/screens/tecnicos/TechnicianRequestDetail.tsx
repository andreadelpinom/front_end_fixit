import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import AcceptRequestFlow from "../../components/AcceptRequestFlow";

export default function TechnicianRequestDetail({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [showAcceptFlow, setShowAcceptFlow] = useState(false);

  // TODO: En el futuro, usar route.params.requestId para obtener la solicitud real de la API
  const request = {
    id: "REQ-001",
    title: "Electricidad - Instalación de interruptores",
    description: "Instalar nuevos interruptores y tomacorrientes en la sala y cocina",
    client: "María González",
    clientPhone: "+593 9 8765 4321",
    clientRating: 4.9,
    clientReviews: 234,
    date: "2024-03-15",
    time: "14:30",
    location: "Centro, Guayaquil",
    address: "Calle Principal #123, Apto 4B",
    price: 85,
    urgency: "Normal",
    status: "Publicado",
    isNew: true,
    category: "Electricidad",
    details: [
      "Instalar 3 interruptores de pared",
      "Instalar 4 tomacorrientes",
      "Verificar circuitos existentes",
      "Pintura de acabado"
    ],
    requirements: [
      "Experiencia en instalación eléctrica",
      "Certificación vigente",
      "Herramientas propias"
    ]
  };

  const handleAccept = () => {
    setShowAcceptFlow(true);
  };

  const handleCallClient = () => {
    // TODO: Implementar llamada telefónica
    console.log("Llamar a:", request.clientPhone);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <View style={[styles.header, { marginTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Atrás</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles de Solicitud</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Status Badge */}
        {request.isNew && (
          <View style={styles.newBadgeContainer}>
            <Text style={styles.newBadge}>✨ Nueva Oportunidad</Text>
          </View>
        )}

        {/* Service Title */}
        <Text style={styles.title}>{request.title}</Text>

        {/* Client Info */}
        <View style={styles.clientCard}>
          <View style={styles.clientAvatar}>
            <Text style={styles.clientInitial}>
              {request.client.charAt(0)}
            </Text>
          </View>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>{request.client}</Text>
            <View style={styles.clientRating}>
              <Text style={styles.rating}>⭐ {request.clientRating}</Text>
              <Text style={styles.reviews}>({request.clientReviews} reseñas)</Text>
            </View>
            <Text style={styles.phone}>{request.clientPhone}</Text>
          </View>
          <TouchableOpacity style={styles.chatButton}>
            <Text style={styles.chatButtonText}>💬</Text>
          </TouchableOpacity>
        </View>

        {/* Location Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Ubicación</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Dirección</Text>
            <Text style={styles.infoValue}>{request.address}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Zona</Text>
            <Text style={styles.infoValue}>{request.location}</Text>
          </View>
        </View>

        {/* Schedule Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Fecha y Hora</Text>
          <View style={styles.scheduleGrid}>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleLabel}>Fecha</Text>
              <Text style={styles.scheduleValue}>{request.date}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleLabel}>Hora</Text>
              <Text style={styles.scheduleValue}>{request.time}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleLabel}>Prioridad</Text>
              <Text
                style={[
                  styles.scheduleValue,
                  {
                    color:
                      request.urgency === "Urgente"
                        ? colors.status.error
                        : colors.text.primary
                  }
                ]}
              >
                {request.urgency}
              </Text>
            </View>
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Detalles del Servicio</Text>
          <Text style={styles.description}>{request.description}</Text>
          <View style={styles.detailsList}>
            {request.details.map((detail, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailBullet}>✓</Text>
                <Text style={styles.detailText}>{detail}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✓ Requisitos</Text>
          <View style={styles.requirementsList}>
            {request.requirements.map((req, index) => (
              <View key={index} style={styles.requirementItem}>
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
                <Text style={styles.requirementText}>{req}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Price Info */}
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Precio Estimado</Text>
            <Text style={styles.priceValue}>${request.price}</Text>
          </View>
          <View style={styles.priceNote}>
            <Text style={styles.priceNoteText}>
              El precio puede ajustarse según los detalles durante la aceptación
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleCallClient}
        >
          <Text style={styles.secondaryButtonText}>📞 Llamar al Cliente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleAccept}
        >
          <Text style={styles.primaryButtonText}>Aceptar Solicitud</Text>
        </TouchableOpacity>
      </View>

      {/* Accept Request Flow */}
      <AcceptRequestFlow
        isOpen={showAcceptFlow}
        onClose={() => setShowAcceptFlow(false)}
        request={{
          id: request.id,
          title: request.title,
          client: request.client,
          location: request.location,
          suggestedPrice: request.price,
          suggestedDate: request.date,
          suggestedTime: request.time
        }}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  backButton: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary
  },
  newBadgeContainer: {
    marginBottom: 16
  },
  newBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.status.success,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: "hidden"
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 16
  },
  clientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12
  },
  clientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0
  },
  clientInitial: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700"
  },
  clientInfo: {
    flex: 1
  },
  clientName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 2
  },
  clientRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2
  },
  rating: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text.primary
  },
  reviews: {
    fontSize: 10,
    color: colors.text.tertiary
  },
  phone: {
    fontSize: 11,
    color: colors.text.secondary
  },
  chatButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.borderLight,
    justifyContent: "center",
    alignItems: "center"
  },
  chatButtonText: {
    fontSize: 16
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 12
  },
  infoBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  infoLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: "500",
    marginBottom: 4
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary
  },
  scheduleGrid: {
    flexDirection: "row",
    gap: 8
  },
  scheduleItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border
  },
  scheduleLabel: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: "500",
    marginBottom: 4
  },
  scheduleValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary
  },
  description: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
    marginBottom: 12
  },
  detailsList: {
    gap: 8
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingVertical: 4
  },
  detailBullet: {
    fontSize: 14,
    color: colors.status.success,
    fontWeight: "700"
  },
  detailText: {
    fontSize: 12,
    color: colors.text.secondary,
    flex: 1
  },
  requirementsList: {
    gap: 8
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 10,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.status.success,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0
  },
  checkmarkText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700"
  },
  requirementText: {
    fontSize: 12,
    color: colors.text.secondary,
    flex: 1
  },
  priceSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  priceLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: "500"
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary
  },
  priceNote: {
    backgroundColor: colors.borderLight,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8
  },
  priceNoteText: {
    fontSize: 10,
    color: colors.text.tertiary,
    textAlign: "center"
  },
  footer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center"
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600"
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border
  },
  secondaryButtonText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600"
  }
});
