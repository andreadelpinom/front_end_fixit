export const API_CONFIG = {
  BASE_URL: 'http://192.168.2.19:3300',
  API_VERSION: 'v1',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      SWITCH_ROLE: '/auth/switch-role',
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
