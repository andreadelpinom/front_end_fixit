import React from 'react';
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { useHomeClient } from './useHomeClient';
import { styles } from './HomeClientScreen.styles';
import { HomeHeaderSection } from './sections/HomeHeaderSection';
import { ServiceStatusSection } from './sections/ServiceStatusSection';
import { PrimaryActionSection } from './sections/PrimaryActionSection';
import { CategoryCarouselSection } from './sections/CategoryCarouselSection';
import { TopTechniciansSection } from './sections/TopTechniciansSection';
import { EmptyStateIllustrationSection } from './sections/EmptyStateIllustrationSection';
import { ThemedText, ThemedView } from '../../../ui';
import { theme } from '../../../theme';
import { useNavigation } from '@react-navigation/native';

export default function HomeClientScreen(): React.ReactElement {
  const navigation = useNavigation();
  const {
    greetingName,
    location,
    serviceState,
    categories,
    technicians,
    loading,
    refreshing,
    error,
    onRefresh,
    onPrimaryAction,
  } = useHomeClient(navigation);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <ThemedText variant="body" color="muted" style={styles.loaderText}>
            Cargando tu dashboard...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.contentContainer}
      >
        <HomeHeaderSection greeting={greetingName} location={location} />

        <ServiceStatusSection state={serviceState} />

        <PrimaryActionSection
          variant={serviceState.variant}
          onPress={onPrimaryAction}
          disabled={serviceState.variant === 'WAITING'}
        />

        {serviceState.variant === 'EMPTY' ? (
          <EmptyStateIllustrationSection visible />
        ) : null}

        {error ? (
          <ThemedView variant="surface" style={styles.errorBanner}>
            <ThemedText variant="body" color="error" style={styles.errorText}>
              {error}
            </ThemedText>
          </ThemedView>
        ) : null}

        <CategoryCarouselSection categories={categories} />

        <TopTechniciansSection technicians={technicians} />
      </ScrollView>
    </SafeAreaView>
  );
}
