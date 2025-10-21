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
    summaryGrid: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20
    },
    summaryCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border
    },
    summaryIcon: {
        fontSize: 20,
        marginBottom: 4
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.primary,
        marginBottom: 2
    },
    summaryLabel: {
        fontSize: 10,
        color: colors.text.secondary
    },
    filterContainer: {
        marginBottom: 16
    },
    filtersList: {
        gap: 8,
        paddingRight: 16
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border
    },
    filterButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary
    },
    filterButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.text.secondary
    },
    filterButtonTextActive: {
        color: "#FFFFFF"
    },
    certsList: {
        gap: 12,
        marginBottom: 16
    },
    certCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border
    },
    certHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12
    },
    certImageContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: colors.borderLight,
        justifyContent: "center",
        alignItems: "center"
    },
    certImage: {
        fontSize: 24
    },
    certTitleSection: {
        flex: 1
    },
    certName: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.text.primary,
        marginBottom: 2
    },
    certIssuer: {
        fontSize: 11,
        color: colors.text.secondary
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    statusText: {
        fontSize: 10,
        fontWeight: "700"
    },
    certDetails: {
        backgroundColor: colors.background,
        borderRadius: 8,
        padding: 8,
        marginBottom: 12,
        gap: 4
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    detailLabel: {
        fontSize: 10,
        color: colors.text.secondary,
        fontWeight: "500"
    },
    detailValue: {
        fontSize: 11,
        color: colors.text.primary,
        fontWeight: "600"
    },
    certFooter: {
        flexDirection: "row",
        gap: 8
    },
    verifyButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: colors.primary,
        alignItems: "center"
    },
    verifyButtonText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "600"
    },
    downloadButton: {
        width: 40,
        borderRadius: 8,
        backgroundColor: colors.borderLight,
        justifyContent: "center",
        alignItems: "center"
    },
    downloadIcon: {
        fontSize: 16
    },
    emptyState: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
        marginTop: 20
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text.primary
    },
    addCertButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 12,
        gap: 8,
        marginBottom: 20
    },
    addCertIcon: {
        fontSize: 18,
        color: "#FFFFFF"
    },
    addCertText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600"
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
        fontSize: 20,
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
