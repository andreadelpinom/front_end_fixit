import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";

interface LoginScreenProps {
  navigation: any;
}

/**
 * Login Screen Component
 *
 * Architecture:
 * - Form validation before submission
 * - Uses AuthContext for authentication
 * - Mock authentication (no real API calls)
 * - Error handling and user feedback
 *
 * Features:
 * - Email and password input validation
 * - Password visibility toggle
 * - Loading state during authentication
 * - Error messages for failed attempts
 * - Link to registration for new users
 */
export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login, isLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle login with validation
  const handleLogin = async () => {
    setError("");

    // Validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Call auth context login
    try {
      await login(email, password);
      // Navigation handled by RootNavigator based on isSignedIn state
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  const handleRegisterPress = () => {
    navigation.navigate("Register");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={[styles.headerSection, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.appTitle}>FixIt</Text>
          <Text style={styles.subtitle}>Bienvenido de vuelta</Text>
          <Text style={styles.description}>
            Inicia sesión para acceder a tus solicitudes y servicios
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>📧</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor={colors.text.tertiary}
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🔐</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={colors.text.tertiary}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Text style={styles.eyeIcon}>
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.buttonDisabled
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </Text>
          </TouchableOpacity>

          {/* Demo Credentials */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Demo Credentials</Text>
            <Text style={styles.demoText}>Email: demo@fixit.com</Text>
            <Text style={styles.demoText}>Password: cualquier contraseña (6+ caracteres)</Text>
          </View>
        </View>

        {/* Register Section */}
        <View style={styles.registerSection}>
          <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
          <TouchableOpacity
            onPress={handleRegisterPress}
            disabled={isLoading}
          >
            <Text style={styles.registerLink}>Crear una aquí</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>o continúa como</Text>
          <View style={styles.divider} />
        </View>

        {/* Social Login Options */}
        <View style={styles.socialSection}>
          <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
            <Text style={styles.socialIcon}>g</Text>
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
            <Text style={styles.socialIcon}>f</Text>
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            Al iniciar sesión, aceptas nuestros{" "}
            <Text style={styles.termsLink}>Términos</Text> y{" "}
            <Text style={styles.termsLink}>Política de Privacidad</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16
  },
  headerSection: {
    marginBottom: 40,
    alignItems: "center"
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 16
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 8
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20
  },
  formSection: {
    marginBottom: 24
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    borderLeftWidth: 4,
    borderLeftColor: colors.status.error,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  errorText: {
    color: colors.status.error,
    fontSize: 13,
    fontWeight: "500"
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 8
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 0
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 8
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 14,
    color: colors.text.primary
  },
  eyeIcon: {
    fontSize: 18,
    marginLeft: 8
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 24
  },
  forgotPasswordText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "500"
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  buttonDisabled: {
    opacity: 0.6
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600"
  },
  demoSection: {
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE"
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.status.info,
    marginBottom: 6
  },
  demoText: {
    fontSize: 11,
    color: colors.status.info,
    lineHeight: 16
  },
  registerSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 24
  },
  registerText: {
    fontSize: 13,
    color: colors.text.secondary
  },
  registerLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600"
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: colors.text.tertiary
  },
  socialSection: {
    gap: 12,
    marginBottom: 24
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8
  },
  socialIcon: {
    fontSize: 16,
    fontWeight: "700"
  },
  socialButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.text.primary
  },
  termsContainer: {
    paddingHorizontal: 12,
    marginBottom: 20
  },
  termsText: {
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 16
  },
  termsLink: {
    color: colors.primary,
    fontWeight: "600"
  }
});
