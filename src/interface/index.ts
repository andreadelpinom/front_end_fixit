import { ReactNode } from "react";
import { IconType, Status } from "../types";

export interface Request {
    idTipoServicio: number;
    codigoParroquia: string;
    tituloProblema: string;
    descripcionProblema: string;
    costoEstimado?: number;
    costoPromocion?: number;
    promocion?: boolean;
    fechaProgramada?: string;
    duracionEstimadaMin?: number;
}

export interface RequestDetail extends Request {
    id: string; // internal frontend ID
    client: string;
    clientPhone: string;
    clientRating: number;
    clientReviews: number;
    location: string;
    address: string;
    status: "Publicado" | "Finalizado" | "Cancelado" | "En progreso";
    isNew: boolean;
    category: string;
    details: string[];
    requirements: string[];
    time: string;
}

export interface ClientCardProps {
    name: string;
    phone: string;
    rating: number;
    reviews: number;
    onChat?: () => void;
}

export interface GenericModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    content: React.ReactNode;
    footer?: React.ReactNode;
    animationType?: 'slide' | 'fade';
}

export interface AcceptRequestFlowProps {
    isOpen: boolean;
    onClose: () => void;
    request?: Request;
}

export interface CertificationBannerProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface HeaderNavProps {
    userName?: string;
    location?: string;
    notificationCount?: number;
    showProfilePhoto?: boolean;
    onNotificationClick?: () => void;
    onProfileClick?: () => void;
    role?: "client" | "admin" | "tecnico";
}

export interface TabIconProps {
    color?: string;
    size?: number;
}

export interface Notification {
    id: string;
    type: string;
    title: string;
    description: string;
    time: string;
    isUnread: boolean;
    icon?: string;
    action?: string;
    requestId?: string;
    redirectTo?: string;
}

export interface NotificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: "cliente" | "tecnico";
    isVerified: boolean;
    completedServices: number;
    averageRating: number;
    joinDate: string;
    certificates?: string[];
    // Flags para técnico
    isTechnicianRequested?: boolean;
    isTechnicianVerified?: boolean;
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isSignedIn: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        fullName: string,
        email: string,
        password: string,
        phone: string,
        role: "cliente" | "tecnico"
    ) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
    requestTechnician: () => void;
}

export interface AuthProviderProps {
    children: ReactNode;
}

export interface LoginScreenProps {
    navigation: any;
}

export interface RegisterScreenProps {
    navigation: any;
}

export enum Specialty {
    Electricidad = "Electricidad",
    Plomería = "Plomería",
}

export interface FavoriteTechnician {
    id: string;
    name: string;
    specialty: Specialty | string; // permite literales + otros strings
    rating: number;
    jobs: number;
}


export interface ServiceHistoryItem {
    id: string;
    title: string; // "Electricidad - Reparación"
    code: string; // REQ-ABC123
    status: Status;
    date: string; // 14/1/2024
}

export interface FrequentService {
    id: string;
    title: string; // "Electricidad - Reparación"
    times: number; // 3
    lastDate: string; // 14/1/2024
    icon: string; // emoji temporal
}

// Tipos de datos simulados (listos para conectar a backend)
export interface Category {
    id: string;
    name: string;
    icon: string; // emoji por ahora
}

export interface TechnicianCard {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    distanceKm: number;
    isOnline: boolean;
}

export interface OfferCard {
    id: string;
    title: string;
    description: string;
    urgent?: boolean;
    validUntil: string; // fecha legible
    fromPrice: string; // texto como "$800"
}

export interface StatsSectionProps {
    userData: {
        averageRating: number;
        completedServices: number;
        responseTime: string;
    };
}

export interface SkillsSectionProps {
    skills: Array<{ id: string; name: string; level: string }>;
}

export interface CertificationsSectionProps {
    certifications: Array<{ id: string; name: string; issuer: string; date: string }>;
}

export interface ProfileCardProps {
    userData: {
        name: string;
        email: string;
        joinDate: string;
        isVerified: boolean;
    };
}

export interface ActionButtonsProps {
    onContact: () => void;
    onViewRequests: () => void;
}

export interface LogoutButtonProps {
    onLogout: () => void;
}

export interface Props extends TabIconProps {
    type: IconType;
    filled?: boolean;
}

// Types
export interface ServiceCategory {
    id: string;
    label: string;
    icon: string;
    description: string;
}

export interface DurationOption {
    id: string;
    label: string;
    value: string;
}

export interface AvailabilityOption {
    id: string;
    label: string;
    value: string;
}

export interface FormData {
    category: string;
    title: string;
    description: string;
    price: string;
    duration: string;
    availability: string;
    location: string;
    address: string;
    notes: string;
}

export interface CategoryItemProps {
    readonly item: ServiceCategory;
    readonly category: string;
    readonly onPress: (id: string) => void;
}

export interface DurationOptionProps {
    readonly item: DurationOption;
    readonly duration: string;
    readonly onPress: (value: string) => void;
}

export interface AvailabilityOptionProps {
    readonly item: AvailabilityOption;
    readonly availability: string;
    readonly onPress: (value: string) => void;
}

export interface StepOneProps {
    readonly category: string;
    readonly setCategory: (id: string) => void;
}

export interface StepTwoProps {
    readonly title: string;
    readonly description: string;
    readonly price: string;
    readonly duration: string;
    readonly setField: (field: keyof FormData, value: string) => void;
    readonly setDuration: (value: string) => void;
}

export interface StepThreeProps {
    readonly location: string;
    readonly address: string;
    readonly availability: string;
    readonly notes: string;
    readonly setField: (field: keyof FormData, value: string) => void;
    readonly setAvailability: (value: string) => void;
}

export interface StepFourProps {
    readonly category: string;
    readonly title: string;
    readonly description: string;
    readonly price: string;
    readonly duration: string;
    readonly location: string;
    readonly address: string;
    readonly availability: string;
    readonly notes: string;
}

export interface CreateServiceProps {
    readonly navigation: any;
}

export interface UserData {
    name: string;
    email: string;
    completedServices: number;
    averageRating: number;
    responseTime: string;
    joinDate: string;
    isVerified: boolean;
    isTechnicianRequested?: boolean;
    role?: "cliente" | "tecnico";
}

export interface QuickAccessItem {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    count?: number | null;
}

export interface SettingItem {
    id: string;
    title: string;
    icon: string;
}

export interface Props {
    navigation: any;
    route: { params?: { requestId?: string } };
}

export interface FavoriteTechCardProps {
    tech: FavoriteTechnician;
    onPress: () => void;
}

export interface FrequentServiceCardProps {
    service: FrequentService;
    onPress: () => void;
}

export interface HistoryItemCardProps {
    item: ServiceHistoryItem;
    onPress: () => void;
}

export type IconOnlyProps = {
    type: 'home' | 'services' | 'createService' | 'profile' | 'clipboard';
    color?: string;
    size?: number;
    filled?: boolean;
};