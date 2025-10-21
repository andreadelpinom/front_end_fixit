import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flex: 1,
    paddingHorizontal: 16
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 16,
    marginBottom: 20
  },
  headerIcon: {
    fontSize: 24,
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16
  },
  avatarInitial: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700"
  },
  nameContainer: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 2
  },
  email: {
    fontSize: 12,
    color: colors.text.secondary
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },
  statBox: {
    alignItems: "center",
    flex: 1
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 2
  },
  statLabel: {
    fontSize: 11,
    color: colors.text.secondary
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8
  },
  editButtonIcon: {
    fontSize: 16
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600"
  },
  roleSection: {
    marginBottom: 24
  },
  roleSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 12
  },
  roleButtons: {
    flexDirection: "row",
    gap: 12
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center"
  },
  roleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  roleButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.secondary
  },
  roleButtonTextActive: {
    color: "#FFFFFF"
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 12
  },
  quickAccessItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  quickAccessIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.borderLight,
    justifyContent: "center",
    alignItems: "center"
  },
  iconText: {
    fontSize: 20
  },
  quickAccessContent: {
    flex: 1
  },
  quickAccessTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 2
  },
  quickAccessSubtitle: {
    fontSize: 11,
    color: colors.text.secondary
  },
  countBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 28
  },
  countText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center"
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  settingIcon: {
    fontSize: 18
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.text.primary
  },
  settingArrow: {
    fontSize: 16,
    color: colors.text.tertiary
  },
  logoutButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20
  },
  logoutButtonText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600"
  },
  buttonDisabled: {
    opacity: 0.6
  }
});
