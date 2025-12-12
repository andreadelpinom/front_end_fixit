/**
 * Utility functions for handling monetary values
 * 
 * Backend sends Prisma Decimal fields as strings
 * This utility standardizes conversion and formatting
 */

/**
 * Safely parse and format a monetary value as currency string
 * Handles: string | number | undefined | null
 * @param value - The value to format (string from backend, number from JS, or undefined)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string like "30.00"
 */
export function formatCurrency(value: string | number | undefined | null, decimals: number = 2): string {
  if (value === null || value === undefined) {
    return '0'.padEnd(decimals + 2, '0'); // "0.00"
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '0'.padEnd(decimals + 2, '0'); // "0.00"
  }

  return numValue.toFixed(decimals);
}

/**
 * Parse a monetary value to a number
 * Handles: string | number | undefined | null
 * @param value - The value to parse
 * @returns Parsed number or 0 if invalid
 */
export function parseCurrency(value: string | number | undefined | null): number {
  if (value === null || value === undefined) {
    return 0;
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(numValue) ? 0 : numValue;
}

/**
 * Format value as USD currency string
 * Example: formatUSD(30) => "$30.00"
 * @param value - The value to format
 * @returns Formatted currency string with $ prefix
 */
export function formatUSD(value: string | number | undefined | null): string {
  return `$${formatCurrency(value)}`;
}

/**
 * Safe method calling on monetary values
 * Instead of: costoAcordado?.toFixed(2)
 * Use: safeCurrencyFormat(costoAcordado)
 * 
 * @param value - The value to format
 * @returns Formatted currency string
 */
export function safeCurrencyFormat(value: string | number | undefined | null): string {
  return formatCurrency(value, 2);
}
