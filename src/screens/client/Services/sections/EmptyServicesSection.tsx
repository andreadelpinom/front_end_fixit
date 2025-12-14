import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { emptyServicesStyles as styles } from './EmptyServicesSection.styles';
import { theme } from '../../../../theme';

type EmptyServicesSectionProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export const EmptyServicesSection: React.FC<EmptyServicesSectionProps> = ({
  iconName,
  title,
  description,
  actionLabel,
  onActionPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name={iconName} size={48} color={theme.colors.primary} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {actionLabel && onActionPress && (
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionPressed,
            ]}
            onPress={onActionPress}
          >
            <Text style={styles.actionText}>{actionLabel}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
