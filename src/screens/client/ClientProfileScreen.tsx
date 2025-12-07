import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ClientProfileScreen(): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil (placeholder)</Text>
      <Text>Detalles del usuario irán aquí.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
});
