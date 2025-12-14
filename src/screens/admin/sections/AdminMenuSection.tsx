import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText, ThemedView } from '../../../ui';

interface MenuItem {
  title: string;
  subtitle: string;
  onPress: () => void;
}

interface AdminMenuSectionProps {
  menuItems: MenuItem[];
}

export const AdminMenuSection: React.FC<AdminMenuSectionProps> = ({ menuItems }) => {
  const MenuItemComponent = ({ title, subtitle, onPress }: MenuItem) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View>
        <ThemedText variant="h3" style={styles.menuTitle}>{title}</ThemedText>
        <ThemedText variant="body" color="muted" style={styles.menuSubtitle}>{subtitle}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView variant="surface" style={styles.section}>
      <ThemedText variant="h3" style={styles.sectionTitle}>Gestión del Sistema</ThemedText>
      {menuItems.map((item, index) => (
        <MenuItemComponent key={index} {...item} />
      ))}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuSubtitle: {
    color: '#666',
  },
});