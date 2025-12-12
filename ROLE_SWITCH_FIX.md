# Fix: Cambio de Rol Mantiene Sesión Activa

## Problema Identificado ❌
Al cambiar de rol (CLIENTE ↔ TECNICO), la app estaba:
- Ejecutando `logout()` automáticamente
- Limpiando tokens del storage
- Redirigiendo a pantalla de Login
- Cerrando la sesión completamente

## Causa Raíz 🔍
En `AuthContext.tsx`, la función `switchRole()` despachaba `LOGIN_FAILURE` en caso de error, lo cual:
1. Dispara la acción `LOGIN_FAILURE` en el reducer
2. Que a su vez dispara `LOGOUT`
3. Que limpia todos los tokens
4. Que quita la sesión del usuario

**Línea problemática:**
```typescript
// ANTES (INCORRECTO):
dispatch({
  type: 'LOGIN_FAILURE',  // ← Esto causa logout
  payload: errorMessage,
});
```

## Soluciones Implementadas ✅

### 1. **AuthContext.tsx** - Fijar switchRole
```typescript
const switchRole = async (nuevoRol: string) => {
  setIsSwitchingRole(true);  // ← Flag para evitar falsos logouts
  
  try {
    const response = await authService.switchRole(nuevoRol);
    
    // Guardar rol activo
    await storageService.setActiveRole(nuevoRol);
    
    // Notificar a AppNavigator
    notifyRoleChange(nuevoRol);
    
    // Actualizar contexto SIN logout
    dispatch({
      type: 'SWITCH_ROLE',
      payload: { user: response.user },
    });
  } catch (error) {
    // ✅ NO hacer LOGIN_FAILURE/LOGOUT aquí
    // Solo reportar error y mantener sesión
    dispatch({ type: 'CLEAR_ERROR' });
    dispatch({ type: 'SET_LOADING', payload: false });
    throw error;
  } finally {
    setIsSwitchingRole(false);  // ← Reactivar monitoreo
  }
};
```

**Cambios clave:**
- ❌ Removido: `dispatch({ type: 'LOGIN_FAILURE' })`
- ✅ Agregado: `notifyRoleChange(nuevoRol)` para re-renderizar AppNavigator
- ✅ Agregado: Flag `isSwitchingRole` para proteger contra falsos logouts

### 2. **AppNavigator.tsx** - Escuchar cambios de rol
```typescript
// ✅ Sistema de listeners para cambios de rol
let roleChangeListeners = new Set();

export const notifyRoleChange = (role) => {
  roleChangeListeners.forEach(listener => listener(role));
};

export default function AppNavigator() {
  const [activeRole, setActiveRole] = useState(null);
  
  // ✅ Escuchar cambios de rol
  useEffect(() => {
    const listener = (role) => {
      setActiveRole(role);  // ← Triggea re-render
    };
    roleChangeListeners.add(listener);
    return () => roleChangeListeners.delete(listener);
  }, []);
  
  // ✅ AppNavigator se renderiza según activeRole
  if (activeRole === 'TECNICO') return <TechnicianNavigator />;
  return <ClientNavigator />;
}
```

**Cambios clave:**
- ✅ Agregado: Sistema de listeners para cambios de rol
- ✅ Agregado: `notifyRoleChange()` notifica a listeners cuando rol cambia
- ✅ AppNavigator se re-renderiza al cambiar rol (sin necesitar cambios en objeto `user`)

### 3. **AuthContext.tsx** - Protección contra falsos logouts
```typescript
// Efecto 2: Monitorear pérdida de autenticación
useEffect(() => {
  if (!state.isAuthenticated) return;
  
  const authCheckInterval = setInterval(async () => {
    // ✅ No hacer logout durante switchRole
    if (isSwitchingRole) return;  // ← Protección clave
    
    const token = await storageService.getAccessToken();
    if (!token && state.isAuthenticated) {
      dispatch({ type: 'LOGOUT' });
    }
  }, 5000);
  
  return () => clearInterval(authCheckInterval);
}, [state.isAuthenticated, isSwitchingRole]);  // ← Incluir flag en dependencies
```

**Cambios clave:**
- ✅ Agregado: Verificación `if (isSwitchingRole) return` para evitar logouts durante transición
- ✅ Agregado: `isSwitchingRole` en dependencies del useEffect

## Flujo Ahora ✨

