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
import { homeService, Parroquia } from '../../../services/home.service';
import {
  WizardHeader,
  ProgressBar,
  BottomButtons,
  showCancelAlert,
  showValidationAlert,
  WIZARD_COLORS,
} from './WizardShared';

const STEP = 4;
const TOTAL_STEPS = 5;

export default function RequestStepAddressScreen({ navigation }: any): React.ReactElement {
  const { draft, updateDraft, resetDraft } = useRequestDraft();
  const [parroquias, setParroquias] = useState<Parroquia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load parroquias on mount
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await homeService.getParroquias();
        console.log('Parroquias fetched', res);
        if (!mounted) return;
        setParroquias(res);
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
    if (!draft.codigoParroquia) {
      showValidationAlert('Debes seleccionar una parroquia para continuar.');
      return;
    }
    navigation.navigate('RequestStepReview');
  }, [draft.codigoParroquia, navigation]);

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
          <Text style={styles.errorText}>Error cargando parroquias</Text>
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
          <Text style={styles.title}>¿Dónde necesitas atención?</Text>
          <Text style={styles.subtitle}>
            Selecciona la parroquia donde se realizará el trabajo
          </Text>
        </View>

        <View style={styles.parroquiasContainer}>
          {parroquias.map((parroquia) => (
            <TouchableOpacity
              key={parroquia.codigoParroquia}
              style={[
                styles.parroquiaCard,
                draft.codigoParroquia === parroquia.codigoParroquia &&
                  styles.parroquiaCardActive,
              ]}
              onPress={() => updateDraft({ codigoParroquia: parroquia.codigoParroquia })}
            >
              <Text
                style={[
                  styles.parroquiaCardText,
                  draft.codigoParroquia === parroquia.codigoParroquia &&
                    styles.parroquiaCardTextActive,
                ]}
              >
                {parroquia.nombre}
              </Text>
              {draft.codigoParroquia === parroquia.codigoParroquia && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <BottomButtons
        onPrevious={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={!draft.codigoParroquia}
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
  parroquiasContainer: {
    gap: 12,
  },
  parroquiaCard: {
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
  parroquiaCardActive: {
    borderColor: WIZARD_COLORS.primary,
    backgroundColor: '#E3F2FD',
  },
  parroquiaCardText: {
    flex: 1,
    fontSize: 15,
    color: WIZARD_COLORS.text,
    fontWeight: '500',
  },
  parroquiaCardTextActive: {
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
