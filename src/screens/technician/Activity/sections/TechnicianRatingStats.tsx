import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '../../../../ui';

interface TechnicianRatingStatsProps {
  proposals: any[];
}

export const TechnicianRatingStats: React.FC<TechnicianRatingStatsProps> = ({ proposals }) => {
  // Filter completed jobs with ratings
  const completedJobsWithRatings = proposals.filter(
    p => p.calificacion && p.estadoAcuerdo === 'ACEPTADO' && p.fechaConfirmada
  );

  if (completedJobsWithRatings.length === 0) {
    return null;
  }

  // Calculate statistics
  const ratings = completedJobsWithRatings.map(p => p.calificacion!.calificacion);
  const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  const totalRatings = ratings.length;

  // Count ratings by star
  const ratingCounts = [1, 2, 3, 4, 5].map(star =>
    ratings.filter(rating => rating === star).length
  );

  const renderStars = (rating: number, size: number = 14) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <ThemedText
          key={i}
          variant="caption"
          style={[styles.star, { fontSize: size }, i <= rating && styles.starFilled]}
        >
          ★
        </ThemedText>
      );
    }
    return stars;
  };

  return (
    <ThemedView variant="surface" style={styles.container}>
      <ThemedText variant="h3" style={styles.title}>
        📊 Estadísticas de Calificaciones
      </ThemedText>

      <View style={styles.statsContainer}>
        <View style={styles.averageContainer}>
          <ThemedText variant="h2" style={styles.averageRating}>
            {averageRating.toFixed(1)}
          </ThemedText>
          <View style={styles.starsRow}>
            {renderStars(Math.round(averageRating), 16)}
          </View>
          <ThemedText variant="caption" color="muted" style={styles.totalRatings}>
            Basado en {totalRatings} calificaciones
          </ThemedText>
        </View>

        <View style={styles.breakdownContainer}>
          {[5, 4, 3, 2, 1].map(star => (
            <View key={star} style={styles.ratingRow}>
              <ThemedText variant="caption" style={styles.starNumber}>
                {star}
              </ThemedText>
              <ThemedText variant="caption" style={[styles.star, styles.starFilled]}>
                ★
              </ThemedText>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(ratingCounts[star - 1] / totalRatings) * 100}%` }
                  ]}
                />
              </View>
              <ThemedText variant="caption" style={styles.ratingCount}>
                {ratingCounts[star - 1]}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  averageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  averageRating: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  totalRatings: {
    textAlign: 'center',
  },
  breakdownContainer: {
    flex: 1,
    marginLeft: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  starNumber: {
    width: 12,
    textAlign: 'center',
    marginRight: 4,
  },
  star: {
    color: '#DDD',
    marginRight: 4,
  },
  starFilled: {
    color: '#FFD700',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginHorizontal: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  ratingCount: {
    width: 20,
    textAlign: 'right',
    color: '#666',
  },
});