import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, client } from '../../theme/colors';

const SERVICE_CATEGORIES = [
  { id: 'electricidad', label: 'Electricidad', icon: '⚡', description: 'Instalaciones y reparaciones eléctricas' },
  { id: 'plomeria', label: 'Plomería', icon: '🔧', description: 'Reparaciones de tuberías y grifería' },
  { id: 'carpinteria', label: 'Carpintería', icon: '🪚', description: 'Puertas, marcos y trabajos en madera' },
  { id: 'climatizacion', label: 'Climatización', icon: '🌬️', description: 'Aire acondicionado y calefacción' },
  { id: 'limpieza', label: 'Limpieza', icon: '🧹', description: 'Servicios de limpieza profunda' },
  { id: 'pintura', label: 'Pintura', icon: '🎨', description: 'Pintura de interiores y exteriores' },
];
const DURATION_OPTIONS = [
  { id: '1', label: 'Menos de 1 hora', value: '< 1h' },
  { id: '2', label: '1-2 horas', value: '1-2h' },
  { id: '3', label: '2-4 horas', value: '2-4h' },
  { id: '4', label: '4-8 horas', value: '4-8h' },
  { id: '5', label: 'Más de 8 horas', value: '> 8h' },
];
const AVAILABILITY_OPTIONS = [
  { id: '1', label: 'Hoy', value: 'today' },
  { id: '2', label: 'Mañana', value: 'tomorrow' },
  { id: '3', label: 'Esta semana', value: 'this_week' },
  { id: '4', label: 'Próxima semana', value: 'next_week' },
  { id: '5', label: 'Por acordar', value: 'flexible' },
];

// @ts-ignore
export function StepOne(props) {
  const { category, setCategory } = props;
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Selecciona la categoría de servicio</Text>
      <Text style={styles.stepDescription}>Elige el tipo de servicio que ofreces</Text>
      <FlatList
        data={SERVICE_CATEGORIES}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryCard,
              category === item.id && styles.categoryCardSelected,
            ]}
            onPress={() => setCategory(item.id)}
          >
            <Text style={styles.categoryIcon}>{item.icon}</Text>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryLabel}>{item.label}</Text>
              <Text style={styles.categoryDescription}>{item.description}</Text>
            </View>
            {category === item.id && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

// @ts-ignore
export function StepTwo(props) {
  const { title, description, price, duration, setField, setDuration } = props;
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Detalles del servicio</Text>
      <Text style={styles.stepDescription}>Describe tu servicio con precisión</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Título del servicio *</Text>
        <View style={styles.inputContainer}>
          <TextInput
            key="title-input"
            style={styles.input}
            placeholder="Ej: Reparación de grifería"
            placeholderTextColor={colors.text.tertiary}
            value={title}
            onChangeText={text => setField('title', text)}
          />
        </View>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Descripción detallada *</Text>
        <View style={styles.inputContainer}>
          <TextInput
            key="description-input"
            style={[styles.input, styles.textArea]}
            placeholder="Describe qué incluye tu servicio..."
            placeholderTextColor={colors.text.tertiary}
            value={description}
            onChangeText={text => setField('description', text)}
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
            key="price-input"
            style={[styles.input, styles.priceInput]}
            placeholder="0.00"
            placeholderTextColor={colors.text.tertiary}
            value={price}
            onChangeText={text => setField('price', text)}
            keyboardType="decimal-pad"
          />
        </View>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Duración estimada *</Text>
        <FlatList
          data={DURATION_OPTIONS}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.optionCard,
                duration === item.value && styles.optionCardSelected,
              ]}
              onPress={() => {
                setDuration(item.value);
                setField('duration', item.value);
              }}
            >
              <Text style={styles.optionLabel}>{item.label}</Text>
              {duration === item.value && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      </View>
    </View>
  );
}

// @ts-ignore
export function StepThree(props) {
  const { location, address, availability, notes, setField, setAvailability } = props;
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Ubicación y disponibilidad</Text>
      <Text style={styles.stepDescription}>Dónde y cuándo ofreces tu servicio</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Ubicación (zona) *</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>📍</Text>
          <TextInput
            key="location-input"
            style={styles.input}
            placeholder="Ej: Centro, Guayaquil"
            placeholderTextColor={colors.text.tertiary}
            value={location}
            onChangeText={text => setField('location', text)}
          />
        </View>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Dirección completa *</Text>
        <View style={styles.inputContainer}>
          <TextInput
            key="address-input"
            style={[styles.input, styles.textArea]}
            placeholder="Ej: Calle Principal #123, Apto 4B"
            placeholderTextColor={colors.text.tertiary}
            value={address}
            onChangeText={text => setField('address', text)}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Disponibilidad *</Text>
        <FlatList
          data={AVAILABILITY_OPTIONS}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.optionCard,
                availability === item.value && styles.optionCardSelected,
              ]}
              onPress={() => {
                setAvailability(item.value);
                setField('availability', item.value);
              }}
            >
              <Text style={styles.optionLabel}>{item.label}</Text>
              {availability === item.value && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Notas adicionales</Text>
        <View style={styles.inputContainer}>
          <TextInput
            key="notes-input"
            style={[styles.input, styles.textArea]}
            placeholder="Información adicional para los clientes..."
            placeholderTextColor={colors.text.tertiary}
            value={notes}
            onChangeText={text => setField('notes', text)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );
}

