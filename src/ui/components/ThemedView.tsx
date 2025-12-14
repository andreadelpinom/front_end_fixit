import React from 'react';
import { View, ViewProps } from 'react-native';
import { theme } from '../../theme';

type PaddingKey = keyof typeof theme.spacing;

type ThemedViewProps = ViewProps & {
  variant?: 'background' | 'surface' | 'info';
  padding?: PaddingKey;
};

export function ThemedView({
  variant = 'background',
  padding,
  style,
  children,
  ...rest
}: ThemedViewProps) {
  let backgroundColor = theme.colors.background;
  if (variant === 'surface') {
    backgroundColor = theme.colors.surface;
  } else if (variant === 'info') {
    backgroundColor = theme.colors.info;
  }
  const paddingValue = padding ? theme.spacing[padding] : undefined;

  return (
    <View
      style={[
        { backgroundColor },
        paddingValue !== undefined && { padding: paddingValue },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
