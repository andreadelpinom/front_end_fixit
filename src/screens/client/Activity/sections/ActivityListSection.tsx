import React from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientActivityItem } from '../useClientActivity';
import { activityListStyles as styles } from './ActivityListSection.styles';
import { theme } from '../../../../theme';

type ActivityListSectionProps = {
  services: ClientActivityItem[];
  refreshing: boolean;
  onRefresh: () => void;
  onServicePress: (service: ClientActivityItem) => void;
  emptyComponent: React.ReactElement | null;
};

const STATUS_LABEL = 'Completado';

export const ActivityListSection: React.FC<ActivityListSectionProps> = ({
  services,
  refreshing,
  onRefresh,
  onServicePress,
  emptyComponent,
}) => {
  const renderItem = ({ item }: { item: ClientActivityItem }) => (
    <Pressable
      onPress={() => onServicePress(item)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{STATUS_LABEL}</Text>
        </View>
      </View>

      {item.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}

      <View style={styles.metaRow}>
        <View style={[styles.metaItem, styles.metaItemGrow]}>
          <Ionicons name="location-outline" size={16} color={theme.colors.text.muted} />
          <Text style={styles.metaText} numberOfLines={1}>
            {item.locationLabel}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.text.muted} />
          <Text style={styles.metaText}>{item.completedAtLabel}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      data={services}
      keyExtractor={service => String(service.idSolicitud)}
      renderItem={renderItem}
      contentContainerStyle={[
        styles.listContent,
        services.length === 0 && styles.listContentEmpty,
      ]}
      ListEmptyComponent={emptyComponent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
        />
      }
    />
  );
};
