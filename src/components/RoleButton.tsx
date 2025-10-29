import { TouchableOpacity, Text } from "react-native";
import { ProfileStyles as styles } from "../styles";
import { client, technician } from "../theme/colors";

interface RoleButtonProps {
    role: "cliente" | "tecnico";
    currentRole: "cliente" | "tecnico";
    label: string;
    onPress: (role: "cliente" | "tecnico") => void;
}

export const RoleButton = ({ role, currentRole, label, onPress }: RoleButtonProps) => {
    const isActive = currentRole === role;
    const color = role === "tecnico" ? technician.primary : client.primary;

    return (
        <TouchableOpacity
            onPress={() => onPress(role)}
            style={[styles.roleButton, { borderColor: color }, isActive && { backgroundColor: color, borderColor: color }]}
        >
            <Text style={[styles.roleButtonText, isActive && { color: "#fff" }]}>{label}</Text>
        </TouchableOpacity>
    );
};
