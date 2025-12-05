import React from 'react';
import { View, Text } from 'react-native';

export default function MotivationalMessageSection(): React.ReactElement {
  // Simple mock motivational message for now
  const message = 'Encuentra profesionales confiables en minutos. ¡Tú puedes hacerlo!';

  return (
    <View>
      <Text style={{ fontSize: 16, fontWeight: '600', marginVertical: 8 }}>Motivational</Text>
      <Text>{message}</Text>
    </View>
  );
}
