# Frontend - Gestor de Productos (Food Store)

Este proyecto corresponde a la interfaz de usuario para el catalogo de Food Store, desarrollada con React, TypeScript y Tailwind CSS sobre Vite.

## Estructura del Proyecto

La organizacion de archivos sigue una separacion clara basada en componentes puros y tipado estatico:

```text
tp-productos/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── README.md
└── src/
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── types/
    │   └── producto.ts
    └── components/
        ├── Navbar.tsx
        ├── ProductoCard.tsx
        ├── ProductoList.tsx
        ├── ProductoForm.tsx
        └── Footer.tsx
```

## Componentes y Tipado

- `src/types/producto.ts`: Define la interface `Producto` con los campos `id`, `nombre`, `descripcion` y `precio`.
- `Navbar.tsx`: Barra de navegacion superior con titulo de la aplicacion y accesos directos.
- `ProductoCard.tsx`: Tarjeta individual para mostrar el detalle de cada producto y su precio.
- `ProductoList.tsx`: Componente contenedor que recibe un arreglo de productos por props y renderiza la cuadricula de tarjetas.
- `ProductoForm.tsx`: Formulario de alta de productos con inputs estilizados para maquetado sin funcionalidad ni estado.
- `Footer.tsx`: Pie de pagina con derechos reservados y enlaces institucionales.
- `App.tsx`: Componente principal que almacena el listado inicial de productos hardcodeados y los distribuye mediante props tipados.

Todos los componentes son funciones puras sin hooks (`useState` ni `useEffect`).

## Instalacion y Ejecucion

Para instalar las dependencias:

```bash
pnpm install
```

Para iniciar el servidor de desarrollo:

```bash
pnpm dev
```

Para compilar el proyecto y verificar tipos TypeScript:

```bash
pnpm build
```
