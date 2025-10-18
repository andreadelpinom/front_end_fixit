# 📊 Diagrama Visual de Navegación - FixIt App

## 🏗️ Arquitectura Completa

```
┌─────────────────────────────────────────────────────┐
│           📱 RootNavigator (Principal)              │
│                                                     │
│  ┌─────────────────────────────────────────┐      │
│  │     🔐 ¿Usuario Autenticado?            │      │
│  └──────────────┬──────────────────────────┘      │
│                 │                                  │
│        ┌────────┴────────┐                        │
│        │                 │                        │
│    NO  │                 │  SÍ                    │
│        ▼                 ▼                        │
│  ┌──────────┐     ┌─────────────┐               │
│  │ AuthStack│     │ Role Router │               │
│  │          │     │             │               │
│  │ • Login  │     │ ┌─────────┐ │               │
│  │ • Register│    │ │cliente? │ │               │
│  └──────────┘     │ └────┬────┘ │               │
│                   │      │      │               │
│                   │  ┌───┴───┐  │               │
│                   │  │       │  │               │
│                   │  ▼       ▼  │               │
│            ┌──────────┐  ┌──────────┐          │
│            │🔵 CLIENT │  │🟠 TECNICO│          │
│            └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
```

---

## 🔵 CLIENTES - Navegación Detallada

```
┌──────────────────────────────────────────────────────┐
│       ClientNavigator (Stack Container)              │
│  ┌────────────────────────────────────────────────┐ │
│  │      ClientTabs (Bottom Tab Navigator)         │ │
│  │                                                 │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │ │
│  │  │   🏠     │  │   🛠️     │  │   👤     │    │ │
│  │  │  Inicio  │  │Servicios │  │  Perfil  │    │ │
│  │  │          │  │          │  │          │    │ │
│  │  │  Home    │  │ Services │  │ Profile  │    │ │
│  │  └──────────┘  └──────────┘  └──────────┘    │ │
│  │                                                 │ │
│  │  Color Activo: #3B82F6 (Azul) ████            │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │     Pantallas Apiladas (Sin pestañas)          │ │
│  │                                                 │ │
│  │  • RequestDetail                               │ │
│  │    └─ Se abre al tocar una solicitud           │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘

Flujo de Navegación:
─────────────────────
Home → (tocar solicitud) → RequestDetail
                          ↓
                     (volver) 
                          ↓
                       Home

Pestañas Disponibles:
───────────────────
[ Inicio ] [ Servicios ] [ Perfil ]
   ↑          ↑             ↑
   Puedes cambiar entre estas en cualquier momento
```

---

## 🟠 TÉCNICOS - Navegación Detallada

```
┌──────────────────────────────────────────────────────┐
│      TecnicoNavigator (Stack Container)              │
│  ┌────────────────────────────────────────────────┐ │
│  │      TecnicoTabs (Bottom Tab Navigator)        │ │
│  │                                                 │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │ │
│  │  │   📋     │  │   🛠️     │  │   👤     │    │ │
│  │  │Solicitud │  │   Mis    │  │  Perfil  │    │ │
│  │  │   es     │  │Servicios │  │          │    │ │
│  │  │ Requests │  │MyServices│  │ Profile  │    │ │
│  │  └──────────┘  └──────────┘  └──────────┘    │ │
│  │                                                 │ │
│  │  Color Activo: #EA8B49 (Naranja) ████         │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │     Pantallas Apiladas (Sin pestañas)          │ │
│  │                                                 │ │
│  │  • TechnicianPerformance                       │ │
│  │    └─ Estadísticas y métricas                  │ │
│  │                                                 │ │
│  │  • TechnicianRequests                          │ │
│  │    └─ Lista detallada de solicitudes           │ │
│  │                                                 │ │
│  │  • Certifications                              │ │
│  │    └─ Agregar/ver certificaciones              │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘

Flujo de Navegación:
─────────────────────
Profile → (ver rendimiento) → TechnicianPerformance
                               ↓
                          (volver)
                               ↓
                           Profile

Profile → (agregar cert) → Certifications
                            ↓
                       (volver)
                            ↓
                        Profile

Pestañas Disponibles:
───────────────────
[ Solicitudes ] [ Mis Servicios ] [ Perfil ]
      ↑                ↑               ↑
      Puedes cambiar entre estas en cualquier momento
```

---

## 🎨 Sistema de Colores Comparativo

