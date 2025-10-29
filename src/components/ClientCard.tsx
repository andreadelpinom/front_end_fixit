import { View, Text, TouchableOpacity } from "react-native";
import { ClientCardStyles as styles } from "../styles";
import { ClientCardProps } from "../interface";

export const ClientCard = ({ name, phone, rating, reviews, onChat }: ClientCardProps) => (
    <View style={styles.clientCard}>
        <View style={styles.clientAvatar}>
            <Text style={styles.clientInitial}>{name.charAt(0)}</Text>
        </View>
        <View style={styles.clientInfo}>
            <Text style={styles.clientName}>{name}</Text>
            <View style={styles.clientRating}>
                <Text style={styles.rating}>⭐ {rating}</Text>
                <Text style={styles.reviews}>({reviews} reseñas)</Text>
            </View>
            <Text style={styles.phone}>{phone}</Text>
        </View>
        <TouchableOpacity style={styles.chatButton} onPress={onChat}>
            <Text style={styles.chatButtonText}>💬</Text>
        </TouchableOpacity>
    </View>
);
