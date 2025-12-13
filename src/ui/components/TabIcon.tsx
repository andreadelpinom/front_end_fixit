import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type IconName = keyof typeof Ionicons.glyphMap;

type TabIconProps = {
  name: IconName;
  color: string;
  size: number;
};

export function TabIcon({ name, color, size }: TabIconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}
