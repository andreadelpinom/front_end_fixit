import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface JobCardProps {
  title: string;
  description: string;
  cost: number;
  date: Date | string;
  status?: string;
  statusColor?: string;
  notes?: string;
  onComplete?: () => void;
  showCompleteButton?: boolean;
}

export function JobCard({
  title,
  description,
  cost,
  date,
  status,
  statusColor = '#28A745',
  notes,
  onComplete,
  showCompleteButton = false,
}: JobCardProps) {
  const formattedDate = typeof date === 'string' 
    ? new Date(date).toLocaleDateString() 
    : date.toLocaleDateString();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {status && (
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        )}
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>💰 ${cost.toFixed(2)}</Text>
        <Text style={styles.infoText}>📅 {formattedDate}</Text>
      </View>

      {notes && (
        <Text style={styles.notes}>📝 {notes}</Text>
      )}

      {showCompleteButton && onComplete && (
        <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
          <Text style={styles.buttonText}>✅ Marcar como completado</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
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
  notes: {
    fontSize: 13,
    color: '#868E96',
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 8,
  },
  completeButton: {
    backgroundColor: '#28A745',
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
