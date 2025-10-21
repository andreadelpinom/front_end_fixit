import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        paddingBottom: 32,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        marginTop: 24,
        marginBottom: 8,
    },
    horizontalScroll: {
        marginBottom: 16,
    },
    card: {
        width: 220,
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginRight: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    cardImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 13,
        color: colors.text.secondary,
    },
    promosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    promoCard: {
        backgroundColor: colors.surface,
        borderRadius: 10,
        padding: 12,
        marginRight: 12,
        marginBottom: 8,
        minWidth: 160,
        flex: 1,
    },
    promoTitle: {
        fontWeight: 'bold',
        color: colors.primary,
        fontSize: 15,
        marginBottom: 4,
    },
    promoDesc: {
        color: colors.text.secondary,
        fontSize: 13,
    },
    requestsContainer: {
        marginBottom: 24,
    },
    requestCard: {
        backgroundColor: colors.surface,
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
    },
    requestClient: {
        fontWeight: 'bold',
        color: colors.text.primary,
        fontSize: 15,
    },
    requestService: {
        color: colors.text.secondary,
        fontSize: 13,
        marginBottom: 2,
    },
    requestStatus: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 13,
    },
});
