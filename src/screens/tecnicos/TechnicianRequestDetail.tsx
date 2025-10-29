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
import { Request } from "../../types";

export default function TechnicianRequestDetail({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [showAcceptFlow, setShowAcceptFlow] = useState(false);

  // ✅ Mock request strictly typed as Request (now includes 'id')
  const request: Request = {
    id: 1, // 👈 required field added
    idTipoServicio: 1,
    codigoParroquia: "GYE-001",
    tituloProblema: "Electricidad - Instalación de interruptores",
    descripcionProblema:
      "Instalar nuevos interruptores y tomacorrientes en la sala y cocina",
    costoEstimado: 85,
    costoPromocion: 75,
    promocion: false,
    fechaProgramada: "2024-03-15",
    duracionEstimadaMin: 90
  };

  const handleAccept = () => {
    setShowAcceptFlow(true);
  };

  const handleCallClient = () => {
    // TODO: Implementar llamada telefónica real
    console.log("Llamar al cliente asociado a la solicitud");
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

        {/* Service Title */}
        <Text style={styles.title}>{request.tituloProblema}</Text>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Descripción del Problema</Text>
          <Text style={styles.description}>{request.descripcionProblema}</Text>
        </View>

        {/* Schedule Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Fecha Programada</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Fecha</Text>
            <Text style={styles.infoValue}>
              {request.fechaProgramada || "Por definir"}
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Duración Estimada</Text>
            <Text style={styles.infoValue}>
              {request.duracionEstimadaMin
                ? `${request.duracionEstimadaMin} minutos`
                : "No especificada"}
            </Text>
          </View>
        </View>

        {/* Price Info */}
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Costo Estimado</Text>
            <Text style={styles.priceValue}>
              ${request.costoEstimado?.toFixed(2)}
            </Text>
          </View>

          {request.promocion && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Costo con Promoción</Text>
              <Text style={[styles.priceValue, { color: colors.status.success }]}>
                ${request.costoPromocion?.toFixed(2)}
              </Text>
            </View>
          )}

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

      {/* ✅ Accept Request Flow - includes id */}
      <AcceptRequestFlow
        isOpen={showAcceptFlow}
        onClose={() => setShowAcceptFlow(false)}
        request={{
          id: request.id,
          idTipoServicio: request.idTipoServicio,
          codigoParroquia: request.codigoParroquia,
          tituloProblema: request.tituloProblema,
          descripcionProblema: request.descripcionProblema,
          costoEstimado: request.costoEstimado,
          costoPromocion: request.costoPromocion,
          promocion: request.promocion,
          fechaProgramada: request.fechaProgramada,
          duracionEstimadaMin: request.duracionEstimadaMin
        }}
      />
    </View>
  );
}
