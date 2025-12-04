import React from 'react';
import { View, Text } from 'react-native';

export default function PopularServicesSection(): React.ReactElement {
  const services = [
    'Plomería',
    'Electricidad',
    'Cerrajería',
    'Aire acondicionado',
  ];

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Popular Services</Text>
      {services.map((s) => (
        <Text key={s}>- {s}</Text>
      ))}
    </View>
  );
}
