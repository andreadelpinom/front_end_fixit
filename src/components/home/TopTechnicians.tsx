import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { homeService, TechPreview } from '../../services/home.service';
import { WIZARD_COLORS } from '../../screens/client/request-wizard/WizardShared';
import SectionTitle from './SectionTitle';

const TopTechnicians: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [techs, setTechs] = useState<TechPreview[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await homeService.getTopRatedTechs(6);
        if (mounted) {
          setTechs(data);
        }
      } catch (err) {
        if (mounted) {
          setError('No se pudieron cargar los técnicos');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const renderTech = (item: TechPreview) => (
    <View style={styles.techCard}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>
          {item.nombres?.charAt(0).toUpperCase() || '?'}
        </Text>
      </View>
      <Text style={styles.techName} numberOfLines={1}>
        {item.nombres}
      </Text>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>⭐ {item.rating || 5.0}</Text>
      </View>
      {item.distanceKm && (
        <Text style={styles.distanceText}>{item.distanceKm} km</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <SectionTitle title="Técnicos Top Rated" />
        <ActivityIndicator size="large" color={WIZARD_COLORS.primary} />
      </View>
    );
  }

  if (error || techs.length === 0) {
    return (
      <View style={styles.container}>
        <SectionTitle title="Técnicos Top Rated" />
        <Text style={styles.emptyText}>
          {error || 'No hay técnicos disponibles'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionTitle title="Técnicos Top Rated" />
      <FlatList
        data={techs}
        keyExtractor={(item) => String(item.idTecnico)}
        renderItem={({ item }) => renderTech(item)}
        scrollEnabled={false}
        numColumns={3}
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
  techCard: {
    flex: 0.31,
    backgroundColor: WIZARD_COLORS.white,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: WIZARD_COLORS.border,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: WIZARD_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: WIZARD_COLORS.white,
  },
  techName: {
    fontSize: 12,
    fontWeight: '600',
    color: WIZARD_COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  ratingContainer: {
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 11,
    color: WIZARD_COLORS.text,
    fontWeight: '500',
  },
  distanceText: {
    fontSize: 10,
    color: WIZARD_COLORS.textSecondary,
  },
  emptyText: {
    fontSize: 14,
    color: WIZARD_COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default TopTechnicians;
