import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SvgProps } from "react-native-svg";
import { TextInput } from "react-native";

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

// Corrected Request type aligned with backend
export type Request = {
    id: number;
    idTipoServicio: number;
    codigoParroquia: string;
    tituloProblema: string;
    descripcionProblema: string;
    costoEstimado?: number;
    costoPromocion?: number;
    promocion?: boolean;
    fechaProgramada?: string;
    duracionEstimadaMin?: number;
    estadoSolicitud?: string;
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

export interface StepFormProps {
    readonly refs: {
        priceRef: React.RefObject<TextInput | null>;
        dateRef: React.RefObject<TextInput | null>;
        timeRef: React.RefObject<TextInput | null>;
        codeRef: React.RefObject<TextInput | null>;
    };
}


export type AcceptRequestFlowProps = {
    isOpen: boolean;              // added
    onClose: () => void;          // added
    request: Request;             // request is required
};

export type IconProps = { color?: string; size?: number; filled?: boolean };

export type CertificationItemProps = { item: { id: string; name: string; issuer: string; date: string } };

export type SkillItemProps = { item: { id: string; name: string; level: string } };

export type IconType = 'clipboard' | 'home' | 'createService' | 'profile' | 'services';


export interface Option {
    id: string;
    label: string;
    value: string;
    icon?: string;
    description?: string;
}

export interface CreateServiceProps {
    readonly navigation: any;
}

export interface StepProps<T = unknown> {
    readonly data: T;
    readonly onChange?: (field: keyof T, value: T[keyof T]) => void;
}

export interface OptionItemProps {
    readonly item: Option;
    readonly selected: string;
    readonly onSelect: (value: string) => void;
}

export interface FormInputProps {
    readonly label: string;
    readonly value: string;
    readonly onChangeText: (value: string) => void;
    readonly placeholder?: string;
    readonly multiline?: boolean;
    readonly prefix?: string;
}

// Define stack navigator param list
export type ClientStackParamList = {
    ClientTabs: undefined;
    RequestDetail: { requestId: string }; // matches your route.params usage
    CreateService: undefined;
};

// Define tab navigator param list
export type ClientTabParamList = {
    Home: undefined;
    Services: undefined;
    CreateService: undefined;
    Profile: undefined;
};

export type ScreenProps = NativeStackScreenProps<ClientStackParamList, "RequestDetail">;
