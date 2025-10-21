import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AcceptRequestFlowStyles as styles } from "../styles";
import { AcceptRequestFlowProps } from "../interface";
import { useState, useEffect, useRef } from "react";
import { colors } from "../theme/colors";
import { StepType } from "../types";

export default function AcceptRequestFlow({
  isOpen,
  onClose,
  request
}: Readonly<AcceptRequestFlowProps>) {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<StepType>(1);
  const [formData, setFormData] = useState({
    price: request?.suggestedPrice.toString() || "",
    date: request?.suggestedDate || "",
    time: request?.suggestedTime || "",
    code: ""
  });

  // Refs para TextInput
  const priceRef = useRef<TextInput>(null);
  const dateRef = useRef<TextInput>(null);
  const timeRef = useRef<TextInput>(null);
  const codeRef = useRef<TextInput>(null);

  useEffect(() => {
    setFormData({
      price: request?.suggestedPrice.toString() || "",
      date: request?.suggestedDate || "",
      time: request?.suggestedTime || "",
      code: ""
    });
  }, [request]);

  const handleNext = () => {
    setCurrentStep(prev => (prev < 4 ? (prev + 1) as StepType : prev));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => (prev > 1 ? (prev - 1) as StepType : prev));
  };

  const handleComplete = () => {
    console.log("Request accepted:", formData);
    resetFlow();
    onClose();
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setFormData({
      price: request?.suggestedPrice.toString() || "",
      date: request?.suggestedDate || "",
      time: request?.suggestedTime || "",
      code: ""
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Confirmar Solicitud</Text>
            <View
              style={{
                backgroundColor: colors.borderLight,
                padding: 12,
                borderRadius: 12,
                marginBottom: 16
              }}
            >
              <Text style={styles.requestDetailLabel}>{request?.title}</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Cliente:</Text>
                <Text style={styles.detailValue}>{request?.client}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ubicación:</Text>
                <Text style={styles.detailValue}>{request?.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fecha:</Text>
                <Text style={styles.detailValue}>{request?.suggestedDate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Hora:</Text>
                <Text style={styles.detailValue}>{request?.suggestedTime}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Precio:</Text>
                <Text style={styles.detailValueHighlight}>
                  ${request?.suggestedPrice}
                </Text>
              </View>
            </View>
            <Text style={styles.stepDescription}>
              ¿Deseas aceptar esta solicitud? Revisa los detalles antes de continuar.
            </Text>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Ajustar Precio y Fecha</Text>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Precio Final ($)</Text>
              <TextInput
                ref={priceRef}
                style={styles.input}
                placeholder="Ingresa el precio"
                placeholderTextColor={colors.text.tertiary}
                value={formData.price}
                onChangeText={(text) =>
                  setFormData({ ...formData, price: text })
                }
                keyboardType="decimal-pad"
                returnKeyType="done"
                onSubmitEditing={() => priceRef.current?.blur()}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Fecha</Text>
              <TextInput
                ref={dateRef}
                style={styles.input}
                placeholder="YYYY-MM-DD (ej: 2024-03-15)"
                placeholderTextColor={colors.text.tertiary}
                value={formData.date}
                onChangeText={(text) =>
                  setFormData({ ...formData, date: text })
                }
                returnKeyType="next"
                onSubmitEditing={() => dateRef.current?.blur()}
              />
              <Text style={styles.inputHint}>💡 Usa formato: YYYY-MM-DD</Text>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Hora</Text>
              <TextInput
                ref={timeRef}
                style={styles.input}
                placeholder="HH:MM (ej: 14:30)"
                placeholderTextColor={colors.text.tertiary}
                value={formData.time}
                onChangeText={(text) =>
                  setFormData({ ...formData, time: text })
                }
                returnKeyType="done"
                onSubmitEditing={() => timeRef.current?.blur()}
              />
              <Text style={styles.inputHint}>💡 Formato de 24 horas</Text>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Validar Código</Text>
            <Text style={styles.stepDescription}>
              Se ha enviado un código de validación a tu teléfono registrado.
            </Text>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Código de Validación</Text>
              <TextInput
                ref={codeRef}
                style={styles.input}
                placeholder="Ingresa el código"
                placeholderTextColor={colors.text.tertiary}
                value={formData.code}
                onChangeText={(text) =>
                  setFormData({ ...formData, code: text })
                }
                maxLength={6}
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={() => codeRef.current?.blur()}
              />
            </View>
            <Text style={styles.codeHint}>
              No recibiste el código? Reenviar después de 30 segundos
            </Text>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.stepTitle}>¡Solicitud Aceptada!</Text>
            <Text style={styles.stepDescription}>
              Felicitaciones, has aceptado la solicitud exitosamente.
            </Text>
            <View
              style={{
                backgroundColor: colors.borderLight,
                padding: 12,
                borderRadius: 12,
                marginBottom: 16
              }}
            >
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ID de Solicitud:</Text>
                <Text style={styles.detailValue}>{request?.id}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Precio Final:</Text>
                <Text style={styles.detailValueHighlight}>
                  ${formData.price || request?.suggestedPrice}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fecha:</Text>
                <Text style={styles.detailValue}>{formData.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Hora:</Text>
                <Text style={styles.detailValue}>{formData.time}</Text>
              </View>
            </View>
            <Text style={styles.stepDescription}>
              El cliente será notificado de tu aceptación. Puedes ver los detalles
              en tu panel de solicitudes aceptadas.
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
        keyboardVerticalOffset={0}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              Paso {currentStep} de 4
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            {[1, 2, 3, 4].map(step => (
              <View
                key={step}
                style={[
                  styles.progressDot,
                  step <= currentStep && styles.progressDotActive
                ]}
              />
            ))}
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {renderStep()}
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
            {currentStep > 1 && (
              <TouchableOpacity
                onPress={handlePrevious}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>← Anterior</Text>
              </TouchableOpacity>
            )}

            {currentStep < 4 ? (
              <TouchableOpacity
                onPress={handleNext}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>Siguiente →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleComplete}
                style={styles.completeButton}
              >
                <Text style={styles.completeButtonText}>✓ Completar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
