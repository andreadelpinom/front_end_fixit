import { View, Text, TouchableOpacity } from "react-native";
import { TechnicianCard as TechnicianType, OfferCard as OfferType } from "../interface";
import { HomeStyles as styles } from "../styles";
import { Option } from "../types";

// Hero Slide
export const HeroSlide = () => (
    <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Encuentra los mejores técnicos verificados</Text>
        <Text style={styles.heroSubtitle}>Servicio garantizado y profesionales certificados</Text>
        <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>Explorar ahora</Text>
        </TouchableOpacity>
    </View>
);

// Category Chip
interface CategoryChipProps {
    category: Option;
    selected: boolean;
    onPress: (id: string) => void;
}
export const CategoryChip = ({ category, selected, onPress }: CategoryChipProps) => (
    <TouchableOpacity
        style={[styles.categoryChip, selected && styles.categoryChipSelected]}
        onPress={() => onPress(category.id)}
    >
        <Text style={[styles.categoryIcon, selected && { color: "#FFF" }]}>{category.icon}</Text>
        <Text style={[styles.categoryText, selected && { color: "#FFF" }]}>{category.label}</Text>
    </TouchableOpacity>
);

// Technician Card
interface TechnicianCardProps {
    tech: TechnicianType;
    onPress: () => void;
}
export const TechnicianCard = ({ tech, onPress }: TechnicianCardProps) => (
    <View style={styles.techCard}>
        <View style={styles.techHeader}>
            <View style={styles.techAvatar}>
                <Text style={styles.techAvatarText}>{tech.name.charAt(0)}</Text>
            </View>
            <View style={styles.techInfo}>
                <Text style={styles.techName}>{tech.name}</Text>
                <Text style={styles.techRole}>{tech.specialty}</Text>
                <View style={styles.techMetaRow}>
                    <Text style={styles.techMeta}>⭐ {tech.rating}</Text>
                    <Text style={styles.techMeta}>• {tech.distanceKm} km</Text>
                </View>
            </View>
            <View style={[styles.onlineDot, { backgroundColor: tech.isOnline ? "#4CAF50" : "#CCC" }]} />
        </View>
        <TouchableOpacity style={styles.viewProfileBtn} onPress={onPress}>
            <Text style={styles.viewProfileText}>👁️ Ver perfil</Text>
        </TouchableOpacity>
    </View>
);

// Offer Card
interface OfferCardProps {
    offer: OfferType;
}
export const OfferCard = ({ offer }: OfferCardProps) => (
    <View style={styles.offerCard}>
        <View style={styles.offerHeader}>
            <Text style={styles.offerTitle} numberOfLines={1}>{offer.title}</Text>
            {offer.urgent && (
                <View style={styles.urgentBadge}>
                    <Text style={styles.urgentText}>Urgente</Text>
                </View>
            )}
        </View>
        <Text style={styles.offerDesc} numberOfLines={2}>{offer.description}</Text>
        <View style={styles.offerFooter}>
            <Text style={styles.offerValid}>⏱ {offer.validUntil}</Text>
            <Text style={styles.offerPrice}>Desde {offer.fromPrice}</Text>
        </View>
    </View>
);
