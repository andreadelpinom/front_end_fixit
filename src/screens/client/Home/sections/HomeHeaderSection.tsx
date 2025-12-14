import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../../../ui';
import { theme } from '../../../../theme';
import { styles } from './HomeHeaderSection.styles';
import { LocationInfo } from '../useHomeClient';

type HomeHeaderSectionProps = {
  greeting: string;
  location: LocationInfo | null;
};

export function HomeHeaderSection({ greeting, location }: HomeHeaderSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.greetingRow}>
        <ThemedText variant="heading" style={styles.greetingText}>
          {greeting} <ThemedText variant="heading" style={styles.wave}>👋</ThemedText>
        </ThemedText>
        <ThemedText variant="caption" color="muted">
          ¿Qué servicio necesitas hoy?
        </ThemedText>
      </View>

      {location && (location.parroquia || location.canton) ? (
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={18} color={theme.colors.primary} />
          <View style={styles.locationTextContainer}>
            {location.parroquia ? (
              <ThemedText variant="body" style={styles.locationMainText}>
                {location.parroquia}
              </ThemedText>
            ) : null}
            {location.canton ? (
              <ThemedText variant="caption" color="muted">
                {location.canton}
              </ThemedText>
            ) : null}
          </View>
        </View>
      ) : null}

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={theme.colors.text.muted} style={styles.searchIcon} />
        <ThemedText variant="body" color="muted">
          Buscar servicio...
        </ThemedText>
      </View>
    </View>
  );
}
