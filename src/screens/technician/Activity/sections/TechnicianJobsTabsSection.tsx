import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '../../../../ui';
import { JobTab } from '../useMyJobs';

interface TechnicianJobsTabsSectionProps {
  activeTab: JobTab;
  onTabChange: (tab: JobTab) => void;
  enCursoCount: number;
}

export const TechnicianJobsTabsSection: React.FC<TechnicianJobsTabsSectionProps> = ({
  activeTab,
  onTabChange,
  enCursoCount,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'EN_CURSO' && styles.tabActive]}
        onPress={() => onTabChange('EN_CURSO')}
      >
        <ThemedText
          variant="button"
          color={activeTab === 'EN_CURSO' ? 'inverse' : 'muted'}
          style={styles.tabText}
        >
          En curso ({enCursoCount})
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'HISTORIAL' && styles.tabActive]}
        onPress={() => onTabChange('HISTORIAL')}
      >
        <ThemedText
          variant="button"
          color={activeTab === 'HISTORIAL' ? 'inverse' : 'muted'}
          style={styles.tabText}
        >
          Historial
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
});