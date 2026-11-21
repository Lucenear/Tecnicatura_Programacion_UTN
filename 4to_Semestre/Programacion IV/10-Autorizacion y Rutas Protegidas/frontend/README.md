# Food Store Frontend - Trabajo Practico 10

Frontend desarrollado con React, TypeScript, Vite, Tailwind CSS, TanStack Query, TanStack Form, TanStack Table y Zustand con arquitectura orientada a features.

## Estructura de features

El proyecto organiza el codigo por modulos de dominio en src/features:

- src/features/auth: gestion de sesion, login, registro, administracion de usuarios y store de autenticacion.
- src/features/categories: listado, alta, edicion y eliminacion de categorias.
- src/features/products: gestion del catalogo de productos y asociacion con categorias.
- src/features/ingredients: administracion de materias primas e ingredientes.

Cada feature mantiene sus subcarpetas especificas:
- components: componentes visuales de la feature (tablas, modales).
- hooks: custom hooks que encapsulan consultas y mutaciones de TanStack Query (useAuth, useCategories, useProducts, useIngredients).
- types: definiciones de tipos e interfaces de TypeScript de cada dominio.
- pages: vistas principales de la feature.
- index.ts: barrel export que expone la API publica de la feature para otros modulos.

Modulos transversales:
- src/shared: componentes globales (Navbar, Toast, UnauthorizedPage, LoadingState, EmptyState, ErrorState, Modal, TablePagination) y configuracion de Axios con interceptores de 401 y 403 (shared/api).
- src/store: estado de interfaz con Zustand (themeStore con persistencia para modo oscuro y notificationStore para avisos tipo Toast).
- src/routes: definicion de rutas en AppRouter y proteccion con validacion de sesion y rol mediante ProtectedRoute y Outlet.

## Requisitos

- Node.js 18 o superior
- pnpm

## Instalacion

```bash
pnpm install
```

## Ejecucion en desarrollo

```bash
pnpm dev
```

La aplicacion queda disponible en http://localhost:5173

## Credenciales de prueba

- Administrador: admin@foodstore.com / contraseña: admin1234
- Usuario estandar: user@foodstore.com / contraseña: user1234
