import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { TechnicianRequestDetailsStyles as styles } from "../../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AcceptRequestFlow from "../../components/AcceptRequestFlow";
import { colors } from "../../theme/colors";

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
            {request.details.map((detail) => (
              <View key={detail} style={styles.detailItem}>
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
            {request.requirements.map((req) => (
              <View key={req} style={styles.requirementItem}>
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
