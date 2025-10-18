import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions
} from "react-native";
import { colors } from "../theme/colors";

interface Request {
  id: string;
  title: string;
  client: string;
  location: string;
  suggestedPrice: number;
  suggestedDate: string;
  suggestedTime: string;
}

interface AcceptRequestFlowProps {
  isOpen: boolean;
  onClose: () => void;
  request?: Request;
}

type StepType = 1 | 2 | 3 | 4;

export default function AcceptRequestFlow({
  isOpen,
  onClose,
  request
}: AcceptRequestFlowProps) {
  const [currentStep, setCurrentStep] = useState<StepType>(1);
  const [formData, setFormData] = useState({
    price: request?.suggestedPrice.toString() || "",
    date: request?.suggestedDate || "",
    time: request?.suggestedTime || "",
    code: ""
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as StepType);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as StepType);
    }
  };

  const handleComplete = () => {
    // Handle completion of the request
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
                style={styles.input}
                placeholder="Ingresa el precio"
                placeholderTextColor={colors.text.tertiary}
                value={formData.price}
                onChangeText={(text) =>
                  setFormData({ ...formData, price: text })
                }
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Fecha</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.text.tertiary}
                value={formData.date}
                onChangeText={(text) =>
                  setFormData({ ...formData, date: text })
                }
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Hora</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                placeholderTextColor={colors.text.tertiary}
                value={formData.time}
                onChangeText={(text) =>
                  setFormData({ ...formData, time: text })
                }
              />
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
                style={styles.input}
                placeholder="Ingresa el código"
                placeholderTextColor={colors.text.tertiary}
                value={formData.code}
                onChangeText={(text) =>
                  setFormData({ ...formData, code: text })
                }
                maxLength={6}
              />
            </View>
            <Text style={styles.codeHint}>
              No recibiste el código? Resend after 30 seconds
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
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
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
            showsVerticalScrollIndicator={false}
          >
            {renderStep()}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
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
                style={[styles.primaryButton, !currentStep && styles.primaryButtonDisabled]}
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
      </View>
    </Modal>
  );
}

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end"
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: windowHeight * 0.9,
    display: "flex",
    flexDirection: "column"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  closeButton: {
    fontSize: 20,
    color: colors.text.tertiary,
    fontWeight: "600"
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.secondary
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border
  },
  progressDotActive: {
    backgroundColor: colors.primary
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  stepContent: {
    marginBottom: 16
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 12
  },
  stepDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
    marginBottom: 12
  },
  requestDetailLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    paddingVertical: 2
  },
  detailLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: "500"
  },
  detailValue: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: "600"
  },
  detailValueHighlight: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "700"
  },
  formGroup: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 6
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text.primary
  },
  codeHint: {
    fontSize: 11,
    color: colors.text.tertiary,
    textAlign: "center",
    marginTop: 12
  },
  successIcon: {
    fontSize: 48,
    textAlign: "center",
    marginBottom: 12
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.5
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600"
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryButtonText: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: "600"
  },
  completeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.status.success,
    alignItems: "center",
    justifyContent: "center"
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600"
  }
});
