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
    metricsGrid: {
        gap: 12,
        marginBottom: 12
    },
    metricCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center"
    },
    metricIcon: {
        fontSize: 24,
        marginBottom: 6
    },
    metricLabel: {
        fontSize: 11,
        color: colors.text.secondary,
        textAlign: "center",
        marginBottom: 4
    },
    metricValue: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.primary
    },
    chartSection: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.border
    },
    chartHeader: {
        marginBottom: 16
    },
    chartTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.text.primary,
        marginBottom: 8
    },
    toggleButtons: {
        flexDirection: "row",
        gap: 8
    },
    toggleButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border
    },
    toggleButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary
    },
    toggleButtonText: {
        fontSize: 11,
        fontWeight: "600",
        color: colors.text.secondary
    },
    toggleButtonTextActive: {
        color: "#FFFFFF"
    },
    chart: {
        height: 150
    },
    monthContainer: {
        flex: 1,
        alignItems: "center",
        gap: 6
    },
    barContainer: {
        width: "100%",
        height: 100,
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 4
    },
    bar: {
        width: "70%",
        backgroundColor: colors.primary,
        borderRadius: 4,
        minHeight: 4
    },
    monthLabel: {
        fontSize: 10,
        fontWeight: "600",
        color: colors.text.secondary
    },
    monthValue: {
        fontSize: 9,
        color: colors.text.tertiary
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
    serviceItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8
    },
    serviceLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1
    },
    clientAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center"
    },
    clientInitial: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700"
    },
    serviceName: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.text.primary,
        marginBottom: 2
    },
    clientName: {
        fontSize: 11,
        color: colors.text.secondary,
        marginBottom: 2
    },
    serviceDate: {
        fontSize: 10,
        color: colors.text.tertiary
    },
    serviceRight: {
        alignItems: "flex-end",
        gap: 6
    },
    serviceAmount: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.primary
    },
    ratingBadge: {
        backgroundColor: colors.borderLight,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4
    },
    ratingText: {
        fontSize: 10,
        fontWeight: "600",
        color: colors.text.secondary
    },
    statsFooter: {
        flexDirection: "row",
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 12
    },
    statFooterItem: {
        flex: 1,
        alignItems: "center"
    },
    statFooterLabel: {
        fontSize: 11,
        color: colors.text.secondary,
        marginBottom: 4
    },
    statFooterValue: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.primary
    },
    statFooterDivider: {
        width: 1,
        backgroundColor: colors.border
    }
});
