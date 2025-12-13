import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
  number: number;
  label: string;
  color?: string;
}

export function StatCard({ number, label, color = '#007AFF' }: StatCardProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.number, { color }]}>{number}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  number: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  label: {
    fontSize: 13,
    color: '#6C757D',
    textAlign: 'center',
  },
});
