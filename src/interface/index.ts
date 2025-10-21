import { ReactNode } from "react";
import { Status } from "../types";

interface Request {
    id: string;
    title: string;
    client: string;
    location: string;
    suggestedPrice: number;
    suggestedDate: string;
    suggestedTime: string;
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
