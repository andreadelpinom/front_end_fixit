# 🚀 Guía de Inicio Rápido - FixIt App

## ⚠️ Solucionar Error de TypeScript

### Error Actual:
```
File 'expo/tsconfig.base' not found.
```

### ✅ Solución:

```bash
# 1. Asegurarse de estar en la carpeta del proyecto
cd /Users/danielamora/Documents/front_end_fixit-1

# 2. Instalar todas las dependencias (incluyendo Expo)
npm install

# 3. Si el error persiste, instalar Expo específicamente
npm install expo --save-dev

# 4. Limpiar caché (opcional pero recomendado)
npm cache clean --force
rm -rf node_modules
npm install
```

---

## 🎯 Iniciar el Proyecto

### Opción 1: Usando Expo (Recomendado)
```bash
# Iniciar el servidor de desarrollo
npx expo start

# O si tienes expo instalado globalmente:
expo start
```

### Opción 2: Usando npm
```bash
npm start
```

### Opción 3: Para plataforma específica
```bash
# iOS (requiere Mac y Xcode)
npx expo start --ios

# Android (requiere Android Studio)
npx expo start --android

# Web
npx expo start --web
```

---

## 📱 Probar en Dispositivo

### Con Expo Go (Más Fácil):

1. **Instalar Expo Go en tu teléfono:**
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Escanear el QR:**
   - Ejecuta `npx expo start`
   - Escanea el QR que aparece en la terminal
   - iOS: usa la cámara nativa
   - Android: usa la app Expo Go

### Con Emulador:

#### iOS Simulator (Solo Mac):
```bash
# Asegurarse de tener Xcode instalado
# Luego:
npx expo start --ios
```

#### Android Emulator:
```bash
# Asegurarse de tener Android Studio instalado
# Y un emulador configurado
npx expo start --android
```

---

## 🧪 Probar las Nuevas Funcionalidades

### Paso 1: Verificar Instalación
```bash
# Ver que no haya errores
npm install
npm start
```

