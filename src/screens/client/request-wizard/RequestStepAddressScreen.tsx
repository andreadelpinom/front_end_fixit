import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useRequestDraft } from '../../../context/RequestContext';
import { homeService, Parroquia } from '../../../services/home.service';

export default function RequestStepAddressScreen({ navigation }: any): React.ReactElement {
  const { draft, updateDraft } = useRequestDraft();
  const [parroquias, setParroquias] = useState<Parroquia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return () => { mounted = false; };
  }, []);

  if (loading) return (
    <View style={styles.container}><ActivityIndicator /></View>
  );

  if (error) return (
    <View style={styles.container}><Text>Error loading parroquias</Text></View>
  );

  const valid = !!draft.codigoParroquia;

  return (
    <View style={styles.container}>
      <ProgressBar step={4} total={5} />
      <Text style={styles.title}>Paso 4 de 5 - Selecciona parroquia</Text>
      {parroquias.map((p) => (
        <TouchableOpacity key={p.codigoParroquia} style={{ paddingVertical: 6 }} onPress={() => updateDraft({ codigoParroquia: p.codigoParroquia })}>
          <Text>{p.nombre} {draft.codigoParroquia === p.codigoParroquia ? '✓' : ''}</Text>
        </TouchableOpacity>
      ))}

      <View style={{ height: 12 }} />
      <Button title="Anterior" onPress={() => navigation.goBack()} />
      <View style={{ height: 8 }} />
      <Button
        title="Siguiente"
        disabled={!valid}
        onPress={() => {
          if (!valid) {
            Alert.alert('Validación', 'Debe seleccionar una parroquia');
            return;
          }
          navigation.navigate('RequestStepReview');
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
