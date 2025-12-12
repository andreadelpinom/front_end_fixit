import { authService } from './auth.service';
import { storageService } from './storage.service';

/**
 * Servicio para refrescar el token JWT automáticamente
 * Evita que expire mientras el usuario está usando la app
 */
class TokenRefreshService {
  private TAG = '[TokenRefreshService]';
  private refreshInterval: NodeJS.Timeout | null = null;

  /**
   * Inicia el mecanismo de refresh automático de tokens
   * Se ejecuta una vez al login
   */
  startAutoRefresh(): void {
    // Detener cualquier refresh anterior
    this.stopAutoRefresh();

    console.log(`${this.TAG} Iniciando auto-refresh de tokens...`);

    // Refrescar cada 5 minutos (el token expira cada 15 minutos)
    // Esto asegura que siempre haya un token válido
    this.refreshInterval = setInterval(async () => {
      await this.attemptTokenRefresh();
    }, 5 * 60 * 1000); // 5 minutos
  }

  /**
   * Detiene el mecanismo de refresh automático
   */
  stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log(`${this.TAG} Auto-refresh detenido`);
    }
  }

  /**
   * Intenta refrescar el token
   * Maneja errores sin hacer noise si el refresh falla
   */
  private async attemptTokenRefresh(): Promise<void> {
    try {
      const refreshToken = await storageService.getRefreshToken();

      if (!refreshToken) {
        console.warn(`${this.TAG} No hay refresh token disponible`);
        return;
      }

      console.log(`${this.TAG} Refrescando token...`);
      await authService.refreshToken();
      console.log(`${this.TAG} Token refrescado exitosamente`);
    } catch (error) {
      // Si el refresh falla, es probablemente porque la sesión terminó
      // El logout será manejado por el interceptor de 401 en AuthContext
      console.warn(`${this.TAG} Token refresh falló, la sesión podría haber expirado`);
    }
  }

  /**
   * Refrescar token manualmente (útil para situaciones críticas)
   */
  async forceRefresh(): Promise<void> {
    try {
      console.log(`${this.TAG} Forzando refresh de token...`);
      await authService.refreshToken();
      console.log(`${this.TAG} Token forzado refrescado exitosamente`);
    } catch (error) {
      console.error(`${this.TAG} Force refresh falló:`, error);
      throw error;
    }
  }
}

export const tokenRefreshService = new TokenRefreshService();
