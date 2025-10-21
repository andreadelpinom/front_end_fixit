import { StyleSheet } from "react-native";
import { client, colors } from "../../theme/colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface
    },
    content: {
        flex: 1,
        paddingHorizontal: 16
    },
    greetingSection: {
        marginTop: 24,
        marginBottom: 16
    },
    greetingText: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.text.primary,
        marginBottom: 4
    },
    greetingSubtext: {
        fontSize: 14,
        color: colors.text.secondary
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: colors.background,
        borderRadius: 12,
        paddingRight: 12,
        borderWidth: 1,
        borderColor: colors.border
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 12,
        fontSize: 14,
        color: colors.text.primary
    },
    filterButton: {
        paddingHorizontal: 8,
        paddingVertical: 8
    },
    filterIcon: {
        fontSize: 18
    },
    // Hero
    heroCarousel: {
        marginBottom: 24
    },
    heroCard: {
        width: 320,
        backgroundColor: client.dark,
        borderRadius: 20,
        padding: 16
    },
    heroTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 6
    },
    heroSubtitle: {
        color: "#E5E7EB",
        fontSize: 12,
        marginBottom: 12
    },
    heroButton: {
        alignSelf: "flex-start",
        backgroundColor: colors.background,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999
    },
    heroButtonText: {
        color: client.dark,
        fontWeight: "700"
    },
    // Secciones
    section: {
        marginBottom: 24
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.text.primary
    },
    seeAllLink: {
        fontSize: 12,
        color: client.primary,
        fontWeight: "700"
    },
    // Categorías
    categoryChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: colors.background,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border
    },
    categoryChipSelected: {
        backgroundColor: client.primary,
        borderColor: client.primary
    },
    categoryIcon: {
        fontSize: 16,
        color: client.primary
    },
    categoryText: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.text.primary
    },
    // Top técnicos
    techCard: {
        width: 260,
        backgroundColor: colors.background,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: colors.border
    },
    techHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    techAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: client.light,
        justifyContent: "center",
        alignItems: "center"
    },
    techAvatarText: {
        color: client.dark,
        fontSize: 18,
        fontWeight: "800"
    },
    techInfo: {
        flex: 1
    },
    techName: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.text.primary
    },
    techRole: {
        fontSize: 12,
        color: colors.text.secondary,
        marginBottom: 4
    },
    techMetaRow: {
        flexDirection: "row",
        gap: 6
    },
    techMeta: {
        fontSize: 11,
        color: colors.text.tertiary
    },
    onlineDot: {
        width: 10,
        height: 10,
        borderRadius: 5
    },
    viewProfileBtn: {
        marginTop: 12,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center"
    },
    viewProfileText: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.text.primary
    },
    // Ofertas
    offerCard: {
        width: 260,
        backgroundColor: colors.background,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: colors.border
    },
    offerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6
    },
    offerTitle: {
        fontSize: 14,
        fontWeight: "800",
        color: colors.text.primary,
        flex: 1,
        marginRight: 8
    },
    urgentBadge: {
        backgroundColor: colors.status.warning,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8
    },
    urgentText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "800"
    },
    offerDesc: {
        fontSize: 12,
        color: colors.text.secondary,
        marginBottom: 10
    },
    offerFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    offerValid: {
        fontSize: 12,
        color: colors.text.tertiary
    },
    offerPrice: {
        fontSize: 14,
        fontWeight: "800",
        color: client.primary
    }
});
