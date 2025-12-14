export const API_CONFIG = {
  BASE_URL: 'http://localhost:3300',
  API_VERSION: 'v1',
  BASE_PATH: '/api/v1',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      SWITCH_ROLE: '/auth/switch-role',
    },
    USERS: {
      CREATE: '/usuarios',
      UPDATE: '/usuarios',
    },
    TECHNICIAN: {
      CREATE: '/technician/tecnicos',
      UPDATE: '/technician/tecnicos',
    },
  },
  TIMEOUT: 10000,
} as const;

const ensureLeadingSlash = (path: string): string => {
  if (path.startsWith('/')) {
    return path;
  }
  return `/${path}`;
};

export const getApiUrl = (endpoint: string): string => {
  const normalizedEndpoint = ensureLeadingSlash(endpoint);
  return `${API_CONFIG.BASE_URL}${API_CONFIG.BASE_PATH}${normalizedEndpoint}`;
};