// @ts-ignore
export function StepFour(props) {
  const { category, title, description, price, duration, location, address, availability, notes } = props;
  const selectedCategory = SERVICE_CATEGORIES.find(cat => cat.id === category);
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
          <Text style={styles.summaryValue}>{title}</Text>
        </View>
        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Descripción</Text>
          <Text style={styles.summaryValue}>{description}</Text>
        </View>
        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Precio estimado</Text>
          <Text style={styles.priceText}>${price}</Text>
        </View>
        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Duración</Text>
          <Text style={styles.summaryValue}>{duration}</Text>
        </View>
        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Ubicación</Text>
          <Text style={styles.summaryValue}>📍 {location} - {address}</Text>
        </View>
        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Disponibilidad</Text>
          <Text style={styles.summaryValue}>
            {AVAILABILITY_OPTIONS.find(opt => opt.value === availability)?.label}
          </Text>
        </View>
        {notes ? (
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Notas</Text>
            <Text style={styles.summaryValue}>{notes}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          Una vez confirmes, tu servicio será publicado y los clientes podrán contactarte para realizar el trabajo.
        </Text>
      </View>
    </View>
  );
}

// @ts-ignore
export default function CreateService({ navigation }) {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    price: '',
    duration: '',
    availability: '',
    location: '',
    address: '',
    notes: '',
  });
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');

  // @ts-ignore
  const updateFormField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.category) {
          Alert.alert('Error', 'Por favor selecciona una categoría');
          return false;
        }
        return true;
      case 2:
        if (!formData.title.trim()) {
          Alert.alert('Error', 'Por favor ingresa un título');
          return false;
        }
        if (!formData.description.trim()) {
          Alert.alert('Error', 'Por favor ingresa una descripción');
          return false;
        }
        if (!formData.price.trim()) {
          Alert.alert('Error', 'Por favor ingresa un precio');
          return false;
        }
        if (!selectedDuration) {
          Alert.alert('Error', 'Por favor selecciona una duración estimada');
          return false;
        }
        return true;
      case 3:
        if (!formData.location.trim()) {
          Alert.alert('Error', 'Por favor ingresa tu ubicación');
          return false;
        }
        if (!formData.address.trim()) {
          Alert.alert('Error', 'Por favor ingresa la dirección');
          return false;
        }
        if (!selectedAvailability) {
          Alert.alert('Error', 'Por favor selecciona disponibilidad');
          return false;
        }
        return true;
      case 4:
        return true;
      default:
        return true;
    }
  };
  const handleSubmit = () => {
    Alert.alert(
      'Confirmar',
      '¿Deseas crear este servicio?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              // Simulate API call
              console.log('Creating service:', {
                ...formData,
                duration: selectedDuration,
                availability: selectedAvailability,
              });
              Alert.alert(
                'Éxito',
                'Servicio creado correctamente',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ],
              );
            } catch (error) {
              Alert.alert('Error', 'No se pudo crear el servicio');
            }
          },
        },
      ],
    );
  };
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            category={formData.category}
            // @ts-ignore
            setCategory={id => updateFormField('category', id)}
          />
        );
      case 2:
        return (
          <StepTwo
            title={formData.title}
            description={formData.description}
            price={formData.price}
            duration={selectedDuration}
            setField={updateFormField}
            setDuration={setSelectedDuration}
          />
        );
      case 3:
        return (
          <StepThree
            location={formData.location}
            address={formData.address}
            availability={selectedAvailability}
            notes={formData.notes}
            setField={updateFormField}
            setAvailability={setSelectedAvailability}
          />
        );
      case 4:
        return (
          <StepFour
            category={formData.category}
            title={formData.title}
            description={formData.description}
            price={formData.price}
            duration={selectedDuration}
            location={formData.location}
            address={formData.address}
            availability={selectedAvailability}
            notes={formData.notes}
          />
        );
      default:
  // @ts-ignore
  return <StepOne category={formData.category} setCategory={id => updateFormField('category', id)} />;
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}> 
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Atrás</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crear servicio</Text>
          <View style={{ width: 60 }} />
        </View>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(currentStep / totalSteps) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Paso {currentStep} de {totalSteps}
          </Text>
        </View>
        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          {[1, 2, 3, 4].map(step => (
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
        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderStep()}
        </ScrollView>
        {/* Navigation Buttons */}
        <View
          style={[
            styles.buttonContainer,
            { paddingBottom: insets.bottom + 12 },
          ]}
        >
          {currentStep > 1 && (
            <TouchableOpacity
              style={styles.backNavigationButton}
              onPress={handleBack}
            >
              <Text style={styles.backNavigationButtonText}>← Anterior</Text>
            </TouchableOpacity>
          )}
          {currentStep < totalSteps && (
            <TouchableOpacity
              style={[
                styles.nextButton,
                currentStep === 1 && { flex: 1 },
              ]}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>Siguiente →</Text>
            </TouchableOpacity>
          )}
          {currentStep === totalSteps && (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>✓ Confirmar y crear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: client.primary,
    backgroundColor: colors.background,
  },
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: client.primary,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: client.primary,
  },
  progressText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.background,
    paddingVertical: 12,
  },
  stepDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  stepDotActive: {
    backgroundColor: client.light,
    borderColor: client.primary,
  },
  stepDotCurrent: {
    backgroundColor: client.primary,
    borderColor: client.primary,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  checkmarkSmall: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  stepContent: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 20,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: colors.border,
  },
  categoryCardSelected: {
    backgroundColor: client.light,
    borderColor: client.primary,
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  checkmark: {
    fontSize: 20,
    color: client.primary,
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.secondary,
    marginRight: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 14,
    color: colors.text.primary,
  },
  priceInput: {
    textAlign: 'right',
  },
  textArea: {
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionCardSelected: {
    backgroundColor: client.light,
    borderColor: client.primary,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
  },
  summaryCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summarySection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryIcon: {
    fontSize: 24,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    lineHeight: 20,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: client.primary,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.borderLight,
    borderRadius: 10,
    padding: 12,
    gap: 10,
    marginTop: 20,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  backNavigationButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backNavigationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  nextButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: client.primary,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  submitButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: client.dark,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
