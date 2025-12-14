import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRequestDraft } from '../../../context/RequestContext';
import { homeService, ServiceType } from '../../../services/home.service';
import {
  WizardHeader,
  ProgressBar,
  BottomButtons,
  showCancelAlert,
  showValidationAlert,
  WIZARD_COLORS,
} from './WizardShared';

const STEP = 1;
const TOTAL_STEPS = 5;

export default function RequestStepServiceScreen({ navigation }: any): React.ReactElement {
  const { draft, updateDraft, resetDraft } = useRequestDraft();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load services on mount
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await homeService.getServiceTypes();
        console.log('Service types fetched', res);
        if (!mounted) return;
        setServices(res);
      } catch (e: any) {
        if (!mounted) return;
        setError(String(e?.message ?? e));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Handle cancel
  const handleCancel = useCallback(() => {
    showCancelAlert(() => {
      resetDraft();
      navigation.reset({
        index: 0,
        routes: [{ name: 'ClientRequests' }],
      });
    });
  }, [navigation, resetDraft]);

  // Handle next
  const handleNext = useCallback(() => {
    if (!draft.idTipoServicio) {
      showValidationAlert(
        'Debes seleccionar un tipo de servicio para continuar.'
      );
      return;
    }
    navigation.navigate('RequestStepProblem');
  }, [draft.idTipoServicio, navigation]);

  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <WizardHeader step={STEP} total={TOTAL_STEPS} onCancel={handleCancel} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={WIZARD_COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Render error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <WizardHeader step={STEP} total={TOTAL_STEPS} onCancel={handleCancel} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error cargando servicios</Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <WizardHeader step={STEP} total={TOTAL_STEPS} onCancel={handleCancel} />
      <ProgressBar step={STEP} total={TOTAL_STEPS} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.title}>¿Qué servicio necesitas?</Text>
          <Text style={styles.subtitle}>
            Selecciona el tipo de trabajo que requiere atención
          </Text>
        </View>

        <View style={styles.servicesContainer}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.idTipoServicio}
              style={[
                styles.serviceCard,
                draft.idTipoServicio === service.idTipoServicio &&
                  styles.serviceCardActive,
              ]}
              onPress={() => updateDraft({ idTipoServicio: service.idTipoServicio })}
            >
              <Text
                style={[
                  styles.serviceCardText,
                  draft.idTipoServicio === service.idTipoServicio &&
                    styles.serviceCardTextActive,
                ]}
              >
                {service.nombre}
              </Text>
              {draft.idTipoServicio === service.idTipoServicio && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <BottomButtons
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={!draft.idTipoServicio}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WIZARD_COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: WIZARD_COLORS.error,
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: WIZARD_COLORS.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: WIZARD_COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: WIZARD_COLORS.textSecondary,
    lineHeight: 20,
  },
  servicesContainer: {
    gap: 12,
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: WIZARD_COLORS.border,
    borderRadius: 8,
    backgroundColor: WIZARD_COLORS.white,
  },
  serviceCardActive: {
    borderColor: WIZARD_COLORS.primary,
    backgroundColor: '#E3F2FD',
  },
  serviceCardText: {
    flex: 1,
    fontSize: 15,
    color: WIZARD_COLORS.text,
    fontWeight: '500',
  },
  serviceCardTextActive: {
    color: WIZARD_COLORS.primary,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: WIZARD_COLORS.primary,
    fontWeight: '700',
    marginLeft: 12,
  },
});
