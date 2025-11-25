/**
 * Extracts a user-friendly error message from various error types
 */
export class ErrorUtils {
  static getErrorMessage(error: unknown): string {
    if (!error) {
      return 'An unexpected error occurred';
    }

    // Check if it's an Error instance
    if (error instanceof Error) {
      return error.message;
    }

    // Check if it's an object with a message property
    if (typeof error === 'object' && error !== null) {
      if ('message' in error && typeof error.message === 'string') {
        return error.message;
      }
      if ('error' in error && typeof error.error === 'string') {
        return error.error;
      }
    }

    // Check if it's a string
    if (typeof error === 'string') {
      return error;
    }

    // Fallback
    return 'An unexpected error occurred';
  }

  /**
   * Checks if an error is a network error
   */
  static isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.message.toLowerCase().includes('network') ||
        error.message.toLowerCase().includes('connection')
      );
    }
    return false;
  }

  /**
   * Checks if an error is an authentication error
   */
  static isAuthError(error: unknown): boolean {
    if (error instanceof Error && 'statusCode' in error) {
      const statusCode = (error as any).statusCode;
      return statusCode === 401 || statusCode === 403;
    }
    return false;
  }

  /**
   * Logs error details (useful for debugging)
   */
  static logError(error: unknown, context?: string): void {
    const message = this.getErrorMessage(error);
    const prefix = context ? `[${context}]` : '[Error]';

    console.error(`${prefix} ${message}`, error);
  }
}
