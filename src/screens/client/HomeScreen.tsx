import React from 'react';
import { ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { WIZARD_COLORS } from './request-wizard/WizardShared';

// Components
import HomeHeader from '../../components/home/HomeHeader';
import HomeSearch from '../../components/home/HomeSearch';
import PopularServices from '../../components/home/PopularServices';
import TopTechnicians from '../../components/home/TopTechnicians';
import UrgentBanner from '../../components/home/UrgentBanner';
import RecentActivity from '../../components/home/RecentActivity';

export default function HomeScreen(): React.ReactElement {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Header */}
        <HomeHeader />

        {/* Search */}
        <HomeSearch />

        {/* Popular Services */}
        <PopularServices />

        {/* Top Technicians */}
        <TopTechnicians />

        {/* Urgent Banner */}
        <UrgentBanner />

        {/* Recent Activity */}
        <RecentActivity />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WIZARD_COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
});
