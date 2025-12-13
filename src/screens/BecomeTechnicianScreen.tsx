import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api-client.service';
import { getApiUrl } from '../config/api.config';
import { RegisterStyle } from '../styles/RegisterScreen.style';

interface BecomeTechnicianScreenProps {
  readonly onBack: () => void;
  readonly onSuccess: () => void;
}

export default function BecomeTechnicianScreen({
  onBack,
  onSuccess,
}: BecomeTechnicianScreenProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // TS FIX: user no puede ser null aquí porque App lo filtra antes
  const currentUser = user!;

  const handleSubmitVerification = async () => {
    try {
      setLoading(true);

      console.log('[BecomeTechnicianScreen] Enviando solicitud de verificación para usuario:', currentUser.idUser);
      
      // Obtener el técnico actual para obtener su ID
      const getTechUrl = getApiUrl(`/technician/tecnicos/user/${currentUser.idUser}`);
      const response = await apiClient.get(getTechUrl);
      const technicianData: { idTecnico?: number } = response as any;
      
      if (!technicianData || !technicianData.idTecnico) {
        throw new Error('No se encontró el registro de técnico. Por favor intenta convertirte en técnico primero.');
      }

      // Enviar solicitud de verificación
      const submitVerificationUrl = getApiUrl(`/technician/tecnicos/${technicianData.idTecnico}/verification`);
      await apiClient.post(submitVerificationUrl, {});

      console.log('[BecomeTechnicianScreen] ✅ Solicitud de verificación enviada');

      Alert.alert(
        '✔ Solicitud Enviada',
        'Tu solicitud de verificación ha sido registrada. El equipo de FixIt la revisará pronto.',
        [{ text: 'OK', onPress: onSuccess }],
      );
    } catch (error: any) {
      console.error('[BecomeTechnicianScreen] Error:', error);
      Alert.alert(
        'Error',
        error?.message ?? 'No se pudo enviar la solicitud de verificación.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={RegisterStyle.scrollContent}
      style={RegisterStyle.container}>
      <View style={RegisterStyle.formContainer}>
        <Text style={RegisterStyle.title}>Verificar Cuenta Técnica</Text>

        <Text style={RegisterStyle.subtitle}>
          Ya tienes acceso al panel técnico. Ahora verifica tu cuenta para mejorar tu
          visibilidad y confianza en la plataforma.
        </Text>

        <View style={RegisterStyle.summaryBox}>
          <Text style={RegisterStyle.summaryTitle}>Tus Datos</Text>

          <Text style={RegisterStyle.summaryText}>
            Nombre: {currentUser.nombres} {currentUser.apellidos}
          </Text>

          <Text style={RegisterStyle.summaryText}>
            Email: {currentUser.email}
          </Text>

          <Text style={RegisterStyle.summaryText}>
            Cédula: {currentUser.cedula}
          </Text>
        </View>

        <View style={{ backgroundColor: '#e3f2fd', padding: 15, borderRadius: 8, marginVertical: 20 }}>
          <Text style={{ fontSize: 14, color: '#1976d2', lineHeight: 20 }}>
            ℹ️ La verificación ayuda a los clientes a confiar más en tus servicios.
            Un equipo especializado revisará tu solicitud.
          </Text>
        </View>

        <TouchableOpacity
          style={RegisterStyle.button}
          onPress={handleSubmitVerification}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={RegisterStyle.buttonText}>Solicitar Verificación</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onBack}>
          <Text style={RegisterStyle.switchText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
