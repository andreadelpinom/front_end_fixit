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
        marginBottom: 16
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
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
        height: 44
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: colors.text.primary,
        paddingVertical: 10
    },
    searchIcon: {
        fontSize: 18,
        marginLeft: 8
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
    requestsList: {
        gap: 12,
        marginBottom: 16
    },
    requestCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: colors.border
    },
    requestImageContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.borderLight,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0
    },
    requestImage: {
        fontSize: 20
    },
    requestInfo: {
        flex: 1
    },
    requestTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.text.primary,
        marginBottom: 4
    },
    clientRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4
    },
    clientName: {
        fontSize: 11,
        color: colors.text.secondary,
        fontWeight: "500"
    },
    requestDate: {
        fontSize: 10,
        color: colors.text.tertiary
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },
    progressBar: {
        flex: 1,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        overflow: "hidden"
    },
    progressFill: {
        height: "100%",
        borderRadius: 2
    },
    progressText: {
        fontSize: 10,
        fontWeight: "700",
        minWidth: 20
    },
    requestRight: {
        alignItems: "flex-end",
        gap: 6
    },
    requestPrice: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.primary
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: "700"
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
        color: colors.text.primary,
        marginBottom: 4
    },
    emptySubtext: {
        fontSize: 12,
        color: colors.text.secondary
    },
    statsSection: {
        flexDirection: "row",
        gap: 10,
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border
    },
    statItem: {
        flex: 1,
        alignItems: "center"
    },
    statLabel: {
        fontSize: 11,
        color: colors.text.secondary,
        fontWeight: "500",
        marginBottom: 4
    },
    statValue: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.primary
    }
});