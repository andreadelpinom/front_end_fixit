import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ClientServicesTab } from '../useClientServices';
import { servicesTabsStyles as styles } from './ServicesTabsSection.styles';

type TabItem = {
  key: ClientServicesTab;
  label: string;
  count?: number;
};

type ServicesTabsSectionProps = {
  tabs: TabItem[];
  activeTab: ClientServicesTab;
  onTabPress: (tab: ClientServicesTab) => void;
};

export const ServicesTabsSection: React.FC<ServicesTabsSectionProps> = ({
  tabs,
  activeTab,
  onTabPress,
}) => {
  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = tab.key === activeTab;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            style={({ pressed }) => [
              styles.tab,
              isActive && styles.tabActive,
              pressed && (isActive ? styles.tabPressedActive : styles.tabPressed),
            ]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
            {typeof tab.count === 'number' && (
              <View
                style={[
                  styles.countBadge,
                  isActive && styles.countBadgeActive,
                ]}
              >
                <Text style={[styles.countText, isActive && styles.countTextActive]}>{tab.count}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};
