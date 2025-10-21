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
        fontSize: 18
    },
    tabsContainer: {
        marginBottom: 16
    },
    tabsList: {
        gap: 8,
        paddingRight: 16
    },
    tab: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.surface,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderWidth: 1,
        borderColor: colors.border
    },
    tabActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary
    },
    tabText: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.text.secondary
    },
    tabTextActive: {
        color: "#FFFFFF"
    },
    tabBadge: {
        backgroundColor: colors.borderLight,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    tabBadgeActive: {
        backgroundColor: "rgba(255, 255, 255, 0.3)"
    },
    tabBadgeText: {
        fontSize: 10,
        fontWeight: "700",
        color: colors.text.secondary
    },
    tabBadgeTextActive: {
        color: "#FFFFFF"
    },
    requestsList: {
        gap: 12
    },
    requestCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border,
        position: "relative"
    },
    newBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.status.success
    },
    requestHeader: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 12
    },
    requestIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: colors.borderLight,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0
    },
    iconText: {
        fontSize: 24
    },
    requestInfo: {
        flex: 1
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 2
    },
    requestTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.text.primary,
        flex: 1
    },
    urgentBadge: {
        backgroundColor: colors.status.error,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4
    },
    urgentText: {
        color: "#FFFFFF",
        fontSize: 9,
        fontWeight: "700"
    },
    requestDescription: {
        fontSize: 11,
        color: colors.text.secondary,
        marginBottom: 6
    },
    metaInfo: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 4
    },
    metaText: {
        fontSize: 10,
        color: colors.text.tertiary
    },
    dateTimeRow: {
        flexDirection: "row",
        gap: 12
    },
    requestFooter: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 12,
        gap: 8
    },
    priceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    priceLabel: {
        fontSize: 11,
        color: colors.text.secondary,
        fontWeight: "500"
    },
    priceAmount: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.primary
    },
    actionButtons: {
        flexDirection: "row",
        gap: 8
    },
    detailButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.primary,
        alignItems: "center"
    },
    detailButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.primary
    },
    acceptButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: colors.primary,
        alignItems: "center"
    },
    acceptButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#FFFFFF"
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
    }
});
