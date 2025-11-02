import { Option } from "../types";
import {
    TechnicianCard, OfferCard, QuickAccessItem,
    SettingItem, RequestDetail, ServiceHistoryItem, FrequentService
} from "../interface";

// ───────────────────────────────
// 📦 Catálogos base
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

export const SPECIALTY_ICONS: Record<string, string> = {
    Electricidad: "⚡",
    Plomería: "💧",
    Pintura: "🎨",
    Carpintería: "🪚",
    Climatización: "🌬️",
    Limpieza: "🧹",
};

// ───────────────────────────────
// 👨‍🔧 Técnicos
// ───────────────────────────────

export const TECHNICIANS: TechnicianCard[] = [
    { id: "t1", name: "Carlos Méndez", specialty: "Electricista Certificado", rating: 4.9, distanceKm: 2.3, isOnline: true },
    { id: "t2", name: "Lucía Pérez", specialty: "Plomería", rating: 4.8, distanceKm: 1.1, isOnline: true },
    { id: "t3", name: "Jorge Ruiz", specialty: "Pintura", rating: 4.7, distanceKm: 3.5, isOnline: false },
    { id: "t4", name: "Ana Rodríguez", specialty: "Plomería", rating: 4.9, distanceKm: 4.2, isOnline: true }
];

// ───────────────────────────────
// 💸 Ofertas y accesos rápidos
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

// ───────────────────────────────
// 🧾 Solicitudes e historial
// ───────────────────────────────

export const REQUESTS: RequestDetail[] = [
    {
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
        details: ["Instalar 3 interruptores", "Instalar 4 tomacorrientes", "Verificar circuitos existentes", "Pintura de acabado"],
        requirements: ["Certificación vigente", "Herramientas propias"],
        time: "14:30",
        fechaProgramada: "2024-01-14",
        duracionEstimadaMin: 120
    },
    {
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
    }
];

export const HISTORY_ITEMS: ServiceHistoryItem[] = [
    { id: "h1", title: "Electricidad - Reparación", code: "REQ-ABC123", status: "Finalizado", date: "14/1/2024" },
    { id: "h2", title: "Plomería - Instalación", code: "REQ-DEF456", status: "Cancelado", date: "9/1/2024" }
];

export const FREQUENT_SERVICES: FrequentService[] = [
    { id: "f1", title: "Electricidad - Reparación", times: 3, lastDate: "14/1/2024", icon: "⚡" },
    { id: "f2", title: "Plomería - Instalación", times: 2, lastDate: "9/1/2024", icon: "💧" }
];

// ───────────────────────────────
// 🧰 Certificaciones y habilidades
// ───────────────────────────────

export const CERTIFICATIONS = [
    {
        id: "1",
        name: "Electricidad Residencial",
        issuer: "Instituto Técnico Nacional",
        issueDate: "2023-06-15",
        expiryDate: "2026-06-15",
        status: "Vigente",
        credentialId: "ETRN-2023-001",
        icon: "⚡"
    },
    {
        id: "2",
        name: "Plomería Avanzada",
        issuer: "Colegio de Técnicos",
        issueDate: "2023-08-20",
        expiryDate: "2025-08-20",
        status: "Vigente",
        credentialId: "PLOM-2023-002",
        icon: "🔧"
    },
    {
        id: "3",
        name: "Aire Acondicionado",
        issuer: "Asociación de Técnicos",
        issueDate: "2023-10-10",
        expiryDate: "2024-10-10",
        status: "Por Expirar",
        credentialId: "AIRE-2023-003",
        icon: "❄️"
    }
];

export const SKILLS = [
    { id: "1", name: "Electricidad", level: "Avanzado" },
    { id: "2", name: "Plomería", level: "Avanzado" },
    { id: "3", name: "Aire Acondicionado", level: "Intermedio" },
    { id: "4", name: "Carpintería", level: "Intermedio" }
];

// ───────────────────────────────
// 📊 Desempeño y datos del usuario
// ───────────────────────────────

export const USER_DATA = {
    name: "Carlos Mendoza",
    email: "carlos.mendoza@fixit.com",
    completedServices: 156,
    averageRating: 4.8,
    responseTime: "15 min",
    joinDate: "Enero 2023",
    isVerified: true
};

export const PERFORMANCE_METRICS = [
    { id: "1", label: "Servicios Completados", value: "156", icon: "✓" },
    { id: "2", label: "Rating Promedio", value: "4.8", icon: "⭐" },
    { id: "3", label: "Clientes Satisfechos", value: "98%", icon: "😊" },
    { id: "4", label: "Tiempo Respuesta", value: "15 min", icon: "⏱️" }
];

export const MONTHLY_DATA = [
    { month: "Ene", services: 12, earnings: 1200 },
    { month: "Feb", services: 15, earnings: 1450 },
    { month: "Mar", services: 18, earnings: 1680 },
    { month: "Abr", services: 14, earnings: 1320 },
    { month: "May", services: 20, earnings: 1950 },
    { month: "Jun", services: 17, earnings: 1620 }
];

export const MY_SERVICES = [
  {
    id: "s1",
    title: "Reparación Eléctrica",
    description: "Instalación de tomacorrientes e interruptores",
    rating: 4.8,
    completions: 124,
    price: "$25",
    isActive: true
  },
  {
    id: "s2",
    title: "Instalación de Grifería",
    description: "Cambio y reparación de llaves de agua",
    rating: 4.9,
    completions: 98,
    price: "$30",
    isActive: true
  },
  {
    id: "s3",
    title: "Mantenimiento de Aire Acondicionado",
    description: "Limpieza y carga de gas refrigerante",
    rating: 4.7,
    completions: 45,
    price: "$40",
    isActive: false
  },
  {
    id: "s4",
    title: "Pintura Interior",
    description: "Paredes, techos y molduras",
    rating: 4.6,
    completions: 62,
    price: "$50",
    isActive: false
  }
];
