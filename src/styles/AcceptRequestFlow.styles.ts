import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../theme/colors";

const windowHeight = Dimensions.get("window").height;

export default StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    modalContent: {
        backgroundColor: colors.background,
        borderRadius: 16,
        width: "100%",
        height: windowHeight * 0.75,
        display: "flex",
        flexDirection: "column"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    closeButton: {
        fontSize: 20,
        color: colors.text.tertiary,
        fontWeight: "600"
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.text.secondary
    },
    progressContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 16
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.border
    },
    progressDotActive: {
        backgroundColor: colors.primary
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: 20
    },
    stepContent: {
        marginBottom: 16
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text.primary,
        marginBottom: 12
    },
    stepDescription: {
        fontSize: 13,
        color: colors.text.secondary,
        lineHeight: 18,
        marginBottom: 12
    },
    requestDetailLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.text.primary,
        marginBottom: 8
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
        paddingVertical: 2
    },
    detailLabel: {
        fontSize: 12,
        color: colors.text.secondary,
        fontWeight: "500"
    },
    detailValue: {
        fontSize: 12,
        color: colors.text.primary,
        fontWeight: "600"
    },
    detailValueHighlight: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: "700"
    },
    formGroup: {
        marginBottom: 16
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.text.primary,
        marginBottom: 6
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: colors.text.primary
    },
    inputHint: {
        fontSize: 11,
        color: colors.text.secondary,
        marginTop: 4,
        fontStyle: "italic"
    },
    codeHint: {
        fontSize: 11,
        color: colors.text.tertiary,
        textAlign: "center",
        marginTop: 12
    },
    successIcon: {
        fontSize: 48,
        textAlign: "center",
        marginBottom: 12
    },
    footer: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background
    },
    primaryButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center"
    },
    primaryButtonDisabled: {
        backgroundColor: colors.border,
        opacity: 0.5
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600"
    },
    secondaryButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center"
    },
    secondaryButtonText: {
        color: colors.text.primary,
        fontSize: 13,
        fontWeight: "600"
    },
    completeButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: colors.status.success,
        alignItems: "center",
        justifyContent: "center"
    },
    completeButtonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600"
    }
});
