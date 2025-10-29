import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateServiceStyles as styles } from "../../styles";
import { colors } from "../../theme/colors";
import { Request, StepProps, CreateServiceProps, Option } from "../../types";
import { AVAILABILITY_OPTIONS, DURATION_OPTIONS, SERVICE_CATEGORIES } from "../DummyData";
import { DefaultSeparator, LargeSeparator } from "../../helpers";

// ───────────────────────────────
// Reusable UI Components
// ───────────────────────────────
const OptionItem = ({
  item,
  selected,
  onSelect,
}: {
  readonly item: Option;
  readonly selected: string;
  readonly onSelect: (value: string) => void;
}) => (
  <TouchableOpacity
    style={[styles.optionCard, selected === item.value && styles.optionCardSelected]}
    onPress={() => onSelect(item.value)}
  >
    <Text style={styles.optionLabel}>{item.label}</Text>
    {selected === item.value && <Text style={styles.checkmark}>✓</Text>}
  </TouchableOpacity>
);

// ───────────────────────────────
// Step Components
// ───────────────────────────────
const StepOne = ({ data, onChange }: StepProps<Request>) => (
  <View style={styles.stepContent}>
    <Text style={styles.stepTitle}>Selecciona la categoría de servicio</Text>
    <Text style={styles.stepDescription}>Elige el tipo de servicio que ofreces</Text>
    <FlatList
      data={SERVICE_CATEGORIES}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.categoryCard,
            data.idTipoServicio.toString() === item.value && styles.categoryCardSelected,
          ]}
          onPress={() => onChange?.("idTipoServicio", Number(item.value))}
        >
          <Text style={styles.categoryIcon}>{item.icon}</Text>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryLabel}>{item.label}</Text>
            <Text style={styles.categoryDescription}>{item.description}</Text>
          </View>
          {data.idTipoServicio.toString() === item.value && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      ItemSeparatorComponent={LargeSeparator}
    />
  </View>
);

