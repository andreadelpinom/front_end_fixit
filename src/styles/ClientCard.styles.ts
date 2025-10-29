import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default StyleSheet.create({
    clientCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 12,
    },
    clientAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
    },
    clientInitial: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },
    clientInfo: {
        flex: 1,
    },
    clientName: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.text.primary,
        marginBottom: 2,
    },
    clientRating: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginBottom: 2,
    },
    rating: {
        fontSize: 11,
        fontWeight: "600",
        color: colors.text.primary,
    },
    reviews: {
        fontSize: 10,
        color: colors.text.tertiary,
    },
    phone: {
        fontSize: 11,
        color: colors.text.secondary,
    },
    chatButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.borderLight,
        justifyContent: "center",
        alignItems: "center",
    },
    chatButtonText: {
        fontSize: 16,
    },
});
