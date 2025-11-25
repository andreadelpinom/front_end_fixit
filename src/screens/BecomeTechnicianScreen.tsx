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
import { createTechnician } from '../services/technician.service';
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

  const handleCreateTechnician = async () => {
    try {
      setLoading(true);
      await createTechnician(currentUser.idUser);

      Alert.alert(
        '✔ Perfil técnico creado',
        'Ahora puedes añadir servicios y parroquias.',
        [{ text: 'OK', onPress: onSuccess }],
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message ?? 'No se pudo crear el perfil técnico.',
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
        <Text style={RegisterStyle.title}>Convertirse en Técnico</Text>

        <Text style={RegisterStyle.subtitle}>
          Para ofrecer servicios dentro de la plataforma, debes crear primero tu
          perfil técnico.
        </Text>

        <View style={RegisterStyle.summaryBox}>
          <Text style={RegisterStyle.summaryTitle}>Datos del Usuario</Text>

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

        <TouchableOpacity
          style={RegisterStyle.button}
          onPress={handleCreateTechnician}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={RegisterStyle.buttonText}>Crear Perfil Técnico</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onBack}>
          <Text style={RegisterStyle.switchText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
