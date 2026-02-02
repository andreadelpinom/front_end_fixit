export const API_CONFIG = {
  BASE_URL: 'http://localhost:3300',
  API_VERSION: 'v1',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
    },
    USERS: {
      CREATE: '/usuarios',
    },
    TECHNICIAN: {
      CREATE: '/technician/tecnicos',
    },
  },
  TIMEOUT: 10000,
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}${endpoint}`;
};
