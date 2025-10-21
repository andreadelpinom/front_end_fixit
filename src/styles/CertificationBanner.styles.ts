import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default StyleSheet.create({
    container: {
        alignItems: "center",
        marginBottom: 20,
        marginTop: 12
    },
    banner: {
        width: "100%",
        backgroundColor: colors.background,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5
    },
    closeButton: {
        position: "absolute",
        top: 12,
        right: 12,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.surface,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10
    },
    closeButtonText: {
        fontSize: 16,
        color: colors.text.tertiary,
        fontWeight: "700"
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.borderLight,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16
    },
    icon: {
        fontSize: 32
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text.primary,
        marginBottom: 4,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.primary,
        marginBottom: 8,
        textAlign: "center"
    },
    description: {
        fontSize: 13,
        color: colors.text.secondary,
        textAlign: "center",
        marginBottom: 16,
        lineHeight: 18
    },
    benefitsContainer: {
        width: "100%",
        marginBottom: 16,
        gap: 8
    },
    benefit: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 6
    },
    benefitIcon: {
        fontSize: 16,
        color: colors.status.success,
        fontWeight: "700"
    },
    benefitText: {
        fontSize: 12,
        color: colors.text.secondary,
        fontWeight: "500"
    },
    button: {
        width: "100%",
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center"
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600"
    }
});
