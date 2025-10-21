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
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
    },
    backButton: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.primary
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text.primary
    },
    newBadgeContainer: {
        marginBottom: 16
    },
    newBadge: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.status.success,
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        overflow: "hidden"
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text.primary,
        marginBottom: 16
    },
    clientCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 12
    },
    clientAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0
    },
    clientInitial: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700"
    },
    clientInfo: {
        flex: 1
    },
    clientName: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.text.primary,
        marginBottom: 2
    },
    clientRating: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginBottom: 2
    },
    rating: {
        fontSize: 11,
        fontWeight: "600",
        color: colors.text.primary
    },
    reviews: {
        fontSize: 10,
        color: colors.text.tertiary
    },
    phone: {
        fontSize: 11,
        color: colors.text.secondary
    },
    chatButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.borderLight,
        justifyContent: "center",
        alignItems: "center"
    },
    chatButtonText: {
        fontSize: 16
    },
    section: {
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.text.primary,
        marginBottom: 12
    },
    infoBox: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.border
    },
    infoLabel: {
        fontSize: 11,
        color: colors.text.secondary,
        fontWeight: "500",
        marginBottom: 4
    },
    infoValue: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.text.primary
    },
    scheduleGrid: {
        flexDirection: "row",
        gap: 8
    },
    scheduleItem: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border
    },
    scheduleLabel: {
        fontSize: 10,
        color: colors.text.secondary,
        fontWeight: "500",
        marginBottom: 4
    },
    scheduleValue: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.text.primary
    },
    description: {
        fontSize: 13,
        color: colors.text.secondary,
        lineHeight: 18,
        marginBottom: 12
    },
    detailsList: {
        gap: 8
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        paddingVertical: 4
    },
    detailBullet: {
        fontSize: 14,
        color: colors.status.success,
        fontWeight: "700"
    },
    detailText: {
        fontSize: 12,
        color: colors.text.secondary,
        flex: 1
    },
    requirementsList: {
        gap: 8
    },
    requirementItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        padding: 10,
        backgroundColor: colors.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border
    },
    checkmark: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.status.success,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0
    },
    checkmarkText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "700"
    },
    requirementText: {
        fontSize: 12,
        color: colors.text.secondary,
        flex: 1
    },
    priceSection: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
    },
    priceLabel: {
        fontSize: 12,
        color: colors.text.secondary,
        fontWeight: "500"
    },
    priceValue: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.primary
    },
    priceNote: {
        backgroundColor: colors.borderLight,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 8
    },
    priceNoteText: {
        fontSize: 10,
        color: colors.text.tertiary,
        textAlign: "center"
    },
    footer: {
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border
    },
    primaryButton: {
        flex: 1,
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
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border
    },
    secondaryButtonText: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: "600"
    }
});
