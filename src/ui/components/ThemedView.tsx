import React from 'react';
import { View, ViewProps } from 'react-native';
import { theme } from '../../theme';

type PaddingKey = keyof typeof theme.spacing;

type ThemedViewProps = ViewProps & {
  variant?: 'background' | 'surface';
  padding?: PaddingKey;
};

export function ThemedView({
  variant = 'background',
  padding,
  style,
  children,
  ...rest
}: ThemedViewProps) {
  const backgroundColor =
    variant === 'surface' ? theme.colors.surface : theme.colors.background;
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
