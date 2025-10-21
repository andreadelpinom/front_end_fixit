import { SvgProps } from "react-native-svg";

export type StepType = 1 | 2 | 3 | 4;

export type Props = SvgProps & { color?: string; size?: number; filled?: boolean };

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

export type User = { id: string; name: string } | null;

export type AuthContextType = {
    user: User;
    sessionChecked: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

export type Request = {
    id: string; title: string; description: string;
    client: string; clientPhone: string;
    clientRating: number; clientReviews: number;
    date: string; time: string; location: string; address: string;
    price: number; urgency: 'Normal' | 'Urgente';
    status: string; isNew: boolean; category: string;
    details: string[]; requirements: string[];
};

// Tipos simulados
export type Status = "Finalizado" | "Cancelado" | "En progreso";

export type TecnicoTabParamList = {
    Home: undefined;
    Performance: undefined;
    Solicitudes: undefined;
    Profile: undefined;
};

export type TecnicoStackParamList = {
    TecnicoTabs: undefined;
    TechnicianRequestDetail: { id: string } | undefined;
    Certifications: undefined;
};

export type CertificationItemProps = { item: { id: string; name: string; issuer: string; date: string } };

export type SkillItemProps = { item: { id: string; name: string; level: string } };