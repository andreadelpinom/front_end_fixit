import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { theme } from '../../theme';

type TextVariant = 'body' | 'caption' | 'heading' | 'subtitle' | 'h1' | 'h2' | 'h3' | 'button';

type ThemedTextProps = TextProps & {
  variant?: TextVariant;
  color?: keyof typeof theme.colors.text | 'error';
};

const styles = StyleSheet.create({
  body: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.md,
    lineHeight: theme.typography.lineHeights.normal,
    color: theme.colors.text.primary,
  },
  caption: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.sm,
    lineHeight: theme.typography.lineHeights.tight,
    color: theme.colors.text.secondary,
  },
  heading: {
    fontFamily: theme.typography.families.bold,
    fontSize: theme.typography.sizes.xl,
    lineHeight: theme.typography.lineHeights.relaxed,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.bold,
  },
  h1: {
    fontFamily: theme.typography.families.bold,
    fontSize: theme.typography.sizes.xxl,
    lineHeight: theme.typography.lineHeights.relaxed,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.bold,
  },
  h2: {
    fontFamily: theme.typography.families.bold,
    fontSize: theme.typography.sizes.xl,
    lineHeight: theme.typography.lineHeights.relaxed,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.bold,
  },
  h3: {
    fontFamily: theme.typography.families.bold,
    fontSize: theme.typography.sizes.lg,
    lineHeight: theme.typography.lineHeights.normal,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.bold,
  },
  subtitle: {
    fontFamily: theme.typography.families.medium,
    fontSize: theme.typography.sizes.lg,
    lineHeight: theme.typography.lineHeights.normal,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
  },
  button: {
    fontFamily: theme.typography.families.medium,
    fontSize: theme.typography.sizes.md,
    lineHeight: theme.typography.lineHeights.normal,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.medium,
  },
});

export function ThemedText({
  variant = 'body',
  color = 'primary',
  style,
  ...rest
}: ThemedTextProps) {
  const baseStyle = styles[variant];
  let textColor = theme.colors.text[color as keyof typeof theme.colors.text];
  if (color === 'error') {
    textColor = theme.colors.error;
  }

  return <Text style={[baseStyle, { color: textColor }, style]} {...rest} />;
}
