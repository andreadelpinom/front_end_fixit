import React, { useEffect } from 'react';
import { ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WIZARD_COLORS } from './request-wizard/WizardShared';

// Components
import HomeHeader from '../../components/home/HomeHeader';
import HomeSearch from '../../components/home/HomeSearch';
import PopularServices from '../../components/home/PopularServices';
import TopTechnicians from '../../components/home/TopTechnicians';
import UrgentBanner from '../../components/home/UrgentBanner';
import RecentActivity from '../../components/home/RecentActivity';
import { NotificationBell } from '../../components/NotificationBell';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function HomeScreen({ navigation }: HomeScreenProps): React.ReactElement {
  // Configurar el header con el NotificationBell
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <NotificationBell navigation={navigation} />,
    });
  }, [navigation]);

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
