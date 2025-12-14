import React from 'react';
import { FlatList, View } from 'react-native';
import { TechPreview } from '../../../../services/home.service';
import { ThemedText } from '../../../../ui';
import { styles } from './TopTechniciansSection.styles';

const keyExtractor = (item: TechPreview) => String(item.idTecnico ?? item.id);

const getInitials = (label: string) => {
  if (!label) return '';
  const parts = label.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
};

type TopTechniciansSectionProps = {
  technicians: TechPreview[];
};

export function TopTechniciansSection({ technicians }: TopTechniciansSectionProps) {
  if (!technicians || technicians.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="subtitle" style={styles.headerTitle}>
          Técnicos destacados
        </ThemedText>
      </View>

      <FlatList
        horizontal
        data={technicians}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatarPlaceholder}>
              <ThemedText variant="subtitle" color="inverse">
                {getInitials(item.nombres ?? '')}
              </ThemedText>
            </View>
            <ThemedText variant="body" style={styles.name}>
              {item.nombres}
            </ThemedText>
            {item.rating ? (
              <ThemedText variant="caption" color="muted">
                {item.rating.toFixed(1)} ★
              </ThemedText>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}
