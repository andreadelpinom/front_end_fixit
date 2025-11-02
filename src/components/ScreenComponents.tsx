/**
 * Componentes compartidos reutilizables para pantallas
 * Sigue principios SOLID, DRY y Single Source of Truth
 */

import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { colors } from "../theme/colors";

// ===== TYPES =====
export interface TitleSectionProps {
    title: string;
    subtitle: string;
    style?: any;
}

export interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    style?: any;
}

export interface FilterButtonProps {
    label: string;
    isActive: boolean;
    onPress: () => void;
    style?: any;
}

export interface FilterListProps<T extends string> {
    items: readonly T[];
    activeItem: T;
    onItemChange: (item: T) => void;
    style?: any;
}

export interface EmptyStateProps {
    icon?: string;
    message: string;
    submessage?: string;
    style?: any;
}

export interface StatItemProps {
    label: string;
    value: string | number;
    style?: any;
}

// ===== COMPONENTS =====

/**
 * Sección de título estándar para pantallas
 */
export const TitleSection = ({ title, subtitle, style }: TitleSectionProps) => (
    <View style={style?.container}>
        <Text style={style?.title}>{title}</Text>
        <Text style={style?.subtitle}>{subtitle}</Text>
    </View>
);

/**
 * Barra de búsqueda estándar
 */
export const SearchBar = ({
    value,
    onChangeText,
    placeholder = "Buscar...",
    style,
}: SearchBarProps) => (
    <View style={style?.container}>
        <TextInput
            style={style?.input}
            placeholder={placeholder}
            placeholderTextColor={colors.text.tertiary}
            value={value}
            onChangeText={onChangeText}
        />
        <Text style={style?.icon}>🔍</Text>
    </View>
);

/**
 * Botón de filtro individual
 */
export const FilterButton = ({
    label,
    isActive,
    onPress,
    style,
}: FilterButtonProps) => (
    <TouchableOpacity
        onPress={onPress}
        style={[style?.button, isActive && style?.buttonActive]}
    >
        <Text style={[style?.text, isActive && style?.textActive]}>{label}</Text>
    </TouchableOpacity>
);

/**
 * Lista horizontal de filtros genérica
 */
export function FilterList<T extends string>({
    items,
    activeItem,
    onItemChange,
    style,
}: Readonly<FilterListProps<T>>) {
    return (
        <View style={style?.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={style?.list}
            >
                {items.map((item) => (
                    <FilterButton
                        key={item}
                        label={item}
                        isActive={activeItem === item}
                        onPress={() => onItemChange(item)}
                        style={style?.button}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

/**
 * Estado vacío genérico
 */
export const EmptyState = ({
    icon = "📋",
    message,
    submessage,
    style,
}: EmptyStateProps) => (
    <View style={style?.container}>
        <Text style={style?.icon}>{icon}</Text>
        <Text style={style?.message}>{message}</Text>
        {submessage && <Text style={style?.submessage}>{submessage}</Text>}
    </View>
);

/**
 * Item de estadística individual
 */
export const StatItem = ({ label, value, style }: StatItemProps) => (
    <View style={style?.container}>
        <Text style={style?.label}>{label}</Text>
        <Text style={style?.value}>{value}</Text>
    </View>
);

/**
 * Sección con título e ícono
 */
export interface SectionProps {
    icon?: string;
    title: string;
    children: React.ReactNode;
    style?: any;
}

export const Section = ({ icon, title, children, style }: SectionProps) => (
    <View style={style?.container}>
        <Text style={style?.title}>
            {icon && `${icon} `}
            {title}
        </Text>
        {children}
    </View>
);

/**
 * Fila de información (label: value)
 */
export interface InfoRowProps {
    label: string;
    value: string;
    valueColor?: string;
    style?: any;
}

export const InfoRow = ({ label, value, valueColor, style }: InfoRowProps) => (
    <View style={style?.container}>
        <Text style={style?.label}>{label}</Text>
        <Text style={[style?.value, valueColor && { color: valueColor }]}>
            {value}
        </Text>
    </View>
);
