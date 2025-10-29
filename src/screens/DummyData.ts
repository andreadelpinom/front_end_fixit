import { Option } from "../types";
import {
    TechnicianCard, OfferCard, QuickAccessItem,
    SettingItem, RequestDetail, FavoriteTechnician
    , ServiceHistoryItem, FrequentService
} from "../interface";

// ───────────────────────────────
// Constants
// ───────────────────────────────
export const SERVICE_CATEGORIES: Option[] = [
    { id: "electricidad", label: "Electricidad", value: "1", icon: "⚡", description: "Instalaciones y reparaciones eléctricas" },
    { id: "plomeria", label: "Plomería", value: "2", icon: "🔧", description: "Reparaciones de tuberías y grifería" },
    { id: "carpinteria", label: "Carpintería", value: "3", icon: "🪚", description: "Puertas, marcos y trabajos en madera" },
    { id: "climatizacion", label: "Climatización", value: "4", icon: "🌬️", description: "Aire acondicionado y calefacción" },
    { id: "limpieza", label: "Limpieza", value: "5", icon: "🧹", description: "Servicios de limpieza profunda" },
    { id: "pintura", label: "Pintura", value: "6", icon: "🎨", description: "Pintura de interiores y exteriores" },
];

export const DURATION_OPTIONS: Option[] = [
    { id: "1", label: "Menos de 1 hora", value: "<1h" },
    { id: "2", label: "1-2 horas", value: "1-2h" },
    { id: "3", label: "2-4 horas", value: "2-4h" },
    { id: "4", label: "4-8 horas", value: "4-8h" },
    { id: "5", label: "Más de 8 horas", value: ">8h" },
];

export const AVAILABILITY_OPTIONS: Option[] = [
    { id: "1", label: "Hoy", value: "today" },
    { id: "2", label: "Mañana", value: "tomorrow" },
    { id: "3", label: "Esta semana", value: "this_week" },
    { id: "4", label: "Próxima semana", value: "next_week" },
    { id: "5", label: "Por acordar", value: "flexible" },
];

// ───────────────────────────────
// Top Technicians of the Month
// ───────────────────────────────
export const TOP_TECHNICIANS: TechnicianCard[] = [
    { id: "t1", name: "Carlos Méndez", specialty: "Electricista Certificado", rating: 4.9, distanceKm: 2.3, isOnline: true },
    { id: "t2", name: "Lucía Pérez", specialty: "Plomería", rating: 4.8, distanceKm: 1.1, isOnline: true },
    { id: "t3", name: "Jorge Ruiz", specialty: "Pintura", rating: 4.7, distanceKm: 3.5, isOnline: false }
];

// ───────────────────────────────
// Offers Near You
// ───────────────────────────────
export const OFFERS: OfferCard[] = [
    { id: "o1", title: "20% OFF en Plomería", description: "Reparación de fugas e instalaciones", urgent: true, validUntil: "Válido hasta hoy", fromPrice: "$800" },
    { id: "o2", title: "Limpieza de aire A/C", description: "Mantenimiento preventivo", validUntil: "Esta semana", fromPrice: "$600" },
    { id: "o3", title: "Pintura express", description: "Interiores de 1 habitación", validUntil: "Hasta fin de mes", fromPrice: "$1,200" }
];

export const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
    { id: "history", title: "Historial de solicitudes", subtitle: "Ver todas mis solicitudes completadas", icon: "📋", count: 156 },
    { id: "active", title: "Servicios activos", subtitle: "Solicitudes en progreso", icon: "⚙️", count: 3 },
    { id: "notifications", title: "Notificaciones", subtitle: "Configurar alertas y avisos", icon: "🔔", count: 2 },
    { id: "support", title: "Soporte técnico", subtitle: "Ayuda y contacto", icon: "🎧" }
];

export const SETTINGS_ITEMS: SettingItem[] = [
    { id: "privacy", title: "Privacidad", icon: "🔒" },
    { id: "notifications", title: "Notificaciones", icon: "🔔" },
    { id: "payments", title: "Métodos de pago", icon: "💳" },
    { id: "language", title: "Idioma", icon: "🌐" }
];

export const REQUEST_HISTORY: Record<string, RequestDetail> = {
    h1: {
        id: "REQ-ABC123",
        idTipoServicio: 1,
        codigoParroquia: "PA01",
        tituloProblema: "Electricidad - Reparación",
        descripcionProblema: "Arreglar interruptores y tomacorrientes",
        client: "María González",
        clientPhone: "+593987654321",
        clientRating: 4.9,
        clientReviews: 234,
        location: "Centro, Guayaquil",
        address: "Calle Principal #123, Apto 4B",
        status: "Finalizado",
        isNew: false,
        category: "Electricidad",
        details: ["Instalar 3 interruptores de pared", "Instalar 4 tomacorrientes", "Verificar circuitos existentes", "Pintura de acabado"],
        requirements: ["Experiencia en instalación eléctrica", "Certificación vigente", "Herramientas propias"],
        time: "14:30",
        fechaProgramada: "2024-01-14",
        duracionEstimadaMin: 120
    },
    h2: {
        id: "REQ-DEF456",
        idTipoServicio: 2,
        codigoParroquia: "PA02",
        tituloProblema: "Plomería - Instalación",
        descripcionProblema: "Instalar grifería y tuberías",
        client: "Juan Pérez",
        clientPhone: "+593987654322",
        clientRating: 4.5,
        clientReviews: 120,
        location: "Norte, Guayaquil",
        address: "Av. Principal #456",
        status: "Cancelado",
        isNew: false,
        category: "Plomería",
        details: ["Instalar tubería principal", "Revisar fugas", "Instalar grifería"],
        requirements: ["Experiencia en plomería", "Herramientas propias"],
        time: "10:00",
        fechaProgramada: "2024-01-09",
        duracionEstimadaMin: 90
    },
};

export const favoriteTechnicians: FavoriteTechnician[] = [
    { id: "t1", name: "Carlos Mendoza", specialty: "Electricidad", rating: 4.8, jobs: 127 },
    { id: "t2", name: "Ana Rodriguez", specialty: "Plomería", rating: 4.9, jobs: 89 }
];

export const historyItems: ServiceHistoryItem[] = [
    { id: "h1", title: "Electricidad - Reparación", code: "REQ-ABC123", status: "Finalizado", date: "14/1/2024" },
    { id: "h2", title: "Plomería - Instalación", code: "REQ-DEF456", status: "Cancelado", date: "9/1/2024" },
    { id: "h3", title: "Pintura - Mantenimiento", code: "REQ-GHI789", status: "Finalizado", date: "4/1/2024" }
];

export const frequentServices: FrequentService[] = [
    { id: "f1", title: "Electricidad - Reparación", times: 3, lastDate: "14/1/2024", icon: "⚡" },
    { id: "f2", title: "Plomería - Instalación", times: 2, lastDate: "9/1/2024", icon: "💧" }
];

// Map specialties to icons
export const SPECIALTY_ICONS: Record<string, string> = {
    Electricidad: "⚡",
    Plomería: "💧",
    Pintura: "🎨",
};