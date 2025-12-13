import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface RequestCardProps {
  title: string;
  description: string;
  cost?: number | string;
  duration?: number;
  location?: string;
  date: Date | string;
  onAction?: () => void;
  actionLabel?: string;
  showAction?: boolean;
}

export function RequestCard({
  title,
  description,
  cost,
  duration,
  location,
  date,
  onAction,
  actionLabel = '📤 Enviar Propuesta',
  showAction = true,
}: RequestCardProps) {
  const formattedDate = typeof date === 'string' 
    ? new Date(date).toLocaleDateString() 
    : date.toLocaleDateString();

  const formattedCost = typeof cost === 'string' 
    ? cost 
    : cost?.toFixed(2) || 'N/A';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>💰 ${formattedCost}</Text>
        {duration && (
          <Text style={styles.infoText}>⏱️ {duration} min</Text>
        )}
      </View>

      <View style={styles.infoRow}>
        {location && (
          <Text style={styles.infoSmall}>📍 {location}</Text>
        )}
        <Text style={styles.infoSmall}>📅 {formattedDate}</Text>
      </View>

      {showAction && onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#212529',
  },
  description: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 12,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  infoSmall: {
    fontSize: 12,
    color: '#868E96',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
