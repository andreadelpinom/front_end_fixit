import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RequestDetailStyles as styles } from "../../styles";
import AcceptRequestFlow from "../../components/AcceptRequestFlow";
import { REQUEST_HISTORY } from "../DummyData";
import { RequestDetail as RequestDetailType } from "../../interface";
import { ScreenProps } from "../../types";

export default function RequestDetail({ navigation, route }: Readonly<ScreenProps>) {
  const insets = useSafeAreaInsets();
  const [showAcceptFlow, setShowAcceptFlow] = useState(false);

  const requestId = route.params.requestId;
  const request: RequestDetailType | undefined = requestId
    ? REQUEST_HISTORY[requestId]
    : undefined;

  if (!request) {
    return (
      <View
        style={[
          styles.container,
          { paddingBottom: insets.bottom, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>No se encontró la solicitud.</Text>
      </View>
    );
  }

  const handleAccept = () => setShowAcceptFlow(true);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Atrás</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles de Solicitud</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Rest of your JSX */}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>📞 Llamar al Cliente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleAccept}>
          <Text style={styles.primaryButtonText}>Aceptar Solicitud</Text>
        </TouchableOpacity>
      </View>

      <AcceptRequestFlow
        isOpen={showAcceptFlow}
        onClose={() => setShowAcceptFlow(false)}
        request={{
          ...request,
          id: Number.parseInt(request.id.replaceAll(/\D/g, ""), 10),
        }}
      />
    </View>
  );
}
