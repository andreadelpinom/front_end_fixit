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