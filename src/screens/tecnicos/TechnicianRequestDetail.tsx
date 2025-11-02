import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TechnicianRequestDetailsStyles as styles } from "../../styles";
import AcceptRequestFlow from "../../components/AcceptRequestFlow";
import { colors } from "../../theme/colors";
import { Request } from "../../types";

// ===== MOCK DATA =====
const MOCK_REQUEST: Request = {
  id: 1,
  idTipoServicio: 1,
  codigoParroquia: "GYE-001",
  tituloProblema: "Electricidad - Instalación de interruptores",
  descripcionProblema:
    "Instalar nuevos interruptores y tomacorrientes en la sala y cocina",
  costoEstimado: 85,
  costoPromocion: 75,
  promocion: false,
  fechaProgramada: "2024-03-15",
  duracionEstimadaMin: 90,
};

// ===== COMPONENTS =====
interface HeaderProps {
  onBack: () => void;
  topInset: number;
}

const Header = ({ onBack, topInset }: HeaderProps) => (
  <View style={[styles.header, { marginTop: topInset + 8 }]}>
    <TouchableOpacity onPress={onBack}>
      <Text style={styles.backButton}>← Atrás</Text>
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Detalles de Solicitud</Text>
    <View style={{ width: 40 }} />
  </View>
);

interface SectionProps {
  icon: string;
  title: string;
  children: React.ReactNode;
}

const Section = ({ icon, title, children }: SectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>
      {icon} {title}
    </Text>
    {children}
  </View>
);

interface InfoBoxProps {
  label: string;
  value: string;
}

const InfoBox = ({ label, value }: InfoBoxProps) => (
  <View style={styles.infoBox}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

interface PriceRowProps {
  label: string;
  value: number;
  isPromotion?: boolean;
}

const PriceRow = ({ label, value, isPromotion = false }: PriceRowProps) => (
  <View style={styles.priceRow}>
    <Text style={styles.priceLabel}>{label}</Text>
    <Text
      style={[
        styles.priceValue,
        isPromotion && { color: colors.status.success },
      ]}
    >
      ${value.toFixed(2)}
    </Text>
  </View>
);

interface PriceSectionProps {
  request: Request;
}

const PriceSection = ({ request }: PriceSectionProps) => (
  <View style={styles.priceSection}>
    <PriceRow label="Costo Estimado" value={request.costoEstimado ?? 0} />

    {request.promocion && request.costoPromocion !== undefined && (
      <PriceRow
        label="Costo con Promoción"
        value={request.costoPromocion}
        isPromotion
      />
    )}

    <View style={styles.priceNote}>
      <Text style={styles.priceNoteText}>
        El precio puede ajustarse según los detalles durante la aceptación
      </Text>
    </View>
  </View>
);

interface ActionButtonsProps {
  onCall: () => void;
  onAccept: () => void;
  bottomInset: number;
}

const ActionButtons = ({
  onCall,
  onAccept,
  bottomInset,
}: ActionButtonsProps) => (
  <View style={[styles.footer, { paddingBottom: bottomInset + 12 }]}>
    <TouchableOpacity style={styles.secondaryButton} onPress={onCall}>
      <Text style={styles.secondaryButtonText}>📞 Llamar al Cliente</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.primaryButton} onPress={onAccept}>
      <Text style={styles.primaryButtonText}>Aceptar Solicitud</Text>
    </TouchableOpacity>
  </View>
);

// ===== MAIN COMPONENT =====
export default function TechnicianRequestDetail({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [showAcceptFlow, setShowAcceptFlow] = useState(false);
  const request = MOCK_REQUEST;

  const handleAccept = () => {
    setShowAcceptFlow(true);
  };

  const handleCallClient = () => {
    console.log("Llamar al cliente asociado a la solicitud");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Header onBack={() => navigation.goBack()} topInset={insets.top} />

        <Text style={styles.title}>{request.tituloProblema}</Text>

        <Section icon="🔧" title="Descripción del Problema">
          <Text style={styles.description}>{request.descripcionProblema}</Text>
        </Section>

        <Section icon="📅" title="Fecha Programada">
          <InfoBox
            label="Fecha"
            value={request.fechaProgramada || "Por definir"}
          />
          <InfoBox
            label="Duración Estimada"
            value={
              request.duracionEstimadaMin
                ? `${request.duracionEstimadaMin} minutos`
                : "No especificada"
            }
          />
        </Section>

        <PriceSection request={request} />

        <View style={{ height: 20 }} />
      </ScrollView>

      <ActionButtons
        onCall={handleCallClient}
        onAccept={handleAccept}
        bottomInset={insets.bottom}
      />

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
          duracionEstimadaMin: request.duracionEstimadaMin,
        }}
      />
    </View>
  );
}
