import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRequestDraft } from '../../../context/RequestContext';

const COLORS = {
  primary: '#2196F3',
  primaryDark: '#1976D2',
  white: '#FFFFFF',
  background: '#F5F5F5',
  text: '#212121',
  textSecondary: '#757575',
  border: '#BDBDBD',
  error: '#F44336',
  success: '#4CAF50',
};

export default function RequestStepScheduleScreen({ navigation }: any): React.ReactElement {
  const { draft, updateDraft } = useRequestDraft();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Format date as dd/mm/yyyy
  const formatDateDisplay = (date: Date): string => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  // Format time as HH:mm (24h)
  const formatTimeDisplay = (date: Date): string => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  // Handle date picker change
  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  // Handle time picker change
  const handleTimeChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (date) {
      setSelectedTime(date);
    }
  };

  // Build ISO string from date + time
  const buildISOString = useCallback((): string | null => {
    if (!selectedDate || !selectedTime) return null;

    // Create a new date with selected date and time
    const isoDate = new Date(selectedDate);
    isoDate.setHours(selectedTime.getHours());
    isoDate.setMinutes(selectedTime.getMinutes());
    isoDate.setSeconds(0);
    isoDate.setMilliseconds(0);

    return isoDate.toISOString();
  }, [selectedDate, selectedTime]);

  // Validate and proceed
  const applyAndNext = useCallback(() => {
    // Validation: both date and time are required
    if (!selectedDate || !selectedTime) {
      Alert.alert(
        'Fecha y hora requeridas',
        'Debes seleccionar fecha y hora para continuar.'
      );
      return;
    }

    const isoString = buildISOString();
    if (!isoString) {
      Alert.alert('Error', 'No se pudo procesar la fecha seleccionada.');
      return;
    }

    // Update draft with ISO string
    updateDraft({ fechaProgramada: isoString });
    navigation.navigate('RequestStepPhotos');
  }, [selectedDate, selectedTime, buildISOString, updateDraft, navigation]);

  // Cancel with confirmation
  const handleCancel = useCallback(() => {
    Alert.alert(
      '¿Cancelar solicitud?',
      '¿Estás seguro que deseas cancelar? Se descartará el borrador.',
      [
        {
          text: 'Seguir creando',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Sí, cancelar',
          onPress: () => {
            updateDraft({
              tituloProblema: undefined,
              descripcionProblema: undefined,
              presupuesto: undefined,
              idTipoServicio: undefined,
              direccion: undefined,
              codigoParroquia: undefined,
              fechaProgramada: undefined,
            });
            navigation.reset({
              index: 0,
              routes: [{ name: 'ClientRequests' }],
            });
          },
          style: 'destructive',
        },
      ]
    );
  }, [navigation, updateDraft]);

  // Close date picker on iOS (modal behavior)
  const closeDatePickerIOS = () => {
    if (Platform.OS === 'ios') {
      setShowDatePicker(false);
    }
  };

  // Close time picker on iOS (modal behavior)
  const closeTimePickerIOS = () => {
    if (Platform.OS === 'ios') {
      setShowTimePicker(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with cancel button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Programa la solicitud</Text>
        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.cancelButtonPressed,
          ]}
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
          <Text style={styles.progressText}>Paso 3 de 5</Text>
        </View>

        {/* Title and description */}
        <View style={styles.section}>
          <Text style={styles.title}>Fecha y hora de atención</Text>
          <Text style={styles.subtitle}>
            Indica cuándo necesitas que el técnico realice el trabajo
          </Text>
        </View>

        {/* Date picker section */}
        <View style={styles.section}>
          <Text style={styles.label}>Fecha *</Text>
          <Pressable
            style={({ pressed }) => [
              styles.inputButton,
              pressed && styles.inputButtonPressed,
              selectedDate && styles.inputButtonActive,
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              style={[
                styles.inputButtonText,
                selectedDate && styles.inputButtonTextActive,
              ]}
            >
              {selectedDate ? formatDateDisplay(selectedDate) : 'Seleccionar fecha'}
            </Text>
          </Pressable>

          {showDatePicker && (
            <>
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
              {Platform.OS === 'ios' && (
                <Pressable
                  style={styles.datePickerDoneButton}
                  onPress={closeDatePickerIOS}
                >
                  <Text style={styles.datePickerDoneText}>Listo</Text>
                </Pressable>
              )}
            </>
          )}
        </View>

        {/* Time picker section */}
        <View style={styles.section}>
          <Text style={styles.label}>Hora *</Text>
          <Pressable
            style={({ pressed }) => [
              styles.inputButton,
              pressed && styles.inputButtonPressed,
              selectedTime && styles.inputButtonActive,
            ]}
            onPress={() => setShowTimePicker(true)}
          >
            <Text
              style={[
                styles.inputButtonText,
                selectedTime && styles.inputButtonTextActive,
              ]}
            >
              {selectedTime ? formatTimeDisplay(selectedTime) : 'Seleccionar hora'}
            </Text>
          </Pressable>

          {showTimePicker && (
            <>
              <DateTimePicker
                value={selectedTime || new Date()}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
                is24Hour
              />
              {Platform.OS === 'ios' && (
                <Pressable
                  style={styles.datePickerDoneButton}
                  onPress={closeTimePickerIOS}
                >
                  <Text style={styles.datePickerDoneText}>Listo</Text>
                </Pressable>
              )}
            </>
          )}
        </View>

        {/* Info text */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ✓ Ambos campos son obligatorios para continuar
          </Text>
          <Text style={styles.infoText}>
            ✓ Puedes seleccionar cualquier fecha a partir de hoy
          </Text>
        </View>
      </ScrollView>

      {/* Bottom buttons */}
      <View style={styles.bottomButtons}>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Anterior</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            !selectedDate || !selectedTime
              ? styles.primaryButtonDisabled
              : pressed && styles.buttonPressed,
          ]}
          onPress={applyAndNext}
          disabled={!selectedDate || !selectedTime}
        >
          <Text style={styles.primaryButtonText}>Siguiente</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelButtonPressed: {
    opacity: 0.7,
  },
  cancelButtonText: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  inputButtonPressed: {
    backgroundColor: '#F5F5F5',
  },
  inputButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#E3F2FD',
  },
  inputButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  inputButtonTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  datePickerDoneButton: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  datePickerDoneText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 4,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 18,
    marginBottom: 4,
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
