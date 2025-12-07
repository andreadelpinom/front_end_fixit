import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRequestDraft } from '../../../context/RequestContext';

export default function RequestStepProblemScreen({ navigation }: any): React.ReactElement {
  const { draft, updateDraft } = useRequestDraft();
  const [titulo, setTitulo] = useState(draft.tituloProblema ?? '');
  const [descripcion, setDescripcion] = useState(draft.descripcionProblema ?? '');

  useEffect(() => {
    return () => {
      // save when leaving
      updateDraft({ tituloProblema: titulo, descripcionProblema: descripcion });
    };
  }, [titulo, descripcion]);

  const valid = titulo.trim().length > 0 && (titulo.trim().length + descripcion.trim().length) >= 20;

  return (
    <View style={styles.container}>
      <ProgressBar step={2} total={5} />
      <Text style={styles.title}>Paso 2 de 5 - Describe el problema</Text>
      <TextInput placeholder="Título" value={titulo} onChangeText={setTitulo} style={styles.input} />
      <TextInput placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} style={[styles.input, { height: 100 }]} multiline />

      <View style={{ height: 12 }} />
      <Button title="Anterior" onPress={() => { updateDraft({ tituloProblema: titulo, descripcionProblema: descripcion }); navigation.goBack(); }} />
      <View style={{ height: 8 }} />
      <Button
        title="Siguiente"
        disabled={!valid}
        onPress={() => {
          updateDraft({ tituloProblema: titulo, descripcionProblema: descripcion });
          if (!valid) {
            Alert.alert('Validación', 'Título y descripción deben sumar al menos 20 caracteres');
            return;
          }
          navigation.navigate('RequestStepSchedule');
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
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 },
});
