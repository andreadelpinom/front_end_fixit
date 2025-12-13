import { StyleSheet } from 'react-native';

/**
 * Estilos compartidos para todas las pantallas de administración
 * Mantiene consistencia visual y reduce duplicación de código
 */

// Paleta de colores para Admin
export const AdminColors = {
  background: '#F2F2F7',
  primary: '#2C3E50',
  secondary: '#34495E',
  card: '#FFFFFF',
  border: '#BDC3C7',
  textPrimary: '#2C3E50',
  textSecondary: '#7F8C8D',
  textLight: '#95A5A6',
  
  // Estados
  success: '#27AE60',
  successLight: '#D5F4E6',
  warning: '#F39C12',
  warningLight: '#FFF3CD',
  danger: '#E74C3C',
  dangerLight: '#FADBD8',
  info: '#3498DB',
  purple: '#9B59B6',
};

// Estilos base compartidos
export const AdminStyles = StyleSheet.create({
  // === CONTENEDORES ===
  container: {
    flex: 1,
    backgroundColor: AdminColors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AdminColors.background,
  },
  scroll: {
    flex: 1,
  },
  listContent: {
    padding: 12,
  },
  section: {
    padding: 16,
  },

  // === TARJETAS ===
  card: {
    backgroundColor: AdminColors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
  },

  // === BÚSQUEDA Y FILTROS ===
  searchContainer: {
    padding: 12,
    backgroundColor: AdminColors.card,
    borderBottomWidth: 1,
    borderBottomColor: AdminColors.border,
  },
  searchInput: {
    backgroundColor: AdminColors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: AdminColors.card,
    borderBottomWidth: 1,
    borderBottomColor: AdminColors.border,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: AdminColors.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: AdminColors.primary,
    shadowColor: AdminColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: AdminColors.textSecondary,
  },
  tabBtnTextActive: {
    color: '#fff',
  },

  // === BADGES DE ESTADO ===
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusActive: {
    backgroundColor: AdminColors.successLight,
  },
  statusInactive: {
    backgroundColor: AdminColors.dangerLight,
  },
  statusPending: {
    backgroundColor: AdminColors.warningLight,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: AdminColors.textPrimary,
  },

  // === BADGES DE ROL ===
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },

  // === TEXTOS ===
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AdminColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: AdminColors.textSecondary,
    marginBottom: 2,
  },
  smallText: {
    fontSize: 12,
    color: AdminColors.textLight,
  },
  dateText: {
    fontSize: 11,
    color: AdminColors.textLight,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AdminColors.textPrimary,
    marginBottom: 12,
  },

  // === BOTONES DE ACCIÓN ===
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  
  // Variantes de botones
  primaryBtn: {
    backgroundColor: AdminColors.primary,
  },
  successBtn: {
    backgroundColor: AdminColors.success,
  },
  dangerBtn: {
    backgroundColor: AdminColors.danger,
  },
  infoBtn: {
    backgroundColor: AdminColors.info,
  },
  warningBtn: {
    backgroundColor: AdminColors.warning,
  },
  purpleBtn: {
    backgroundColor: AdminColors.purple,
  },

  // === ESTADOS VACÍOS ===
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: AdminColors.textLight,
  },

  // === METADATA ===
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});

/**
 * Función helper para crear estilos de badges de rol con colores específicos
 */
export const getRoleBadgeColor = (role: string): string => {
  switch (role.toUpperCase()) {
    case 'ADMIN':
      return '#E74C3C';
    case 'TECNICO':
      return '#3498DB';
    case 'CLIENTE':
      return '#27AE60';
    default:
      return AdminColors.textSecondary;
  }
};

/**
 * Función helper para obtener color de estado
 */
export const getStatusColor = (status: string): string => {
  const statusUpper = status.toUpperCase();
  if (statusUpper.includes('ACTIV') || statusUpper.includes('VERIFIC') || statusUpper.includes('ACEPT')) {
    return AdminColors.successLight;
  }
  if (statusUpper.includes('PENDIENTE') || statusUpper.includes('REVISION')) {
    return AdminColors.warningLight;
  }
  if (statusUpper.includes('INACTIV') || statusUpper.includes('RECHAZ') || statusUpper.includes('BLOQ')) {
    return AdminColors.dangerLight;
  }
  return AdminColors.background;
};
