import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { emptyActivityStyles as styles } from './EmptyActivitySection.styles';
import { theme } from '../../../../theme';

type EmptyActivitySectionProps = {
  title: string;
  description: string;
  iconName?: keyof typeof Ionicons.glyphMap;
};

export const EmptyActivitySection: React.FC<EmptyActivitySectionProps> = ({
  title,
  description,
  iconName = 'checkmark-done-circle-outline',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name={iconName} size={52} color={theme.colors.primary} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};
