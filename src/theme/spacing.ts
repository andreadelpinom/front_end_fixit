const unit = 4;

export const spacing = {
  none: 0,
  xs: unit,
  sm: unit * 2,
  md: unit * 4,
  lg: unit * 6,
  xl: unit * 8,
  xxl: unit * 10,
};

export type SpacingScale = typeof spacing;