```
┌────────────────────────────────────────────────┐
│            🔵 CLIENTES (Azul)                  │
├────────────────────────────────────────────────┤
│                                                │
│  Primary:    ████ #3B82F6  (Azul brillante)   │
│  Secondary:  ████ #2563EB  (Azul más oscuro)  │
│  Light:      ████ #DBEAFE  (Azul claro)       │
│  Dark:       ████ #1E40AF  (Azul oscuro)      │
│  Accent:     ████ #60A5FA  (Azul acento)      │
│                                                │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│           🟠 TÉCNICOS (Naranja)                │
├────────────────────────────────────────────────┤
│                                                │
│  Primary:    ████ #EA8B49  (Naranja cálido)   │
│  Secondary:  ████ #F97316  (Naranja brillante)│
│  Light:      ████ #FED7AA  (Naranja claro)    │
│  Dark:       ████ #B45309  (Naranja oscuro)   │
│  Accent:     ████ #FB923C  (Naranja acento)   │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 📂 Estructura de Carpetas Actualizada

```
src/
├── navigation/
│   ├── RootNavigator.tsx         ← Router principal
│   ├── AuthNavigator.tsx          (Si existe)
│   ├── ClientNavigator.tsx        ✅ Actualizado (Tabs + Stack)
│   └── TecnicoNavigation.tsx      ✅ Actualizado (Tabs + Stack)
│
├── screens/
│   ├── clients/                   🔵 Pantallas de Clientes
│   │   ├── Home.tsx               (Tab 1)
│   │   ├── ServicesScreen.tsx     (Tab 2)
│   │   ├── Profile.tsx            (Tab 3)
│   │   └── RequestDetail.tsx      (Stack - sin tab)
│   │
│   └── tecnicos/                  🟠 Pantallas de Técnicos
│       ├── Requests.tsx           (Tab 1) ✅
│       ├── MyServicesScreen.tsx   (Tab 2) ✅
│       ├── TechnicianProfileScreen.tsx (Tab 3) ✅
│       ├── TechnicianPerformanceScreen.tsx (Stack)
│       ├── TechnicianRequestsScreen.tsx (Stack)
│       └── CertificationsScreens.tsx (Stack)
│
├── theme/
│   └── colors.ts                  ✅ Actualizado (client + technician)
│
└── components/
    ├── HomeTabIcon.tsx
    ├── ServicesTabIcon.tsx
    └── ProfileTabIcon.tsx
```

---

## 🔄 Comparación ANTES vs DESPUÉS

### ❌ ANTES (Técnicos)
```
Stack Navigator solamente
├── TechnicianProfile
├── MyServices
├── Requests
├── TechnicianPerformance
├── TechnicianRequests
└── Certifications

Problema: No hay pestañas, todo apilado
```

### ✅ DESPUÉS (Técnicos)
```
Stack Navigator (Contenedor)
├── TecnicoTabs (Bottom Tabs) ← NUEVO
│   ├── Requests
│   ├── MyServices
│   └── TechnicianProfile
├── TechnicianPerformance
├── TechnicianRequests
└── Certifications

Solución: Pestañas visibles, navegación clara
```

---

## 🎯 Mapa de Navegación Interactivo

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃              📱 FIXIT APP                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
   ┌─────────┐           ┌─────────┐
   │  Login  │           │Register │
   └────┬────┘           └────┬────┘
        │                     │
        └──────────┬──────────┘
                   ▼
         ┌──────────────────┐
         │  Rol verificado  │
         └─────────┬────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
    ┌────────┐          ┌────────┐
    │CLIENTE │          │TÉCNICO │
    │  🔵   │          │  🟠   │
    └────┬───┘          └───┬────┘
         │                  │
    ┌────┴────┐        ┌────┴────┐
    │  TABS   │        │  TABS   │
    │ Inicio  │        │Solicitud│
    │Servicios│        │   Mis   │
    │ Perfil  │        │Servicios│
    └─────────┘        │ Perfil  │
                       └─────────┘
```

---

## 🧭 Guía Rápida de Navegación

### Para Desarrolladores:

#### Navegar entre pestañas:
```typescript
// Automático - el usuario solo toca la pestaña
```

#### Navegar a pantalla apilada:
```typescript
navigation.navigate('RequestDetail', { id: '123' });
navigation.navigate('TechnicianPerformance');
navigation.navigate('Certifications');
```

#### Volver atrás:
```typescript
navigation.goBack();
```

#### Verificar pestaña actual:
```typescript
const route = useRoute();
console.log(route.name); // "Home", "Requests", etc.
```

---

## ✅ Checklist de Testing

```
CLIENTES:
[ ] Login como cliente
[ ] Verificar pestañas azules
[ ] Tab 1: Inicio - ver cursos
[ ] Tab 2: Servicios - ver lista
[ ] Tab 3: Perfil - ver datos
[ ] Tocar una solicitud → RequestDetail
[ ] Volver atrás desde RequestDetail
[ ] Las pestañas siguen visibles

TÉCNICOS:
[ ] Login como técnico
[ ] Verificar pestañas naranjas
[ ] Tab 1: Solicitudes - ver requests
[ ] Tab 2: Mis Servicios - ver lista
[ ] Tab 3: Perfil - ver datos
[ ] Navegar a Performance
[ ] Navegar a Certifications
[ ] Volver atrás mantiene pestañas
```

---

**Última actualización:** Octubre 18, 2025  
**Estado:** ✅ Implementado - Listo para testing
