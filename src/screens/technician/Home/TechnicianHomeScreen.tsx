import React from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, View, TouchableOpacity } from 'react-native';
import { useTechnicianHome } from './useTechnicianHome';
import { TechnicianVerificationBanner } from './sections/TechnicianVerificationBanner';
import { TechnicianStatusSection } from './sections/TechnicianStatusSection';
import { TechnicianPrimaryActionSection } from './sections/TechnicianPrimaryActionSection';
import { TechnicianStatsSection } from './sections/TechnicianStatsSection';
import { TechnicianProfileCompletionSection } from './sections/TechnicianProfileCompletionSection';
import { ThemedText } from '../../../ui';
import { theme } from '../../../theme';
import { styles } from './TechnicianHomeScreen.styles';

export default function TechnicianHomeScreen({ navigation }: any) {
  const {
    technician,
    stats,
    loading,
    refreshing,
    error,
    mainStatus,
    isNotVerified,
    onRefresh,
    loadData,
  } = useTechnicianHome(navigation);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <ThemedText variant="body" color="muted" style={styles.loadingText}>
          Cargando...
        </ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText variant="body" color="error" style={styles.errorText}>
          ⚠️ {error}
        </ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <ThemedText variant="button" color="inverse" style={styles.retryButtonText}>
            Reintentar
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <TechnicianVerificationBanner visible={!!isNotVerified} />

      <TechnicianStatusSection mainStatus={mainStatus} />

      <TechnicianPrimaryActionSection cta={mainStatus.cta} />

      <TechnicianStatsSection stats={stats} />

      <TechnicianProfileCompletionSection
        visible={!!technician}
        onPress={() => navigation.navigate('Profile')}
      />
    </ScrollView>
  );
}