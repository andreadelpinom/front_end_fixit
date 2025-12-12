import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RoleSelectionModal } from '../components/RoleSelectionModal';
import { ValidationUtils } from '../utils/validation.utils';
import { ErrorUtils } from '../utils/error.utils';
import { LoginStyle } from 'styles';

const buildEmailCredentials = (identifier: string, password: string) => ({
  email: identifier,
  password,
});

const buildCedulaCredentials = (identifier: string, password: string) => ({
  cedula: identifier,
  password,
});

const credentialBuilders = {
  email: buildEmailCredentials,
  cedula: buildCedulaCredentials,
} as const;

const mapValidationErrors = (
  errors: Array<{ field: string; message: string }>,
): Record<string, string> => {
  const errorMap: Record<string, string> = {};
  for (const err of errors) {
    errorMap[err.field] = err.message;
  }
  return errorMap;
};

export function LoginScreen({
  onRegister,
}: Readonly<{ onRegister: () => void }>) {
  const { login, isLoading, error, clearError, switchRole, user, isRoleSelectionNeeded, completeRoleSelection } = useAuth();

  const [loginMode, setLoginMode] = useState<'email' | 'cedula'>('email');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [roleSelectionLoading, setRoleSelectionLoading] = useState(false);

  useEffect(() => {
    if (error) {
      Alert.alert('Error de autenticación', ErrorUtils.getErrorMessage(error));
      clearError();
    }
  }, [error, clearError]);

  const handleLogin = async () => {
    setValidationErrors({});

    const errors = ValidationUtils.validateLoginForm(
      identifier,
      password,
      loginMode === 'email',
    );

    if (errors.length > 0) {
      setValidationErrors(mapValidationErrors(errors));
      return;
    }

    try {
      const selectedBuilder =
        credentialBuilders[loginMode] ?? credentialBuilders.email;

      const credentials = selectedBuilder(identifier, password);

      await login(credentials, rememberMe);
    } catch (err) {
      ErrorUtils.logError(err, 'LoginScreen');
    }
  };

  const toggleLoginMode = (mode: 'email' | 'cedula') => {
    setLoginMode(mode);
    setIdentifier('');
    setValidationErrors({});
  };

  /**
   * Maneja la selección de rol cuando el usuario tiene múltiples roles
   */
  const handleRoleSelection = async (selectedRole: 'CLIENTE' | 'TECNICO') => {
    setRoleSelectionLoading(true);
    try {
      // Cambiar el rol activo
      await switchRole(selectedRole);
      completeRoleSelection();
    } catch (err) {
      ErrorUtils.logError(err, 'LoginScreen - handleRoleSelection');
      Alert.alert(
        'Error al cambiar rol',
        'No pudimos cambiar a tu rol seleccionado. Intenta nuevamente.',
      );
    } finally {
      setRoleSelectionLoading(false);
    }
  };

  const identifierField = loginMode === 'email' ? 'email' : 'cedula';

  return (
    <>
      {/* Modal de selección de rol */}
      <RoleSelectionModal
        visible={isRoleSelectionNeeded}
        loading={roleSelectionLoading}
        onSelectRole={handleRoleSelection}
        userName={user?.nombres}
      />

      <KeyboardAvoidingView
        style={LoginStyle.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={LoginStyle.scrollContent}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!isRoleSelectionNeeded}>
          <View style={LoginStyle.formContainer}>
          <Text style={LoginStyle.title}>Bienvenido a FixIt</Text>
          <Text style={LoginStyle.subtitle}>Inicia sesión para continuar</Text>

          {/* Toggle Email/Cédula */}
          <View style={LoginStyle.toggleContainer}>
            <TouchableOpacity
              style={[
                LoginStyle.toggleButton,
                loginMode === 'email' && LoginStyle.toggleButtonActive,
              ]}
              onPress={() => loginMode !== 'email' && toggleLoginMode('email')}>
              <Text
                style={[
                  LoginStyle.toggleText,
                  loginMode === 'email' && LoginStyle.toggleTextActive,
                ]}>
                Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                LoginStyle.toggleButton,
                loginMode === 'cedula' && LoginStyle.toggleButtonActive,
              ]}
              onPress={() =>
                loginMode !== 'cedula' && toggleLoginMode('cedula')
              }>
              <Text
                style={[
                  LoginStyle.toggleText,
                  loginMode === 'cedula' && LoginStyle.toggleTextActive,
                ]}>
                Cédula
              </Text>
            </TouchableOpacity>
          </View>

          {/* Identifier */}
          <View style={LoginStyle.inputContainer}>
            <Text style={LoginStyle.label}>
              {loginMode === 'email' ? 'Correo electrónico' : 'Cédula'}
            </Text>

            <TextInput
              style={[
                LoginStyle.input,
                validationErrors[identifierField] && LoginStyle.inputError,
              ]}
              placeholder={
                loginMode === 'email' ? 'ejemplo@correo.com' : '1234567890'
              }
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              keyboardType={loginMode === 'email' ? 'email-address' : 'numeric'}
              maxLength={loginMode === 'email' ? undefined : 10}
              editable={!isLoading}
            />

            {!!validationErrors[identifierField] && (
              <Text style={LoginStyle.errorText}>
                {validationErrors[identifierField]}
              </Text>
            )}
          </View>

          {/* Password */}
          <View style={LoginStyle.inputContainer}>
            <Text style={LoginStyle.label}>Contraseña</Text>

            <View style={LoginStyle.passwordContainer}>
              <TextInput
                style={[
                  LoginStyle.input,
                  LoginStyle.passwordInput,
                  validationErrors.password && LoginStyle.inputError,
                ]}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />

              <TouchableOpacity
                style={LoginStyle.eyeIcon}
                onPress={() => setShowPassword(prev => !prev)}>
                <Text style={LoginStyle.eyeText}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>

            {!!validationErrors.password && (
              <Text style={LoginStyle.errorText}>
                {validationErrors.password}
              </Text>
            )}
          </View>

          {/* Remember Me */}
          <View style={LoginStyle.rememberMeContainer}>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              disabled={isLoading}
            />
            <Text style={LoginStyle.rememberMeText}>Recordar sesión</Text>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              LoginStyle.loginButton,
              isLoading && LoginStyle.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={LoginStyle.loginButtonText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity style={LoginStyle.forgotPassword}>
            <Text style={LoginStyle.forgotPasswordText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          {/* --- Register Button --- */}
          <TouchableOpacity
            onPress={onRegister}
            style={LoginStyle.registerContainer}>
            <Text style={LoginStyle.registerText}>
              ¿No tienes cuenta? Crear una
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </>
  );
}
