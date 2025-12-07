import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRequestDraft } from '../../../context/RequestContext';
import { apiClient } from '../../../services/api-client.service';
import { getApiUrl } from '../../../config/api.config';
import { homeService } from '../../../services/home.service';
import {
  WizardHeader,
  ProgressBar,
  BottomButtons,
  showCancelAlert,
  WIZARD_COLORS,
} from './WizardShared';

const STEP = 5;
const TOTAL_STEPS = 5;

// Helper to format date for display
const formatDateForDisplay = (isoString?: string): string => {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${d}/${m}/${y} ${h}:${min}`;
  } catch {
    return isoString;
  }
};

export default function RequestStepReviewScreen({ navigation }: any): React.ReactElement {
  const { draft, resetDraft } = useRequestDraft();
  const [loading, setLoading] = useState(false);
  const [serviceName, setServiceName] = useState<string | null>(null);
  const [parroquiaName, setParroquiaName] = useState<string | null>(null);

  // Load service and parroquia names
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const services = await homeService.getServiceTypes();
        const found = services.find(
          (s) => s.idTipoServicio === draft.idTipoServicio
        );
        if (mounted && found) setServiceName(found.nombre);
      } catch (e) {
        /* ignore */
      }
    })();

    (async () => {
      try {
        const parroquias = await homeService.getParroquias();
        const found = parroquias.find(
          (p) => p.codigoParroquia === draft.codigoParroquia
        );
        if (mounted && found) setParroquiaName(found.nombre);
      } catch (e) {
        /* ignore */
      }
    })();

    return () => {
      mounted = false;
    };
  }, [draft.idTipoServicio, draft.codigoParroquia]);

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

  // Publish solicitud
  const handlePublish = useCallback(async () => {
    const payload: any = {
      idTipoServicio: draft.idTipoServicio!,
      codigoParroquia: String(draft.codigoParroquia ?? '').trim(),
      tituloProblema: String(draft.tituloProblema ?? '').trim(),
      descripcionProblema: String(draft.descripcionProblema ?? '').trim(),
      fechaProgramada: draft.fechaProgramada
        ? new Date(draft.fechaProgramada).toISOString()
        : undefined,
    };

    setLoading(true);
    try {
      const resp = await apiClient.post(getApiUrl('/request/solicitudes'), payload);
      console.log('Create solicitud response', resp);

      const anyResp = resp as any;
      if (anyResp && anyResp.success === false) {
        const errMsg =
          anyResp.error || anyResp.message || 'Error al crear solicitud';
        Alert.alert('Error', String(errMsg));
        setLoading(false);
        return;
      }

      // Success: reset draft and navigate back
      resetDraft();
      const parent = navigation.getParent?.();
      if (parent) {
        parent.reset({
          index: 0,
          routes: [{ name: 'ClientRequests' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'ClientRequests' }],
        });
      }
    } catch (e: any) {
      console.error('Publish error', e);
      const msg = e?.message ?? 'Error al crear solicitud';
      Alert.alert('Error', String(msg));
      setLoading(false);
    }
  }, [draft, resetDraft, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <WizardHeader step={STEP} total={TOTAL_STEPS} onCancel={handleCancel} />
      <ProgressBar step={STEP} total={TOTAL_STEPS} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.title}>Revisa tu solicitud</Text>
          <Text style={styles.subtitle}>
            Verifica que todos los datos sean correctos antes de publicar
          </Text>
        </View>

        {/* Review Cards */}
        <View style={styles.reviewCard}>
          <Text style={styles.reviewLabel}>Tipo de Servicio</Text>
          <Text style={styles.reviewValue}>
            {serviceName ?? draft.idTipoServicio ?? '-'}
          </Text>
        </View>

        <View style={styles.reviewCard}>
          <Text style={styles.reviewLabel}>Parroquia</Text>
          <Text style={styles.reviewValue}>
            {parroquiaName ?? draft.codigoParroquia ?? '-'}
          </Text>
        </View>

        <View style={styles.reviewCard}>
          <Text style={styles.reviewLabel}>Título</Text>
          <Text style={styles.reviewValue}>
            {draft.tituloProblema ?? '-'}
          </Text>
        </View>

        <View style={styles.reviewCard}>
          <Text style={styles.reviewLabel}>Descripción</Text>
          <Text style={[styles.reviewValue, styles.descriptionValue]}>
            {draft.descripcionProblema ?? '-'}
          </Text>
        </View>

        {draft.fechaProgramada && (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewLabel}>Fecha y Hora Programada</Text>
            <Text style={styles.reviewValue}>
              {formatDateForDisplay(draft.fechaProgramada)}
            </Text>
          </View>
        )}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ✓ Revisa todos los datos cuidadosamente
          </Text>
          <Text style={styles.infoText}>
            ✓ Si necesitas cambiar algo, usa el botón "Anterior"
          </Text>
          <Text style={styles.infoText}>
            ✓ Al publicar, el técnico recibirá tu solicitud
          </Text>
        </View>
      </ScrollView>

      <BottomButtons
        onPrevious={() => navigation.goBack()}
        onNext={handlePublish}
        nextLabel="Publicar solicitud"
        nextLoading={loading}
        nextDisabled={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WIZARD_COLORS.background,
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
  reviewCard: {
    backgroundColor: WIZARD_COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: WIZARD_COLORS.border,
  },
  reviewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: WIZARD_COLORS.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reviewValue: {
    fontSize: 15,
    fontWeight: '500',
    color: WIZARD_COLORS.text,
  },
  descriptionValue: {
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: WIZARD_COLORS.success,
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
});
