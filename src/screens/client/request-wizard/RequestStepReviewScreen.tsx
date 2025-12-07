import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRequestDraft } from '../../../context/RequestContext';
import { apiClient } from '../../../services/api-client.service';
import { getApiUrl } from '../../../config/api.config';
import { homeService } from '../../../services/home.service';

export default function RequestStepReviewScreen({ navigation }: any): React.ReactElement {
  const { draft, resetDraft } = useRequestDraft();
  const [loading, setLoading] = useState(false);
  const [serviceName, setServiceName] = useState<string | null>(null);
  const [parroquiaName, setParroquiaName] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const services = await homeService.getServiceTypes();
        const found = services.find(s => s.idTipoServicio === draft.idTipoServicio);
        if (mounted && found) setServiceName(found.nombre);
      } catch (e) { /* ignore */ }
    })();

    (async () => {
      try {
        const parroquias = await homeService.getParroquias();
        const found = parroquias.find(p => p.codigoParroquia === draft.codigoParroquia);
        if (mounted && found) setParroquiaName(found.nombre);
      } catch (e) { /* ignore */ }
    })();

    return () => { mounted = false; };
  }, [draft.idTipoServicio, draft.codigoParroquia]);

  const publish = async () => {
    // Build payload according to frontend_dtos_generated CreateSolicitudDto
    // Ensure strings trimmed and fechaProgramada is ISO
    const payload: any = {
      idTipoServicio: draft.idTipoServicio!,
      codigoParroquia: String(draft.codigoParroquia ?? '').trim(),
      tituloProblema: String(draft.tituloProblema ?? '').trim(),
      descripcionProblema: String(draft.descripcionProblema ?? '').trim(),
      fechaProgramada: draft.fechaProgramada ? new Date(draft.fechaProgramada).toISOString() : undefined,
    };

    setLoading(true);
    try {
      const resp = await apiClient.post(getApiUrl('/request/solicitudes'), payload);
      console.log('Create solicitud response', resp);
      // resp may be envelope or unwrapped
      const anyResp = resp as any;
      if (anyResp && anyResp.success === false) {
        const errMsg = anyResp.error || anyResp.message || 'Error al crear solicitud';
        Alert.alert('Error', String(errMsg));
        setLoading(false);
        return;
      }

      // success
      resetDraft();
      // navigate back to client requests list and reset the stack
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paso 5 de 5 - Revisar</Text>
      <Text>Servicio: {serviceName ?? draft.idTipoServicio ?? '-'}</Text>
      <Text>Parroquia: {parroquiaName ?? draft.codigoParroquia ?? '-'}</Text>
      <Text>Título: {draft.tituloProblema ?? '-'}</Text>
      <Text>Descripción: {draft.descripcionProblema ?? '-'}</Text>
      <Text>Fecha programada: {draft.fechaProgramada ?? '-'}</Text>
      <Text>Duración (min): {draft.duracionEstimadaMin ?? '-'}</Text>

      <View style={{ height: 12 }} />
      <Button title="Anterior" onPress={() => navigation.goBack()} />
      <View style={{ height: 8 }} />
      {loading ? <ActivityIndicator /> : <Button title="Publicar solicitud" onPress={publish} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
});
