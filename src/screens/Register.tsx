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
import { colors } from "../theme/colors";
import { useAuth } from "../context/AuthContext";

interface RegisterScreenProps {
  navigation: any;
}

/**
 * Register Screen Component
 *
 * Architecture:
 * - Multi-field form with role selection (cliente/tecnico)
 * - Password confirmation validation
 * - Terms and conditions agreement
 * - Uses AuthContext for registration
 * - Mock registration (no real API calls)
 *
 * Features:
 * - Full name, email, phone, and password inputs
 * - Role-based account creation (Cliente or Técnico)
 * - Password strength validation
 * - Terms and conditions checkbox
 * - Loading state during registration
 * - Error messages for validation failures
 * - Link to login for existing users
 */
export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { register, isLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"cliente" | "tecnico">("cliente");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle registration with validation
  const handleRegister = async () => {
    setError("");

    // Validation
    if (!fullName.trim()) {
      setError("Full name is required");
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

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    // Call auth context register
    try {
      await register(fullName, email, password, phone, role);
      // Navigation handled by RootNavigator based on isSignedIn state
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  const handleLoginPress = () => {
    navigation.navigate("Login");
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
          <Text style={styles.subtitle}>Crear una cuenta</Text>
          <Text style={styles.description}>
            Únete a la comunidad de profesionales y clientes
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

          {/* Full Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre Completo</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu nombre completo"
                placeholderTextColor={colors.text.tertiary}
                value={fullName}
                onChangeText={setFullName}
                editable={!isLoading}
              />
            </View>
          </View>

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

          {/* Phone Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>📱</Text>
              <TextInput
                style={styles.input}
                placeholder="+593 9 1234 5678"
                placeholderTextColor={colors.text.tertiary}
                value={phone}
                onChangeText={setPhone}
                editable={!isLoading}
                keyboardType="phone-pad"
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

          {/* Confirm Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Contraseña</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🔐</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirma tu contraseña"
                placeholderTextColor={colors.text.tertiary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!isLoading}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                <Text style={styles.eyeIcon}>
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Role Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>¿Qué tipo de usuario eres?</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === "cliente" && styles.roleButtonActive
                ]}
                onPress={() => setRole("cliente")}
                disabled={isLoading}
              >
                <Text style={styles.roleButtonIcon}>👤</Text>
                <Text
                  style={[
                    styles.roleButtonText,
                    role === "cliente" && styles.roleButtonTextActive
                  ]}
                >
                  Cliente
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === "tecnico" && styles.roleButtonActive
                ]}
                onPress={() => setRole("tecnico")}
                disabled={isLoading}
              >
                <Text style={styles.roleButtonIcon}>🔧</Text>
                <Text
                  style={[
                    styles.roleButtonText,
                    role === "tecnico" && styles.roleButtonTextActive
                  ]}
                >
                  Técnico
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreeTerms(!agreeTerms)}
            disabled={isLoading}
          >
            <View
              style={[
                styles.checkbox,
                agreeTerms && styles.checkboxChecked
              ]}
            >
              {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              Acepto los{" "}
              <Text style={styles.checkboxLink}>Términos y Condiciones</Text>
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              isLoading && styles.buttonDisabled
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Section */}
        <View style={styles.loginSection}>
          <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>
          <TouchableOpacity
            onPress={handleLoginPress}
            disabled={isLoading}
          >
            <Text style={styles.loginLink}>Inicia sesión aquí</Text>
          </TouchableOpacity>
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
    marginBottom: 30,
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
  roleButtons: {
    flexDirection: "row",
    gap: 12
  },
  roleButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  roleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  roleButtonIcon: {
    fontSize: 24,
    marginBottom: 6
  },
  roleButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.secondary
  },
  roleButtonTextActive: {
    color: "#FFFFFF"
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 12
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700"
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18
  },
  checkboxLink: {
    color: colors.primary,
    fontWeight: "600"
  },
  registerButton: {
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
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600"
  },
  loginSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 24
  },
  loginText: {
    fontSize: 13,
    color: colors.text.secondary
  },
  loginLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600"
  }
});
