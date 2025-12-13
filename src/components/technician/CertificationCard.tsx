import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CertificationCardProps {
  name: string;
  description?: string;
  status?: 'AVAILABLE' | 'ACTIVE' | 'PENDING';
  expirationDate?: Date | string;
  onApply?: () => void;
}

export function CertificationCard({
  name,
  description,
  status = 'AVAILABLE',
  expirationDate,
  onApply,
}: CertificationCardProps) {
  const formattedDate = expirationDate 
    ? (typeof expirationDate === 'string' 
        ? new Date(expirationDate).toLocaleDateString() 
        : expirationDate.toLocaleDateString())
    : null;

  const isAvailable = status === 'AVAILABLE';
  const isActive = status === 'ACTIVE';

  return (
    <View style={[
      styles.card,
      isActive && styles.activeCard,
    ]}>
      <View style={styles.content}>
        <Text style={styles.name}>
          {isActive ? '✅' : '🏆'} {name}
        </Text>
        
        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}

        {isActive && formattedDate && (
          <Text style={styles.date}>
            Vence: {formattedDate}
          </Text>
        )}

        {isActive && !expirationDate && (
          <Text style={styles.status}>Estado: ACTIVA</Text>
        )}
      </View>

      {isAvailable && onApply && (
        <TouchableOpacity style={styles.applyButton} onPress={onApply}>
          <Text style={styles.applyButtonText}>Solicitar</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeCard: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#6C757D',
    marginTop: 4,
    lineHeight: 18,
  },
  status: {
    fontSize: 13,
    color: '#28A745',
    fontWeight: '500',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 4,
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
