import React from 'react';
import { ScrollView } from 'react-native';
import PopularServicesSection from '../../components/home/PopularServicesSection';
import CategoriesSection from '../../components/home/CategoriesSection';
import TopTechniciansSection from '../../components/home/TopTechniciansSection';
import UrgentHelpSection from '../../components/home/UrgentHelpSection';
import MotivationalMessageSection from '../../components/home/MotivationalMessageSection';
import RecentRequestsSection from '../../components/home/RecentRequestsSection';

export default function HomeScreen(): React.ReactElement {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <PopularServicesSection />
      <CategoriesSection />
      <TopTechniciansSection />
      <UrgentHelpSection />
      <MotivationalMessageSection />
      <RecentRequestsSection />
    </ScrollView>
  );
}