const StepTwo = ({ data, onChange }: StepProps<Request>) => {
  const handleDurationPress = useCallback(
    (value: string) =>
      onChange?.("duracionEstimadaMin", Number.parseInt(value.replaceAll(/\D/g, ""), 10) || 0),
    [onChange]
  );

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Detalles del servicio</Text>
      <Text style={styles.stepDescription}>Describe tu servicio con precisión</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Título *</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ej: Reparación de grifería"
            placeholderTextColor={colors.text.tertiary}
            value={data.tituloProblema}
            onChangeText={(text) => onChange?.("tituloProblema", text)}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Descripción *</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe qué incluye tu servicio..."
            placeholderTextColor={colors.text.tertiary}
            value={data.descripcionProblema}
            onChangeText={(text) => onChange?.("descripcionProblema", text)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Precio estimado ($) *</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={[styles.input, styles.priceInput]}
            placeholder="0.00"
            placeholderTextColor={colors.text.tertiary}
            keyboardType="decimal-pad"
            value={data.costoEstimado?.toString() ?? ""}
            onChangeText={(text) => onChange?.("costoEstimado", Number.parseFloat(text) || 0)}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Duración estimada *</Text>
        <FlatList
          data={DURATION_OPTIONS}
          renderItem={({ item }) => (
            <OptionItem
              item={item}
              selected={data.duracionEstimadaMin?.toString() ?? ""}
              onSelect={handleDurationPress}
            />
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={DefaultSeparator}
        />
      </View>
    </View>
  );
};

const StepThree = ({ data, onChange }: StepProps<Request>) => (
  <View style={styles.stepContent}>
    <Text style={styles.stepTitle}>Ubicación y disponibilidad</Text>
    <Text style={styles.stepDescription}>Dónde y cuándo ofreces tu servicio</Text>

    <View style={styles.formGroup}>
      <Text style={styles.label}>Código de parroquia *</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ej: 090101"
          placeholderTextColor={colors.text.tertiary}
          value={data.codigoParroquia}
          onChangeText={(text) => onChange?.("codigoParroquia", text)}
        />
      </View>
    </View>

    <View style={styles.formGroup}>
      <Text style={styles.label}>Disponibilidad *</Text>
      <FlatList
        data={AVAILABILITY_OPTIONS}
        renderItem={({ item }) => (
          <OptionItem
            item={item}
            selected={data.estadoSolicitud ?? ""}
            onSelect={(value) => onChange?.("estadoSolicitud", value)}
          />
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={DefaultSeparator}
      />
    </View>
  </View>
);

const StepFour = ({ data }: StepProps<Request>) => {
  const selectedCategory = SERVICE_CATEGORIES.find(
    (cat) => cat.value === data.idTipoServicio.toString()
  );

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Revisa tu servicio</Text>
      <Text style={styles.stepDescription}>Verifica que toda la información sea correcta</Text>

      <View style={styles.summaryCard}>
        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Categoría</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryIcon}>{selectedCategory?.icon}</Text>
            <Text style={styles.summaryValue}>{selectedCategory?.label}</Text>
          </View>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Título</Text>
          <Text style={styles.summaryValue}>{data.tituloProblema}</Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Descripción</Text>
          <Text style={styles.summaryValue}>{data.descripcionProblema}</Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Precio estimado</Text>
          <Text style={styles.priceText}>${data.costoEstimado}</Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Duración</Text>
          <Text style={styles.summaryValue}>{data.duracionEstimadaMin} minutos</Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Código Parroquia</Text>
          <Text style={styles.summaryValue}>{data.codigoParroquia}</Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Disponibilidad</Text>
          <Text style={styles.summaryValue}>
            {AVAILABILITY_OPTIONS.find((opt) => opt.value === data.estadoSolicitud)?.label}
          </Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          Una vez confirmes, tu servicio será publicado y los clientes podrán contactarte.
        </Text>
      </View>
    </View>
  );
};

// ───────────────────────────────
// Main Screen
// ───────────────────────────────
export default function CreateService({ navigation }: Readonly<CreateServiceProps>) {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [request, setRequest] = useState<Request>({
    id: 0,
    idTipoServicio: 0,
    codigoParroquia: "",
    tituloProblema: "",
    descripcionProblema: "",
    costoEstimado: undefined,
    fechaProgramada: "",
    duracionEstimadaMin: undefined,
    estadoSolicitud: "",
  });

  const updateField = useCallback(
    <K extends keyof Request>(field: K, value: Request[K]) => {
      setRequest((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 1: {
        if (!request.idTipoServicio) {
          Alert.alert("Error", "Selecciona una categoría");
          return false;
        }
        break;
      }
      case 2: {
        if (!request.tituloProblema.trim()) {
          Alert.alert("Error", "Ingresa un título");
          return false;
        }
        if (!request.descripcionProblema.trim()) {
          Alert.alert("Error", "Ingresa una descripción");
          return false;
        }
        if (!request.costoEstimado) {
          Alert.alert("Error", "Ingresa un precio");
          return false;
        }
        break;
      }
      case 3: {
        if (!request.codigoParroquia.trim()) {
          Alert.alert("Error", "Ingresa el código parroquial");
          return false;
        }
        if (!request.estadoSolicitud) {
          Alert.alert("Error", "Selecciona disponibilidad");
          return false;
        }
        break;
      }
      default:
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const createService = async (): Promise<void> => {
    try {
      console.log("Service created:", request);
      Alert.alert("Éxito", "Servicio creado correctamente", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error("Error creating service:", err);
      Alert.alert("Error", "No se pudo crear el servicio. Intenta nuevamente.");
    }
  };

  const handleSubmit = () =>
    Alert.alert("Confirmar", "¿Deseas crear este servicio?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Confirmar", onPress: () => { void createService(); } },
    ]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne data={request} onChange={updateField} />;
      case 2:
        return <StepTwo data={request} onChange={updateField} />;
      case 3:
        return <StepThree data={request} onChange={updateField} />;
      case 4:
        return <StepFour data={request} />;
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Atrás</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crear servicio</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Paso {currentStep} de {totalSteps}
          </Text>
        </View>

        {/* Step Indicators */}
        <View style={styles.stepIndicator}>
          {[1, 2, 3, 4].map((step) => (
            <View
              key={step}
              style={[
                styles.stepDot,
                step <= currentStep && styles.stepDotActive,
                step === currentStep && styles.stepDotCurrent,
              ]}
            >
              {step < currentStep ? (
                <Text style={styles.checkmarkSmall}>✓</Text>
              ) : (
                <Text style={styles.stepNumber}>{step}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Step Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderStep()}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 12 }]}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.backNavigationButton} onPress={handleBack}>
              <Text style={styles.backNavigationButtonText}>← Anterior</Text>
            </TouchableOpacity>
          )}
          {currentStep < totalSteps && (
            <TouchableOpacity style={[styles.nextButton, currentStep === 1 && { flex: 1 }]} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Siguiente →</Text>
            </TouchableOpacity>
          )}
          {currentStep === totalSteps && (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>✓ Confirmar y crear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