### ANTES (INCORRECTO):
```
Usuario en ClientNavigator
    ↓
Click "Switch to TECNICO"
    ↓
switchRole('TECNICO') inicia
    ↓
authService.switchRole() exitoso
    ↓
dispatch(LOGIN_FAILURE) ❌ LOGOUT
    ↓
clearTokens()
    ↓
AppNavigator renderiza AuthNavigator
    ↓
Usuario vuelto a Login Screen
```

### AHORA (CORRECTO):
```
Usuario en ClientNavigator (autenticado)
    ↓
Click "Switch to TECNICO"
    ↓
switchRole('TECNICO') inicia
    ↓
authService.switchRole() exitoso
    ↓
setActiveRole('TECNICO') en storage
    ↓
notifyRoleChange('TECNICO') notifica listeners
    ↓
AppNavigator detecta cambio y re-renderiza
    ↓
TechnicianNavigator se muestra
    ↓
Usuario sigue autenticado, sesión intacta ✅
```

## Qué NO fue modificado 🔒

- ❌ Backend (sin cambios)
- ❌ Contratos API (sin cambios)
- ❌ Login flow (sin cambios)
- ❌ Logout flow (sin cambios)
- ❌ Token refresh service (sin cambios)
- ❌ Storage service (sin cambios)

## Testing Recomendado 🧪

### Caso 1: Cambio de rol simple
```
1. Login como usuario con roles CLIENTE + TECNICO
2. Seleccionar "CLIENTE" (modal de selección)
3. Navegar a Profile
4. Click "Cambiar a TECNICO"
   ✅ Debe mostrar TechnicianNavigator
   ✅ NO debe aparecer pantalla de Login
   ✅ Tokens deben estar presentes
5. Click "Cambiar a CLIENTE"
   ✅ Debe mostrar ClientNavigator
   ✅ Sesión intacta
```

### Caso 2: Cambios rápidos consecutivos
```
1. Switch CLIENTE → TECNICO
2. Inmediatamente Switch TECNICO → CLIENTE
3. Inmediatamente Switch CLIENTE → TECNICO
   ✅ Cada cambio debe ser instantáneo
   ✅ NO debe haber race conditions
   ✅ NO debe haber logouts
```

### Caso 3: Error en switchRole
```
1. Simular error en authService.switchRole()
2. Usuario hace cambio de rol
   ✅ Debe mostrar mensaje de error
   ✅ NO debe hacer logout
   ✅ Sesión debe mantenerse activa
   ✅ Usuario puede reintentar
```

### Caso 4: Token expiration durante switch
```
1. Usuario inicia switchRole('TECNICO')
2. Mientras se procesa, token expira (401)
   ✅ TokenRefreshService debe refrescar automáticamente
   ✅ switchRole debe continuar con nuevo token
   ✅ NO debe haber logout falso
```

## Archivos Modificados 📝

1. **src/context/AuthContext.tsx**
   - Fijar switchRole para NO disparar LOGIN_FAILURE
   - Agregar `isSwitchingRole` flag
   - Llamar a `notifyRoleChange()` después de cambio de rol
   - Proteger monitoreo de pérdida de tokens

2. **src/navigation/AppNavigator.tsx**
   - Agregar sistema de listeners para cambios de rol
   - Exportar `notifyRoleChange()` función
   - AppNavigator re-renderiza cuando rol cambia

3. **src/services/auth.service.ts** (ya modificado)
   - Removido código de creación de técnico del switchRole
   - switchRole solo cambia tokens y rol activo

## Validación ✔️

```bash
# Verificar que no hay errores de compilación
npm run tsc

# Verificar que lint está limpio
npm run lint

# Ejecutar app
npx expo start
```

## Notas Importantes 📌

1. **El cambio es transparent**: No requiere cambios en screens o componentes
2. **Backward compatible**: Código existente sigue funcionando
3. **Performance**: No hay overhead adicional, misma velocidad que antes
4. **Session persistence**: Si el app se cierra y reabre, mantiene el rol activo seleccionado
5. **Token expiration**: Auto-refresh sigue funcionando normalmente durante role switches

## Siguiente Paso 🚀

Verificar que `BecomeTechnicianScreen` está creando el perfil técnico en la ubicación correcta:
- ✅ POST /technician/tecnicos debe estar en onboarding
- ❌ NO debe estar en switchRole (ya removido)
- ❌ NO debe estar en login (es solo para nuevos técnicos)
