// src/screens/admin/ReviewsManagementScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { adminService, ReviewManagement } from '../../services/admin.service';
import { LoadingView } from '../../components/common';
import { AdminStyles } from '../../styles/AdminScreens.style';

export default function ReviewsManagementScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reviews, setReviews] = useState<ReviewManagement[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ReviewManagement[]>([]);
  const [filterRating, setFilterRating] = useState<'ALL' | 1 | 2 | 3 | 4 | 5>('ALL');

  const loadData = async () => {
    try {
      const data = await adminService.getAllReviews();
      setReviews(data);
      setFilteredReviews(data);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'No se pudieron cargar reseñas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [filterRating, reviews]);

  const filterReviews = () => {
    let filtered = reviews;

    if (filterRating !== 'ALL') {
      filtered = filtered.filter(r => Math.floor(r.calificacion) === filterRating);
    }

    setFilteredReviews(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleDeleteReview = async (review: ReviewManagement) => {
    Alert.alert(
      'Eliminar Reseña',
      `¿Eliminar reseña de ${review.nombreCliente}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.deleteReview(review.idCalificacion, 'Eliminado por administrador');
              await adminService.logAdminAction(
                'REVIEW_DELETED',
                `Reseña ${review.idCalificacion} - Técnico: ${review.nombreTecnico}`
              );
              Alert.alert('Éxito', '✅ Reseña eliminada');
              loadData();
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'No se pudo eliminar la reseña');
            }
          },
        },
      ]
    );
  };

  const renderReview = ({ item }: { item: ReviewManagement }) => (
    <View style={AdminStyles.card}>
      <View style={AdminStyles.cardHeader}>
        <View style={AdminStyles.cardInfo}>
          <Text style={AdminStyles.title}>🔧 {item.nombreTecnico}</Text>
          <Text style={AdminStyles.subtitle}>👤 {item.nombreCliente}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>
            {renderStars(item.calificacion)}
          </Text>
          <Text style={styles.ratingNumber}>{item.calificacion.toFixed(1)}</Text>
        </View>
      </View>

      {item.comentario && (
        <View style={styles.commentContainer}>
          <Text style={styles.commentText}>{item.comentario}</Text>
        </View>
      )}

      <View style={styles.reviewFooter}>
        <Text style={styles.dateText}>
          📅 {new Date(item.fechaCalificacion).toLocaleDateString()}
        </Text>
        <TouchableOpacity
          style={[AdminStyles.actionBtn, AdminStyles.dangerBtn]}
          onPress={() => handleDeleteReview(item)}
        >
          <Text style={AdminStyles.actionBtnText}>🗑️ Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <LoadingView />;

  return (
    <View style={AdminStyles.container}>
      {/* Rating Filters */}
      <View style={AdminStyles.filterContainer}>
        {(['ALL', 5, 4, 3, 2, 1] as const).map(rating => (
          <TouchableOpacity
            key={rating}
            style={[
              AdminStyles.filterBtn,
              filterRating === rating && AdminStyles.filterBtnActive,
            ]}
            onPress={() => setFilterRating(rating)}
          >
            <Text style={[
              AdminStyles.filterBtnText,
              filterRating === rating && AdminStyles.filterBtnTextActive,
            ]}>
              {rating === 'ALL' ? 'Todas' : `${rating}⭐`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Review List */}
      <View style={AdminStyles.section}>
        <FlatList
          data={filteredReviews}
          renderItem={renderReview}
          keyExtractor={item => item.idCalificacion.toString()}
          contentContainerStyle={AdminStyles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={AdminStyles.emptyContainer}>
              <Text style={AdminStyles.emptyText}>No hay reseñas</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

function renderStars(rating: number): string {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  
  return '⭐'.repeat(fullStars) + 
         (halfStar ? '✨' : '') + 
         '☆'.repeat(emptyStars);
}

const styles = StyleSheet.create({
  ratingContainer: {
    alignItems: 'flex-end',
  },
  ratingText: {
    fontSize: 16,
    marginBottom: 2,
  },
  ratingNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F39C12',
  },
  commentContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  commentText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#95A5A6',
  },
});
