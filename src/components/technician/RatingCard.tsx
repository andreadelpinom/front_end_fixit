import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RatingCardProps {
  serviceName: string;
  rating: number;
  comment?: string;
  clientName?: string;
  date: Date | string;
}

export function RatingCard({
  serviceName,
  rating,
  comment,
  clientName,
  date,
}: RatingCardProps) {
  const formattedDate = typeof date === 'string' 
    ? new Date(date).toLocaleDateString() 
    : date.toLocaleDateString();

  const renderStars = (score: number) => {
    return '⭐'.repeat(Math.round(score)) + '☆'.repeat(5 - Math.round(score));
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{serviceName}</Text>
        <Text style={styles.stars}>{renderStars(rating)}</Text>
      </View>

      <Text style={styles.score}>{rating.toFixed(1)} / 5.0</Text>

      {comment && (
        <Text style={styles.comment}>💬 "{comment}"</Text>
      )}

      <View style={styles.footer}>
        {clientName && (
          <Text style={styles.clientName}>👤 {clientName}</Text>
        )}
        <Text style={styles.date}>📅 {formattedDate}</Text>
      </View>
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
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
  },
  stars: {
    fontSize: 16,
    marginLeft: 8,
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFC107',
    marginBottom: 8,
  },
  comment: {
    fontSize: 14,
    color: '#495057',
    fontStyle: 'italic',
    marginVertical: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  clientName: {
    fontSize: 12,
    color: '#6C757D',
  },
  date: {
    fontSize: 12,
    color: '#868E96',
  },
});
