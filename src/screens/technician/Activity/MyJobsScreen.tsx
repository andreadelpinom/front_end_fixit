import React, { useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMyJobs, JobTab } from './useMyJobs';
import { TechnicianJobsTabsSection } from './sections/TechnicianJobsTabsSection';
import { TechnicianJobsListSection } from './sections/TechnicianJobsListSection';
import { TechnicianRatingStats } from './sections/TechnicianRatingStats';
import { ThemedText } from '../../../ui';
import { theme } from '../../../theme';
import { styles } from './MyJobsScreen.styles';

type Props = NativeStackScreenProps<any>;

export default function MyJobsScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<JobTab>('EN_CURSO');
  const {
    proposals,
    loading,
    refreshing,
    error,
    onRefresh,
    getFilteredProposals,
    cancelJob,
  } = useMyJobs();

  const filteredProposals = getFilteredProposals(activeTab);
  const enCursoCount = proposals.filter(p => p.estadoAcuerdo === 'ACEPTADO').length;

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
      <TechnicianJobsTabsSection
        activeTab={activeTab}
        onTabChange={setActiveTab}
        enCursoCount={enCursoCount}
      />

      {activeTab === 'HISTORIAL' && (
        <TechnicianRatingStats proposals={filteredProposals} />
      )}

      <TechnicianJobsListSection
        proposals={filteredProposals}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        activeTab={activeTab}
        navigation={navigation}
        onCancelJob={cancelJob}
      />
    </View>
  );
}