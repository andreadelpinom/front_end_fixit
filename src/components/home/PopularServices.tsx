import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { WIZARD_COLORS } from '../../screens/client/request-wizard/WizardShared';
import SectionTitle from './SectionTitle';

interface Service {
  id: number;
  name: string;
}

const PopularServices: React.FC = () => {
  const services: Service[] = [
    { id: 1, name: 'Electricidad' },
    { id: 2, name: 'Plomería' },
    { id: 3, name: 'Cerrajería' },
    { id: 4, name: 'Aire acondicionado' },
    { id: 5, name: 'Carpintería' },
    { id: 6, name: 'Pintura' },
  ];

  const renderService = (item: Service) => (
    <TouchableOpacity style={styles.serviceCard} activeOpacity={0.7}>
      <Text style={styles.serviceText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SectionTitle title="Servicios Populares" />
      <FlatList
        data={services}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => renderService(item)}
        scrollEnabled={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  serviceCard: {
    flex: 0.48,
    backgroundColor: WIZARD_COLORS.white,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    borderWidth: 1,
    borderColor: WIZARD_COLORS.border,
  },
  serviceText: {
    fontSize: 14,
    fontWeight: '600',
    color: WIZARD_COLORS.text,
    textAlign: 'center',
  },
});

export default PopularServices;
