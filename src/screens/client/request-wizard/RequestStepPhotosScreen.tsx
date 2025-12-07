import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRequestDraft } from '../../../context/RequestContext';

export default function RequestStepPhotosScreen({ navigation }: any): React.ReactElement {
  const { updateDraft } = useRequestDraft();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paso 3 de 6 - Fotos (Próximamente)</Text>
      <Text>Próximamente podrás subir fotos</Text>

      <View style={{ height: 12 }} />
      <Button title="Anterior" onPress={() => navigation.goBack()} />
      <View style={{ height: 8 }} />
      <Button title="Siguiente" onPress={() => navigation.navigate('RequestStepSchedule')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
});
