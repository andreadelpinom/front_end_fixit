export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationUtils {
  static validateEmail(email: string): string | null {
    if (!email) {
      return 'Email is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Email must be a valid email address';
    }

    return null;
  }

  static validateCedula(cedula: string): string | null {
    if (!cedula) {
      return 'Cédula is required';
    }

    // Ecuadorian cédula is 10 digits
    if (!/^\d{10}$/.test(cedula)) {
      return 'Cédula must be 10 digits';
    }

    return null;
  }

  static validatePassword(password: string): string | null {
    if (!password) {
      return 'Password is required';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    return null;
  }

  static validateLoginForm(
    identifier: string,
    password: string,
    isEmailMode: boolean,
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (isEmailMode) {
      const emailError = this.validateEmail(identifier);
      if (emailError) {
        errors.push({ field: 'email', message: emailError });
      }
    } else {
      const cedulaError = this.validateCedula(identifier);
      if (cedulaError) {
        errors.push({ field: 'cedula', message: cedulaError });
      }
    }

    const passwordError = this.validatePassword(password);
    if (passwordError) {
      errors.push({ field: 'password', message: passwordError });
    }

    return errors;
  }
}
