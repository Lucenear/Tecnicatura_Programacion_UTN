# Food Store - Frontend (Vite + TypeScript)

Este proyecto contiene el frontend del sistema Food Store. Está construido como una SPA utilizando Vite y TypeScript, con estilos en Vanilla CSS diseñados para ofrecer una experiencia visual rica, moderna y limpia.

## Requisitos Previos

- Node.js (versión 16+ recomendada).
- npm (se instalará por defecto con Node.js).

## Instrucciones de Ejecución

1. **Instalar Dependencias**:
   Desde la raíz del directorio `frontend/`, ejecuta en tu terminal:
   ```bash
   npm install
   ```

2. **Ejecutar la Aplicación**:
   Para iniciar el servidor de desarrollo, ejecuta:
   ```bash
   npm run dev
   ```
   *La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique Vite).*

## Detalles del Desarrollo

- **Almacenamiento y Simulación de Base de Datos**: La aplicación inicia cargando los datos iniciales (mock de categorías, productos, pedidos, y usuarios) desde los archivos estáticos en `public/data/*.json`. Estos datos se sincronizan con `localStorage` permitiendo realizar un CRUD completo en memoria de manera persistente en el navegador.
- **Rutas y Autenticación**:
  - `authGuard`: Valida en cada vista si el usuario está autenticado y si tiene permisos para acceder (Administrador o Cliente).
  - **Usuarios de Prueba Iniciales**:
    - *Admin*: `admin@admin.com` | Password: `123456`
    - *Cliente*: `cliente@food.com` | Password: `cliente123`
- **Costos de Envío**: Para esta iteración del frontend, el costo de envío está definido como una constante **Gratis** ($0) en la vista del carrito, sumándose al total sin alterar el subtotal de productos.
- **Diseño (Estilos)**: Todo el sistema se basa en un diseño "Glassmorphism" con colores vibrantes, sombras suaves y micro-animaciones en interacciones (botones, tarjetas de productos, transiciones de menús) desarrollados 100% en CSS puro.
