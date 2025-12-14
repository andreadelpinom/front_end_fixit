import React from 'react';
import { View } from 'react-native';
import { useTechnicianProposals } from './useTechnicianProposals';
import { TechnicianProposalsListSection } from './sections/TechnicianProposalsListSection';
import { ThemedText } from '../../../ui';
import { styles } from './TechnicianProposalsScreen.styles';

export default function TechnicianProposalsScreen() {
  const {
    proposals,
    loading,
    refreshing,
    error,
    onRefresh,
    viewRequestDetail,
  } = useTechnicianProposals();

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText variant="body" color="error" style={styles.errorText}>
          ⚠️ {error}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TechnicianProposalsListSection
        proposals={proposals}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onViewRequestDetail={viewRequestDetail}
      />
    </View>
  );
}