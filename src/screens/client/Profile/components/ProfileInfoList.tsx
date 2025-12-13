import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../../../ui';
import { theme } from '../../../../theme';

type IconName = keyof typeof Ionicons.glyphMap;

export interface ProfileInfoItem {
  id: string;
  icon: IconName;
  label: string;
  value: string;
}

interface ProfileInfoListProps {
  title: string;
  items: ProfileInfoItem[];
}

export function ProfileInfoList({ title, items }: ProfileInfoListProps) {
  return (
    <View style={styles.container}>
      <ThemedText variant="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      {items.map(item => (
        <View key={item.id} style={styles.row}>
          <View style={styles.iconBadge}>
            <Ionicons name={item.icon} size={18} color={theme.colors.primary} />
          </View>
          <View style={styles.body}>
            <ThemedText variant="caption" color="muted" style={styles.label}>
              {item.label}
            </ThemedText>
            <ThemedText variant="body">{item.value}</ThemedText>
          </View>
        </View>
      ))}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  body: {
    flex: 1,
  },
  label: {
    marginBottom: 2,
  },
});
