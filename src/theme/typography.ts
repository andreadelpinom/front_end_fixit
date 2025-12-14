export const typography = {
  families: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    display: 40,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 18,
    normal: 22,
    relaxed: 28,
  },
};

export type TypographyTheme = typeof typography;
