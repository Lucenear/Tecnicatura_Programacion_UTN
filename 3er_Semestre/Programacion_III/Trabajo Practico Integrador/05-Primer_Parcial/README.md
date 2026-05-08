# FoodStore

## ✍️ Descripción
**FoodStore** es una web moderna y profesional diseñada para una casa de comidas. El proyecto ha sido desarrollado como parte del Primer Parcial para la materia Programación III.

La aplicación permite a los usuarios navegar por un catálogo completo de productos, filtrar por categorías, buscar artículos específicos y gestionar un carrito de compras funcional con persistencia de datos.

---

## ✨ Características Principales
*   **Diseño Gastronómico**: Interfaz optimizada con una paleta de colores cálidos (Naranja y Verde con background Blanco) y tipografía de alto contraste.
*   **Layout Profesional**: 
    *   Navegación a pantalla completa.
    *   Menú lateral de categorías fijo para un acceso rápido.
    *   Banner promocional centralizado gestionado vía CSS.
*   **Funcionalidades del Carrito**:
    *   Contador de ítems en tiempo real en la barra de navegación.
    *   Gestión de cantidades con controles personalizados (+/-).
    *   Persistencia de datos utilizando `localStorage`.
    *   Feedback visual inmediato al agregar productos ("Agregado" en naranja).
*   **Arquitectura Limpia**: Separación total de responsabilidades entre HTML (estructura), CSS (diseño unificado en `style.css`) y TypeScript (lógica modular).

---

## 🚀 Instalación y Uso

Este proyecto utiliza **Vite** como herramienta de construcción y **pnpm** como gestor de paquetes.

### 1. Requisitos Previos
Asegúrate de tener instalado [Node.js](https://nodejs.org/). Se recomienda instalar `pnpm` globalmente:
```bash
npm install -g pnpm
```

### 2. Instalar Dependencias
Desde la raíz del proyecto, ejecuta:
```bash
pnpm install
```

### 3. Ejecutar en Modo Desarrollo
Para iniciar el servidor local y ver la aplicación:
```bash
pnpm dev
```
La aplicación estará disponible en `http://localhost:5173`.

---

## 📁 Estructura del Proyecto
```
/
├── src/
│   ├── assets/           # Imágenes y recursos del sistema
│   ├── data/             # Base de datos local (data.ts)
│   ├── pages/            # Módulos de página (home, cart)
│   │   ├── store/
│   │   │   ├── home/     # Catálogo principal
│   │   │   └── cart/     # Gestión del carrito
│   ├── types/            # Definiciones de TypeScript (product, categoria)
│   └── style.css         # Estilos globales unificados
├── index.html            # Punto de entrada (Redirección)
└── package.json          # Configuración de dependencias
```

---

## 🛠️ Tecnologías Utilizadas
*   **TypeScript**: Tipado estático para un código robusto.
*   **Vite**: Entorno de desarrollo rápido.
*   **Vanilla CSS**: Diseño personalizado sin frameworks externos.
*   **HTML5 Semántico**: Para una mejor accesibilidad y SEO.
