import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../../../ui';
import { theme } from '../../../../theme';

type IconName = keyof typeof Ionicons.glyphMap;

export interface ProfileQuickAction {
  id: string;
  icon: IconName;
  label: string;
  onPress: () => void;
}

interface ProfileQuickActionsProps {
  title: string;
  actions: ProfileQuickAction[];
}

export function ProfileQuickActions({ title, actions }: ProfileQuickActionsProps) {
  return (
    <View style={styles.container}>
      <ThemedText variant="subtitle" style={styles.title}>
        {title}
      </ThemedText>

      <FlatList
        data={actions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={item.onPress} style={styles.item} accessibilityRole="button">
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={20} color={theme.colors.primary} />
            </View>
            <ThemedText style={styles.label}>{item.label}</ThemedText>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.text.muted} />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    marginBottom: theme.spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  label: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    opacity: 0.4,
  },
});
