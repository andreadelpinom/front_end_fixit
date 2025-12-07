# 🏗️ HOME SCREEN - ARQUITECTURA ESCALABLE

## ✅ ESTADO ACTUAL - MVP v1

### Componentes Implementados

```
src/components/home/
├── SectionTitle.tsx        (Reutilizable)
├── HomeHeader.tsx          (Greeting + contexto)
├── HomeSearch.tsx          (Búsqueda de servicios)
├── PopularServices.tsx     (Grid 2 cols, 6 servicios)
├── TopTechnicians.tsx      (Grid 3 cols, top-rated con ratings)
├── UrgentBanner.tsx        (CTA para emergencias)
└── RecentActivity.tsx      (Lista de solicitudes recientes)
```

### HomeScreen.tsx - Estructura

```tsx
SafeAreaView (bg: background)
  └── ScrollView (padding: 16)
      ├── HomeHeader              (Greeting)
      ├── HomeSearch              (TextInput)
      ├── PopularServices         (Grid 2x6)
      ├── TopTechnicians          (Grid 3x, paginated)
      ├── UrgentBanner            (CTA)
      └── RecentActivity          (List)
```

---

## 🎨 DESIGN SYSTEM (WIZARD_COLORS)

Todos los componentes usan colores de `WizardShared.tsx`:

| Token | Color | Uso |
|-------|-------|-----|
| `primary` | `#2196F3` | Botones, acciones principales |
| `background` | `#F5F5F5` | Fondo de pantalla |
| `white` | `#FFFFFF` | Cards |
| `text` | `#212121` | Texto primario |
| `textSecondary` | `#757575` | Subtítulos, metadata |
| `textLight` | `#BDBDBD` | Placeholders, disabled |
| `border` | `#E0E0E0` | Bordes de cards |

---

## 📱 RESPONSIVIDAD

- **Padding:** 16px (horizontal)
- **Grid PopularServices:** 2 columnas, gap 12px
- **Grid TopTechnicians:** 3 columnas, gap 12px
- **Card Heights:** Mínimos definidos para consistencia
- **Typography:** Escalable según dispositivo

---

## 🔄 DATA FLOW

```
HomeScreen
  ├── TopTechnicians
  │   ├── Load: homeService.getTopRatedTechs(6)
  │   ├── State: loading, techs[], error
  │   └── Render: TechCard[] or loading/error state
  │
  └── RecentActivity
      ├── Load: homeService.getRecentRequests()
      ├── State: loading, requests[], error
      └── Render: RequestCard[] or loading/error state
```

### Estados Manejados

- ✅ Loading (ActivityIndicator)
- ✅ Error (texto amigable)
- ✅ Empty (mensaje contextual)
- ✅ Success (datos renderizados)

---

## 📐 SPACING & LAYOUT

```
HomeHeader
  marginBottom: 20

HomeSearch
  marginBottom: 20

PopularServices
  marginBottom: 24

TopTechnicians
  marginBottom: 24

UrgentBanner
  marginBottom: 24

RecentActivity
  marginBottom: 24

scrollContent paddingBottom: 100 (safeArea)
```

---

## 🎯 ACCESIBILIDAD

- ✅ Fuentes legibles (min 11px)
- ✅ Contraste suficiente (WCAG AA)
- ✅ TouchableOpacity con activeOpacity
- ✅ TextInput con placeholder visible
- ✅ StatusBadges con colores + iconos
- ✅ FlatList con keyExtractor

---

## 🚀 PRÓXIMAS FASES

### Fase 2: Diseño Visual Completo (Figma)
- [ ] Colores gradientes
- [ ] Iconos (Feather, Ionicons)
- [ ] Avatares con imágenes reales
- [ ] Cards con shadow/elevation

### Fase 3: Animaciones
- [ ] Fade-in al cargar sections
- [ ] Slide de RecentActivity
- [ ] Ripple effect en touches
- [ ] Skeleton loading

### Fase 4: Interactividad
- [ ] Navigate a service detail
- [ ] Navigate a technician profile
- [ ] Search bar con filtrado
- [ ] Refresh with useFocusEffect

### Fase 5: Performance
- [ ] Memoization (React.memo)
- [ ] useCallback para handlers
- [ ] Image optimization
- [ ] Virtualization si lista crece

---

## 📝 NOTAS TÉCNICAS

### Por qué StyleSheet?
- ✅ Performance (estilos compilados)
- ✅ Lectura limpia
- ✅ Debugging facilitado
- ✅ Consistencia visual

### Componentes sin Estado (Stateless)
- HomeHeader
- HomeSearch
- PopularServices (lista estática)
- UrgentBanner
- SectionTitle

### Componentes con Estado (Stateful)
- TopTechnicians (API call)
- RecentActivity (API call)

### Error Handling
```tsx
if (loading) return <Loader />
if (error) return <ErrorMessage />
if (data.length === 0) return <EmptyState />
return <SuccessRender />
```

---

## 🔍 PRÓXIMAS MEJORAS

1. **Pull to Refresh** en HomeScreen
2. **Pagination** en RecentActivity
3. **Categories** section (grid)
4. **Banners** rotativo (carousel)
5. **Promotions** section
6. **Customer Stories** section
7. **FAQ** section

---

## ✨ COMMIT LOG

```
e6795d465d2d815d889a399f19aa12f4fe3d0c3c
Author: Daniel Amora
Date:   Dec 7, 2025

    refactor: HomeScreen architecture con componentes escalables

    - 8 nuevos componentes con StyleSheet
    - Layout limpio con SafeAreaView
    - Datos reales desde API
    - Loading + Error states
    - 0 TypeScript errors
```

