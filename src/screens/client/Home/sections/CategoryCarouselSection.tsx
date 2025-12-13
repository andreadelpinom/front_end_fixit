import React from 'react';
import { FlatList, View } from 'react-native';
import { ServiceType } from '../../../../services/home.service';
import { ThemedText } from '../../../../ui';
import { styles } from './CategoryCarouselSection.styles';

const keyExtractor = (item: ServiceType) => String(item.idTipoServicio);

const getInitials = (label: string) => {
  if (!label) return '';
  const [first] = label.trim().split(' ');
  return first?.slice(0, 2).toUpperCase() ?? '';
};

type CategoryCarouselSectionProps = {
  categories: ServiceType[];
  onPressCategory?: (category: ServiceType) => void;
};

export function CategoryCarouselSection({ categories, onPressCategory }: CategoryCarouselSectionProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="subtitle" style={styles.headerTitle}>
          Servicios populares
        </ThemedText>
      </View>

      <FlatList
        data={categories}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View
            style={styles.card}
            accessibilityRole="button"
            accessibilityLabel={item.nombre}
            onTouchEnd={() => onPressCategory?.(item)}
          >
            <View style={styles.iconPlaceholder}>
              <ThemedText variant="subtitle" color="inverse">
                {getInitials(item.nombre)}
              </ThemedText>
            </View>
            <ThemedText variant="body" style={styles.cardLabel}>
              {item.nombre}
            </ThemedText>
          </View>
        )}
      />
    </View>
  );
}
