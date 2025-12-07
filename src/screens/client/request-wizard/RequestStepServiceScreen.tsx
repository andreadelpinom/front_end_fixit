import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRequestDraft } from '../../../context/RequestContext';
import { homeService, ServiceType } from '../../../services/home.service';

export default function RequestStepServiceScreen({ navigation }: any): React.ReactElement {
  const { draft, updateDraft } = useRequestDraft();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    return () => { mounted = false; };
  }, []);

  if (loading) return (
    <View style={styles.container}><ActivityIndicator /></View>
  );

  if (error) return (
    <View style={styles.container}><Text>Error loading services</Text></View>
  );

  return (
    <View style={styles.container}>
      <ProgressBar step={1} total={5} />
      <Text style={styles.title}>Paso 1 de 5 - Selecciona servicio</Text>
      {services.map((s) => (
        <Button
          key={s.idTipoServicio}
          title={s.nombre + (draft.idTipoServicio === s.idTipoServicio ? ' ✓' : '')}
          onPress={() => updateDraft({ idTipoServicio: s.idTipoServicio })}
        />
      ))}

      <View style={{ height: 12 }} />
      <Button
        title="Siguiente"
        disabled={!draft.idTipoServicio}
        onPress={() => {
          if (!draft.idTipoServicio) {
            Alert.alert('Validación', 'Debe seleccionar un tipo de servicio para continuar');
            return;
          }
          navigation.navigate('RequestStepProblem');
        }}
      />
    </View>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <View style={{ height: 8, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
      <View style={{ width: `${pct}%`, height: '100%', backgroundColor: '#4caf50' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
});