### Paso 2: Probar como Cliente
1. Abrir la app
2. Login con rol "cliente"
3. **Verificar:**
   - ✅ Pestañas azules (#3B82F6) en la parte inferior
   - ✅ 3 pestañas: Inicio, Servicios, Perfil
   - ✅ Puede cambiar entre pestañas
   - ✅ Tocar una solicitud abre RequestDetail
   - ✅ Botón "Atrás" funciona

### Paso 3: Probar como Técnico
1. Logout o usar otra cuenta
2. Login con rol "tecnico"
3. **Verificar:**
   - ✅ Pestañas naranjas (#EA8B49) en la parte inferior
   - ✅ 3 pestañas: Solicitudes, Mis Servicios, Perfil
   - ✅ Puede cambiar entre pestañas
   - ✅ Botones de navegación funcionan (Performance, Certificaciones)
   - ✅ Botón "Atrás" funciona

---

## 🐛 Solución de Problemas Comunes

### 1. "Metro Bundler no inicia"
```bash
# Limpiar caché de Metro
npx expo start --clear

# O limpiar todo
rm -rf node_modules
npm cache clean --force
npm install
```

### 2. "No se ven las pestañas"
```bash
# Verificar que está instalado:
npm list @react-navigation/bottom-tabs

# Si no está, instalar:
npm install @react-navigation/bottom-tabs
```

### 3. "Error de TypeScript"
```bash
# Reiniciar el servidor de TypeScript en VS Code:
# Cmd + Shift + P → "TypeScript: Restart TS Server"

# O cerrar y abrir VS Code
```

### 4. "Los colores no cambian"
```bash
# Asegurarse de guardar todos los archivos
# Luego recargar la app:
# En Expo Go: sacudir el teléfono → "Reload"
```

### 5. "Navigation error"
```bash
# Verificar que todas las dependencias están instaladas:
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npm install react-native-screens
npm install react-native-safe-area-context
```

---

## 📦 Dependencias Requeridas

### Navegación:
```json
{
  "@react-navigation/native": "^6.x.x",
  "@react-navigation/native-stack": "^6.x.x",
  "@react-navigation/bottom-tabs": "^6.x.x",
  "react-native-screens": "^3.x.x",
  "react-native-safe-area-context": "^4.x.x"
}
```

### Expo:
```json
{
  "expo": "~50.x.x",
  "expo-status-bar": "~1.x.x",
  "react": "18.x.x",
  "react-native": "0.73.x"
}
```

### Instalar todo de una vez:
```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context expo
```

---

## 🔍 Verificar Configuración

### Ver dependencias instaladas:
```bash
npm list --depth=0
```

### Ver versión de Node:
```bash
node --version
# Recomendado: v18.x o superior
```

### Ver versión de npm:
```bash
npm --version
# Recomendado: v9.x o superior
```

---

## 🎨 Cambios Realizados (Resumen)

### Archivos Modificados:
1. ✅ `/src/navigation/TecnicoNavigation.tsx` - Agregado Tab Navigator
2. ✅ `/src/navigation/ClientNavigator.tsx` - Actualizado colores azules
3. ✅ `/src/theme/colors.ts` - Agregado paletas client y technician

### Archivos Creados:
1. 📄 `NAVEGACION-RESUMEN.md` - Documentación completa
2. 📄 `DIAGRAMA-NAVEGACION.md` - Diagramas visuales
3. 📄 `INICIO-RAPIDO.md` - Este archivo

---

## 📞 Comandos Útiles

```bash
# Iniciar desarrollo
npm start

# Limpiar caché
npx expo start --clear

# Ver logs detallados
npx expo start --verbose

# Instalar dependencia
npm install nombre-paquete

# Actualizar todas las dependencias
npm update

# Ver estructura del proyecto
tree -L 3 -I 'node_modules'

# Ver diferencias en git
git status
git diff
```

---

## ✅ Checklist Pre-Testing

```
Antes de probar:
[ ] npm install completado sin errores
[ ] No hay errores en la terminal
[ ] VS Code no muestra errores rojos
[ ] Servidor de Expo iniciado
[ ] QR code visible / emulador abierto

Durante testing:
[ ] App carga sin crashes
[ ] Login funciona
[ ] Navegación responde
[ ] Colores correctos
[ ] Pestañas visibles
[ ] Botones funcionan

Después de testing:
[ ] Probar ambos roles (cliente y técnico)
[ ] Verificar todas las pantallas
[ ] Probar navegación de ida y vuelta
[ ] Verificar que no hay memory leaks
```

---

## 🆘 Si Nada Funciona...

### Último Recurso:
```bash
# 1. Borrar todo
rm -rf node_modules
rm package-lock.json

# 2. Reinstalar desde cero
npm install

# 3. Limpiar cachés
npx expo start --clear

# 4. Si aún falla, reiniciar computadora
# 5. Verificar que Node.js está actualizado
node --version
```

### Verificar Logs:
```bash
# Ver errores detallados en la terminal
# Buscar líneas que digan "ERROR" o "WARN"
# Copiar el error y buscar en Google
```

---

## 🎓 Aprender Más

### React Navigation:
- [Documentación Oficial](https://reactnavigation.org/)
- [Tab Navigator Guide](https://reactnavigation.org/docs/tab-based-navigation/)
- [Stack Navigator Guide](https://reactnavigation.org/docs/stack-navigator/)

### Expo:
- [Documentación Expo](https://docs.expo.dev/)
- [Expo Go App](https://expo.dev/client)
- [Guía de Desarrollo](https://docs.expo.dev/get-started/create-a-new-app/)

### React Native:
- [Documentación React Native](https://reactnative.dev/)
- [Core Components](https://reactnative.dev/docs/components-and-apis)

---

## 💡 Tips para Andrea

1. **Siempre guardar antes de probar** (Cmd+S en Mac)
2. **Reiniciar app después de cambios grandes** (sacudir teléfono → Reload)
3. **Ver la consola** siempre que algo no funcione
4. **Probar en iOS y Android** pueden verse diferente
5. **Usar Git** para guardar cambios importantes

---

**¡Buena suerte! 🚀**

Si algo no funciona, revisa los logs y los documentos de ayuda.
