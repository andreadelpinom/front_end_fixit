// src/components/common/LoadingView.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingViewProps {
  color?: string;
  size?: 'small' | 'large';
}

export default function LoadingView({ color = '#2C3E50', size = 'large' }: LoadingViewProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
});
