# 🎓 Tecnicatura Universitaria en Programación  
**📍 Universidad Tecnológica Nacional (UTN)**  

## 🚀 Trabajo Integrador Final (TIF): FixYa

---

## 👨‍💻 Equipo de Desarrollo  
- **Ducoli, Maximiliano**
- **Elizondo, Iñaki**
- **Farias, Gustavo**

Comisión: M2025-13
Grupo: 132

---

## 📖 Descripción del Proyecto  
**FixYa** es una plataforma web responsive diseñada para cerrar la brecha entre el conocimiento técnico especializado y el usuario común. Ante un problema cotidiano (hogar, oficios, tecnología o educación), la aplicación ofrece una solución escalonada:

1. **Diagnóstico y Autogestión:** Muestra guías paso a paso y los 3 mejores videos tutoriales de Youtube según la consulta.
2. **Conexión con Expertos:** Si el usuario no puede resolverlo, le presenta un directorio de especialistas verificados manualmente, ordenados por reputación, para contactarlos directamente.

> 💡 **Objetivo Académico:** Demostrar competencias profesionales en análisis, diseño, arquitectura de software, bases de datos y despliegue en la nube, aplicando una metodología ágil (Scrum).

---

## ✨ Funcionalidades Principales (MVP)  
- 🔐 **Autenticación:** Login seguro y sin fricción con Google (OAuth).  
- 🔍 **Buscador de Soluciones:** Integración con la API de Youtube Data para curar contenido relevante.  
- 🛠️ **Directorio de Especialistas:** Listado filtrable por categoría y zona, con perfiles detallados y botón de contacto directo (WhatsApp).  
- 🛡️ **Panel de Administración:** Flujo de validación manual de perfiles (revisión de DNI y certificados) para garantizar la seguridad de la plataforma.  
- ⭐ **Sistema de Reputación:** Calificaciones y reseñas de usuarios reales para ordenar la calidad de los especialistas.  
- 🤖 **Asistente IA (Stretch Goal):** Diagnóstico estructurado y clasificación automática mediante un modelo local (Ollama) alojado en el servidor.

---

## 🛠️ Stack Tecnológico  
La elección del stack prioriza la coherencia, el conocimiento del equipo y la viabilidad operativa, cumpliendo con el requisito de componentes en la nube:

| Capa | Tecnología | Justificación |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16, React, TypeScript, Tailwind CSS | Tipado estático y diseño responsive rápido. |
| **Backend (BFF)** | Node.js, Express, TypeScript | Lógica de negocio unificada, ideal para I/O intensivo y orquestación de APIs. |
| **Base de Datos** | PostgreSQL (vía **Supabase**) | Estructura relacional fuerte (SQL) con las ventajas de un DBaaS 100% en la nube. |
| **IA / Externos** | Ollama (Modelo local en VPS), YouTube Data API | IA de código abierto sin costos de API + curación de videos confiable. |
| **Infraestructura** | VPS con Docker, Vercel, Cloudflare | Despliegue contenerizado, SSL automático y protección DDoS. |

---

## 📚 Documentación de Entrega
A continuación se listan los documentos solicitados para la revisión del proyecto:

* 🏗️ **[Arquitectura del Proyecto](./docs/Arquitectura.md):** Arquitectura en capas, diagrama de secuencia, casos de uso e infraestructura.
* 🗄️ **[Diseño de Base de Datos](./docs/BaseDeDatos.md):** Diagrama Entidad-Relación (DER) y Reglas de Negocio (RLS).
* 🧩 **[Listado de Módulos](./docs/Modulos.md):** Descripción y diagrama de los módulos del sistema.
* 💾 **[Scripts de Base de Datos](./database/schema_unificado.sql):** Código SQL con la creación de tablas, triggers y políticas.

---

## 📂 Estructura del Repositorio  
El repositorio está organizado para separar claramente la documentación académica del código fuente, cumpliendo estrictamente con los lineamientos de la entrega:

```text
├── /docs                 # Documentación formal del TIF
│   ├── Arquitectura.md   # Arquitectura en capas, diagrama de secuencia y casos de uso
│   ├── BaseDeDatos.md    # Diseño completo de la Base de Datos (DER y Reglas de Negocio)
│   └── Modulos.md        # Listado de módulos y descripción
├── /frontend             # Código fuente del cliente (Next.js + Tailwind)
├── /backend              # Código fuente del servidor BFF (Node.js + Express)
├── /database             # Scripts SQL (Schema y datos iniciales)
├── /docker               # Configuración de contenedores (VPS)
└── README.md
```