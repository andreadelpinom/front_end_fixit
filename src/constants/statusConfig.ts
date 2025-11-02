/**
 * Configuración centralizada de estados y colores
 * Single Source of Truth para estados de la aplicación
 */

import { colors } from "../theme/colors";

// ===== REQUEST STATUS =====
export const REQUEST_STATUSES = {
  ALL: "Todos",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Finalizado",
  CANCELLED: "Cancelado",
  PUBLISHED: "Publicado",
} as const;

export type RequestStatus =
  (typeof REQUEST_STATUSES)[keyof typeof REQUEST_STATUSES];

export const REQUEST_STATUS_LIST: RequestStatus[] = [
  REQUEST_STATUSES.ALL,
  REQUEST_STATUSES.IN_PROGRESS,
  REQUEST_STATUSES.COMPLETED,
  REQUEST_STATUSES.CANCELLED,
];

export const REQUEST_STATUS_COLORS: Record<string, string> = {
  [REQUEST_STATUSES.IN_PROGRESS]: colors.primary,
  [REQUEST_STATUSES.COMPLETED]: colors.status.success,
  [REQUEST_STATUSES.CANCELLED]: colors.status.error,
  [REQUEST_STATUSES.PUBLISHED]: colors.status.info,
};

export const getRequestStatusColor = (status: string): string =>
  REQUEST_STATUS_COLORS[status] || colors.text.secondary;

// ===== CERTIFICATION STATUS =====
export const CERTIFICATION_STATUSES = {
  ALL: "Todos",
  VALID: "Vigente",
  EXPIRING_SOON: "Por Expirar",
  EXPIRED: "Expirado",
} as const;

export type CertificationStatus =
  (typeof CERTIFICATION_STATUSES)[keyof typeof CERTIFICATION_STATUSES];

export const CERTIFICATION_STATUS_LIST: CertificationStatus[] = [
  CERTIFICATION_STATUSES.ALL,
  CERTIFICATION_STATUSES.VALID,
  CERTIFICATION_STATUSES.EXPIRING_SOON,
  CERTIFICATION_STATUSES.EXPIRED,
];

export const CERTIFICATION_STATUS_COLORS: Record<string, string> = {
  [CERTIFICATION_STATUSES.VALID]: colors.status.success,
  [CERTIFICATION_STATUSES.EXPIRING_SOON]: colors.status.warning,
  [CERTIFICATION_STATUSES.EXPIRED]: colors.status.error,
};

export const getCertificationStatusColor = (status: string): string =>
  CERTIFICATION_STATUS_COLORS[status] || colors.text.secondary;

// ===== SERVICE STATUS =====
export const SERVICE_STATUSES = {
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
} as const;

export type ServiceStatus =
  (typeof SERVICE_STATUSES)[keyof typeof SERVICE_STATUSES];

// ===== TAB CONFIGURATIONS =====
export interface TabConfig {
  id: string;
  label: string;
  count?: number;
}

export const TECHNICIAN_REQUEST_TABS: TabConfig[] = [
  { id: "disponibles", label: "Disponibles", count: 3 },
  { id: "enProgreso", label: "En Progreso", count: 2 },
  { id: "finalizadas", label: "Finalizadas", count: 2 },
];

// ===== METRICS CONFIGURATION =====
export type MetricType = "earnings" | "services";

export const METRIC_TYPES = {
  EARNINGS: "earnings" as MetricType,
  SERVICES: "services" as MetricType,
} as const;

export const METRIC_CONFIG = {
  [METRIC_TYPES.EARNINGS]: {
    label: "Ganancias",
    maxValue: 2000,
    format: (value: number) => `$${value}`,
  },
  [METRIC_TYPES.SERVICES]: {
    label: "Servicios",
    maxValue: 25,
    format: (value: number) => `${value}`,
  },
};

// ===== ICONS =====
export const ICONS = {
  SEARCH: "🔍",
  NOTIFICATION: "🔔",
  STAR: "⭐",
  CHECK: "✓",
  TIMER: "⏱️",
  CALENDAR: "📅",
  LOCATION: "📍",
  USER: "👤",
  PHONE: "📞",
  TROPHY: "🏆",
  BACK: "←",
  ADD: "+",
  INFO: "ℹ️",
  WARNING: "⚠️",
  ERROR: "❌",
  SUCCESS: "✅",
  CERTIFICATE: "📜",
  DOWNLOAD: "⬇️",
  FIRE: "🔥",
  LIGHTBULB: "💡",
  SHIELD: "🛡️",
  TOOLS: "🛠️",
  ELECTRICITY: "⚡",
  WRENCH: "🔧",
  CLIPBOARD: "📋",
  EMPTY: "📋",
} as const;

// ===== PLACEHOLDERS =====
export const PLACEHOLDERS = {
  SEARCH_REQUESTS: "Buscar solicitudes...",
  SEARCH_SERVICES: "Buscar servicios...",
  SEARCH_CERTIFICATIONS: "Buscar certificaciones...",
  NO_RESULTS: "No hay resultados",
} as const;

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  LOGOUT_FAILED: "No se pudo cerrar sesión",
  LOAD_FAILED: "Error al cargar los datos",
  SAVE_FAILED: "Error al guardar los cambios",
  NETWORK_ERROR: "Error de conexión",
} as const;