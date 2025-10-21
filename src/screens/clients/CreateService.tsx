import { useState, useCallback } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreateServiceStyles as styles } from "../../styles";
import { colors } from '../../theme/colors';

// Types
interface ServiceCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
}

interface DurationOption {
  id: string;
  label: string;
  value: string;
}

interface AvailabilityOption {
  id: string;
  label: string;
  value: string;
}

interface FormData {
  category: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  availability: string;
  location: string;
  address: string;
  notes: string;
}

interface CategoryItemProps {
  readonly item: ServiceCategory;
  readonly category: string;
  readonly onPress: (id: string) => void;
}

interface DurationOptionProps {
  readonly item: DurationOption;
  readonly duration: string;
  readonly onPress: (value: string) => void;
}

interface AvailabilityOptionProps {
  readonly item: AvailabilityOption;
  readonly availability: string;
  readonly onPress: (value: string) => void;
}

interface StepOneProps {
  readonly category: string;
  readonly setCategory: (id: string) => void;
}

interface StepTwoProps {
  readonly title: string;
  readonly description: string;
  readonly price: string;
  readonly duration: string;
  readonly setField: (field: keyof FormData, value: string) => void;
  readonly setDuration: (value: string) => void;
}

interface StepThreeProps {
  readonly location: string;
  readonly address: string;
  readonly availability: string;
  readonly notes: string;
  readonly setField: (field: keyof FormData, value: string) => void;
  readonly setAvailability: (value: string) => void;
}

interface StepFourProps {
  readonly category: string;
  readonly title: string;
  readonly description: string;
  readonly price: string;
  readonly duration: string;
  readonly location: string;
  readonly address: string;
  readonly availability: string;
  readonly notes: string;
}

interface CreateServiceProps {
  readonly navigation: any;
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'electricidad', label: 'Electricidad', icon: '⚡', description: 'Instalaciones y reparaciones eléctricas' },
  { id: 'plomeria', label: 'Plomería', icon: '🔧', description: 'Reparaciones de tuberías y grifería' },
  { id: 'carpinteria', label: 'Carpintería', icon: '🪚', description: 'Puertas, marcos y trabajos en madera' },
  { id: 'climatizacion', label: 'Climatización', icon: '🌬️', description: 'Aire acondicionado y calefacción' },
  { id: 'limpieza', label: 'Limpieza', icon: '🧹', description: 'Servicios de limpieza profunda' },
  { id: 'pintura', label: 'Pintura', icon: '🎨', description: 'Pintura de interiores y exteriores' },
];

const DURATION_OPTIONS: DurationOption[] = [
  { id: '1', label: 'Menos de 1 hora', value: '< 1h' },
  { id: '2', label: '1-2 horas', value: '1-2h' },
  { id: '3', label: '2-4 horas', value: '2-4h' },
  { id: '4', label: '4-8 horas', value: '4-8h' },
  { id: '5', label: 'Más de 8 horas', value: '> 8h' },
];

const AVAILABILITY_OPTIONS: AvailabilityOption[] = [
  { id: '1', label: 'Hoy', value: 'today' },
  { id: '2', label: 'Mañana', value: 'tomorrow' },
  { id: '3', label: 'Esta semana', value: 'this_week' },
  { id: '4', label: 'Próxima semana', value: 'next_week' },
  { id: '5', label: 'Por acordar', value: 'flexible' },
];

function CategoryItem({ item, category, onPress }: CategoryItemProps) {
  return (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        category === item.id && styles.categoryCardSelected,
      ]}
      onPress={() => onPress(item.id)}
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
  );
}

function DurationOption({ item, duration, onPress }: DurationOptionProps) {
  return (
    <TouchableOpacity
      style={[
        styles.optionCard,
        duration === item.value && styles.optionCardSelected,
      ]}
      onPress={() => onPress(item.value)}
    >
      <Text style={styles.optionLabel}>{item.label}</Text>
      {duration === item.value && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );
}

function AvailabilityOption({ item, availability, onPress }: AvailabilityOptionProps) {
  return (
    <TouchableOpacity
      style={[
        styles.optionCard,
        availability === item.value && styles.optionCardSelected,
      ]}
      onPress={() => onPress(item.value)}
    >
      <Text style={styles.optionLabel}>{item.label}</Text>
      {availability === item.value && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );
}

// Separator Components
function CategorySeparator() {
  return <View style={{ height: 12 }} />;
}

function OptionSeparator() {
  return <View style={{ height: 8 }} />;
}

export function StepOne(props: StepOneProps) {
  const { category, setCategory } = props;
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Selecciona la categoría de servicio</Text>
      <Text style={styles.stepDescription}>Elige el tipo de servicio que ofreces</Text>
      <FlatList
        data={SERVICE_CATEGORIES}
        renderItem={({ item }) => (
          <CategoryItem item={item} category={category} onPress={setCategory} />
        )}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={CategorySeparator}
      />
    </View>
  );
}

export function StepTwo(props: StepTwoProps) {
  const { title, description, price, duration, setField, setDuration } = props;

  const handleDurationPress = useCallback((value: string) => {
    setDuration(value);
    setField('duration', value);
  }, [setDuration, setField]);

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
            <DurationOption item={item} duration={duration} onPress={handleDurationPress} />
          )}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={OptionSeparator}
        />
      </View>
    </View>
  );
}

export function StepThree(props: StepThreeProps) {
  const { location, address, availability, notes, setField, setAvailability } = props;

  const handleAvailabilityPress = useCallback((value: string) => {
    setAvailability(value);
    setField('availability', value);
  }, [setAvailability, setField]);

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
            <AvailabilityOption
              item={item}
              availability={availability}
              onPress={handleAvailabilityPress}
            />
          )}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={OptionSeparator}
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

export function StepFour(props: StepFourProps) {
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

export default function CreateService({ navigation }: CreateServiceProps) {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState<FormData>({
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

  const updateFormField = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const validateStep1 = () => {
    if (!formData.category) {
      Alert.alert('Error', 'Por favor selecciona una categoría');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
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
  };

  const validateStep3 = () => {
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
  };

  const validateCurrentStep = () => {
    if (currentStep === 1) return validateStep1();
    if (currentStep === 2) return validateStep2();
    if (currentStep === 3) return validateStep3();
    return true;
  };

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

  const createService = async () => {
    try {
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
      console.error('Error creating service:', error);
      Alert.alert('Error', 'No se pudo crear el servicio. Por favor intenta nuevamente.');
    }
  };

  const handleSubmit = () => {
    Alert.alert(
      'Confirmar',
      '¿Deseas crear este servicio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            void createService();
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
            setCategory={(id: string) => updateFormField('category', id)}
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
        return <StepOne category={formData.category} setCategory={(id: string) => updateFormField('category', id)} />;
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
