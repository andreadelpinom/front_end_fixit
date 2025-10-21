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
    titleSection: {
        marginTop: 20,
        marginBottom: 20
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.text.primary,
        marginBottom: 4
    },
    subtitle: {
        fontSize: 13,
        color: colors.text.secondary
    },
    statsContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20
    },
    statBox: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border
    },
    statLabel: {
        fontSize: 10,
        color: colors.text.secondary,
        fontWeight: "500",
        marginBottom: 4
    },
    statValue: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.primary
    },
    servicesList: {
        gap: 12,
        marginBottom: 16
    },
    serviceCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border
    },
    serviceCardInactive: {
        opacity: 0.6
    },
    serviceLeft: {
        flex: 1
    },
    serviceHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 4
    },
    serviceTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.text.primary,
        flex: 1
    },
    activeBadge: {
        backgroundColor: colors.status.success,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    activeBadgeText: {
        color: "#FFFFFF",
        fontSize: 9,
        fontWeight: "700"
    },
    inactiveBadge: {
        backgroundColor: colors.text.light,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    inactiveBadgeText: {
        color: colors.text.tertiary,
        fontSize: 9,
        fontWeight: "700"
    },
    serviceDescription: {
        fontSize: 11,
        color: colors.text.secondary,
        marginBottom: 6
    },
    serviceStats: {
        flexDirection: "row",
        gap: 8
    },
    statBadge: {
        fontSize: 10,
        color: colors.text.tertiary,
        fontWeight: "500"
    },
    serviceRight: {
        alignItems: "center",
        gap: 8,
        marginLeft: 12
    },
    servicePrice: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.primary
    },
    toggle: {
        marginVertical: 0
    },
    addServiceButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        gap: 8,
        marginBottom: 20
    },
    addServiceIcon: {
        fontSize: 20,
        color: "#FFFFFF"
    },
    addServiceText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600"
    },
    infoSection: {
        marginTop: 8
    },
    infoCard: {
        flexDirection: "row",
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: colors.border
    },
    infoIcon: {
        fontSize: 24,
        marginTop: 2
    },
    infoTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.text.primary,
        marginBottom: 4
    },
    infoText: {
        fontSize: 11,
        color: colors.text.secondary,
        lineHeight: 15
    }
});
