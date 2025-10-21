import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export default StyleSheet.create({
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