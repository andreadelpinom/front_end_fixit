import { View, Text, TouchableOpacity } from "react-native";
import { FavoriteTechCardProps, HistoryItemCardProps, FrequentServiceCardProps } from "../interface";
import { ServicesScreenStyles as styles } from "../styles";
import { statusStyle, statusTextStyle } from "../helpers";

export const FavoriteTechCard = ({ tech, onPress }: FavoriteTechCardProps) => (
    <View style={styles.favoriteCard}>
        <View style={styles.favoriteLeft}>
            <View style={styles.avatar}><Text style={styles.avatarText}>👤</Text></View>
            <View style={{ flex: 1 }}>
                <Text style={styles.techName}>{tech.name}</Text>
                <Text style={styles.techSpecialty}>
                    {tech.specialty === "Electricidad" ? "⚡" : "💧"} {tech.specialty}
                </Text>
                <View style={styles.ratingRow}>
                    <Text style={styles.stars}>⭐ ⭐ ⭐ ⭐</Text>
                    <Text style={styles.ratingNumber}>{tech.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.jobsText}>{tech.jobs} trabajos</Text>
            </View>
        </View>
        <TouchableOpacity style={styles.primaryPill} onPress={onPress}>
            <Text style={styles.primaryPillText}>Solicitar</Text>
        </TouchableOpacity>
    </View>
);

export const HistoryItemCard = ({ item, onPress }: HistoryItemCardProps) => {
    let statusIcon: string;

    if (item.status === "Finalizado") {
        statusIcon = "✔";
    } else if (item.status === "Cancelado") {
        statusIcon = "✖";
    } else {
        statusIcon = "•";
    }

    return (
        <View style={styles.historyItem}>
            <View style={{ flex: 1 }}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                <Text style={styles.historyCode}>{item.code}</Text>
                <View style={styles.historyMetaRow}>
                    <View style={[styles.statusBadge, statusStyle(item.status)]}>
                        <Text style={[styles.statusText, statusTextStyle(item.status)]}>
                            {statusIcon} {item.status}
                        </Text>
                    </View>
                    <View style={styles.datePill}>
                        <Text style={styles.dateText}>📅 {item.date}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={onPress}><Text style={styles.eyeIcon}>👁️</Text></TouchableOpacity>
        </View>
    );
};

export const FrequentServiceCard = ({ service, onPress }: FrequentServiceCardProps) => (
    <View style={styles.frequentItem}>
        <View style={styles.frequentLeft}>
            <View style={styles.frequentIconWrap}><Text style={styles.frequentIcon}>{service.icon}</Text></View>
            <View style={{ flex: 1 }}>
                <Text style={styles.frequentTitle} numberOfLines={1}>{service.title}</Text>
                <View style={styles.frequentMetaRow}>
                    <Text style={styles.frequentMeta}>{service.times} veces</Text>
                    <Text style={styles.frequentMeta}>• {service.lastDate}</Text>
                </View>
            </View>
        </View>
        <TouchableOpacity style={styles.secondaryPill} onPress={onPress}>
            <Text style={styles.secondaryPillText}>Solicitar</Text>
        </TouchableOpacity>
    </View>
);

