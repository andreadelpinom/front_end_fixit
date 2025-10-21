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
    backButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
        marginBottom: 16
    },
    backButton: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.primary
    },
    notificationIcon: {
        fontSize: 20
    },
    profileCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center"
    },
    avatarSection: {
        position: "relative",
        marginBottom: 12
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center"
    },
    avatarInitial: {
        color: "#FFFFFF",
        fontSize: 32,
        fontWeight: "700"
    },
    verifiedBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.status.success,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: colors.background
    },
    verifiedIcon: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700"
    },
    nameSection: {
        alignItems: "center"
    },
    nameRow: {
        alignItems: "center",
        marginBottom: 4
    },
    name: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text.primary,
        marginBottom: 4
    },
    certificationBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8
    },
    certificationBadgeText: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "600"
    },
    email: {
        fontSize: 12,
        color: colors.text.secondary,
        marginBottom: 4
    },
    joinDate: {
        fontSize: 11,
        color: colors.text.tertiary
    },
    statsGrid: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 24
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border
    },
    statIcon: {
        fontSize: 24,
        marginBottom: 4
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
    section: {
        marginBottom: 24
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.text.primary,
        marginBottom: 12
    },
    certCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: colors.border
    },
    certIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.borderLight,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0
    },
    certIconText: {
        fontSize: 20
    },
    certContent: {
        flex: 1
    },
    certName: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.text.primary,
        marginBottom: 2
    },
    certIssuer: {
        fontSize: 11,
        color: colors.text.secondary,
        marginBottom: 2
    },
    certDate: {
        fontSize: 10,
        color: colors.text.tertiary
    },
    skillCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border
    },
    skillName: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.text.primary,
        marginBottom: 4
    },
    skillLevel: {
        fontSize: 11,
        color: colors.text.secondary,
        marginBottom: 6
    },
    skillLevelBar: {
        height: 6,
        backgroundColor: colors.border,
        borderRadius: 3,
        overflow: "hidden"
    },
    skillLevelFill: {
        height: "100%",
        backgroundColor: colors.primary,
        borderRadius: 3
    },
    actionButtons: {
        gap: 12
    },
    primaryButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center"
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600"
    },
    secondaryButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center"
    },
    secondaryButtonText: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: "600"
    },
    logoutButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.status.error,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 24
    },
    logoutButtonText: {
        color: colors.status.error,
        fontSize: 14,
        fontWeight: "600"
    }
});
