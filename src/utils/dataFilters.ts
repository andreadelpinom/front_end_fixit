/**
 * Utilidades para filtrado y búsqueda de datos
 * Implementa DRY y Single Responsibility Principle
 */

// ===== TYPES =====
export interface Searchable {
  [key: string]: any;
}

export type FilterPredicate<T> = (item: T) => boolean;

// ===== SEARCH UTILITIES =====

/**
 * Normaliza texto para búsqueda insensible a mayúsculas y acentos
 */
export const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "");

/**
 * Verifica si un texto contiene una consulta de búsqueda
 */
export const textContains = (text: string, query: string): boolean =>
  normalizeText(text).includes(normalizeText(query));

/**
 * Busca en múltiples campos de un objeto
 * 
 * @param item - Objeto a buscar
 * @param query - Texto de búsqueda
 * @param fields - Campos donde buscar
 * @returns true si encuentra coincidencia en algún campo
 * 
 * @example
 * searchInFields(request, 'plomería', ['titulo', 'descripcion', 'categoria'])
 */
export const searchInFields = <T extends Searchable>(
  item: T,
  query: string,
  fields: (keyof T)[]
): boolean => {
  if (!query) return true;

  return fields.some((field) => {
    const value = item[field];
    if (typeof value === "string") {
      return textContains(value, query);
    }
    return false;
  });
};

// ===== FILTER UTILITIES =====

/**
 * Filtra array combinando múltiples predicados
 * 
 * @example
 * filterByPredicates(items, [
 *   item => item.status === 'active',
 *   item => item.price > 100
 * ])
 */
export const filterByPredicates = <T>(
  items: T[],
  predicates: FilterPredicate<T>[]
): T[] => items.filter((item) => predicates.every((predicate) => predicate(item)));

/**
 * Crea un predicado para filtrar por estado
 * 
 * @example
 * const filterByStatus = createStatusFilter('status', 'Activo');
 * items.filter(filterByStatus);
 */
export const createStatusFilter = <T extends Searchable>(
  field: keyof T,
  status: string,
  allOption = "Todos"
): FilterPredicate<T> =>
  status === allOption ? () => true : (item) => item[field] === status;

/**
 * Crea un predicado para búsqueda en campos
 * 
 * @example
 * const searchFilter = createSearchFilter(['name', 'email'], 'john');
 * users.filter(searchFilter);
 */
export const createSearchFilter = <T extends Searchable>(
  fields: (keyof T)[],
  query: string
): FilterPredicate<T> => (item) => searchInFields(item, query, fields);

/**
 * Filtra y busca en una sola operación
 * 
 * @example
 * filterAndSearch(
 *   requests,
 *   'Finalizado',
 *   'plomería',
 *   'status',
 *   ['titulo', 'categoria']
 * )
 */
export const filterAndSearch = <T extends Searchable>(
  items: T[],
  filterStatus: string,
  searchQuery: string,
  statusField: keyof T,
  searchFields: (keyof T)[],
  allOption = "Todos"
): T[] => {
  const statusFilter = createStatusFilter(statusField, filterStatus, allOption);
  const searchFilter = createSearchFilter(searchFields, searchQuery);

  return filterByPredicates(items, [statusFilter, searchFilter]);
};

// ===== SORTING UTILITIES =====

/**
 * Ordena items por un campo específico
 */
export const sortBy = <T extends Searchable>(
  items: T[],
  field: keyof T,
  order: "asc" | "desc" = "asc"
): T[] => {
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
};

// ===== GROUPING UTILITIES =====

/**
 * Agrupa items por un campo
 * 
 * @example
 * groupBy(requests, 'status')
 * // { 'Activo': [...], 'Finalizado': [...] }
 */
export const groupBy = <T extends Searchable>(
  items: T[],
  field: keyof T
): Record<string, T[]> => {
  return items.reduce((acc, item) => {
    const key = String(item[field]);
    acc[key] ??= [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};

/**
 * Cuenta items por un campo
 * 
 * @example
 * countBy(requests, 'status')
 * // { 'Activo': 5, 'Finalizado': 10 }
 */
export const countBy = <T extends Searchable>(
  items: T[],
  field: keyof T
): Record<string, number> => {
  const groups = groupBy(items, field);
  return Object.entries(groups).reduce((acc, [key, items]) => {
    acc[key] = items.length;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Cuenta items que cumplen una condición
 * 
 * @example
 * countWhere(requests, r => r.status === 'Finalizado')
 * // 10
 */
export const countWhere = <T>(
  items: T[],
  predicate: FilterPredicate<T>
): number => items.filter(predicate).length;