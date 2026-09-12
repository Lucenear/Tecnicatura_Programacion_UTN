# Registro de Desvíos - Trabajo Práctico Integral "FixYa"

Este documento registra las modificaciones y adaptaciones técnicas realizadas sobre el [Plan Original](Propuesta%20de%20proyecto%20y%20Repositorio.md) durante el desarrollo del proyecto. Todos los desvíos registrados aquí representan mejoras de optimización, seguridad o arquitectura, sin afectar negativamente el alcance del proyecto.

## Sprint 1: Fundación, Autenticación e Infraestructura en la Nube

### 1. Flujo de Autenticación en el Backend (BFF)
- **Plan original:** Crear un middleware en el backend (Node.js) para validar JWT y un endpoint `GET /api/auth/v1` para obtener los datos del usuario logueado.
- **Implementación real:** Se optó por utilizar el SDK nativo de Supabase Auth directamente en el Frontend (Next.js) mediante un `AuthContext`. 
- **Justificación:** Esta arquitectura reduce drásticamente la latencia, disminuye la carga en nuestro servidor Node.js y maneja el estado de la sesión y las cookies de forma automática y segura en el cliente. El middleware de validación JWT en el backend se desarrollará en el Sprint 2 exclusivamente para proteger las rutas de escritura (como la postulación de especialistas), haciendo innecesario el endpoint de consulta de usuario (`/api/auth/v1`).

### 2. Seguridad en la Infraestructura (VPS y Cloudflare)
- **Plan original:** Desplegar el Backend for Frontend (BFF) en la VPS y utilizar el Proxy de Cloudflare para el dominio.
- **Implementación real:** Se implementó un **Túnel Zero Trust de Cloudflare (Cloudflared)** en la VPS.
- **Justificación:** En lugar de exponer puertos públicos en la VPS (lo cual representa un riesgo de seguridad de nivel de red), el túnel crea una conexión cifrada saliente desde el contenedor Docker hacia Cloudflare. De esta forma, el backend (`api.fixya.sierrascode.com`) queda completamente invisible en internet para escaneos de puertos o ataques directos, elevando la arquitectura a un estándar de seguridad empresarial.
