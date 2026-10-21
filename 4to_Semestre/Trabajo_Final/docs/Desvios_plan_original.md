# Registro de Desvios - Trabajo Practico Integral "FixYa"

Este documento registra las modificaciones y adaptaciones tecnicas realizadas sobre el [Plan Original](Propuesta%20de%20proyecto%20y%20Repositorio.md) durante el desarrollo del proyecto. Todos los desvios registrados aqui representan mejoras de optimizacion, seguridad o arquitectura, sin afectar negativamente el alcance del proyecto.

## Sprint 1: Fundacion, Autenticacion e Infraestructura en la Nube

### 1. Flujo de Autenticacion en el Backend (BFF)
- **Plan original:** Crear un middleware en el backend (Node.js) para validar JWT y un endpoint GET /api/auth/v1 para obtener los datos del usuario logueado.
- **Implementacion real:** Se opto por utilizar el SDK nativo de Supabase Auth directamente en el Frontend (Next.js) mediante un AuthContext.
- **Justificacion:** Esta arquitectura reduce la latencia, disminuye la carga en nuestro servidor Node.js y maneja el estado de la sesion y las cookies de forma automatica y segura en el cliente. El middleware de validacion JWT en el backend se desarrollo en el Sprint 2 exclusivamente para proteger las rutas de escritura (como la postulacion de especialistas), haciendo innecesario el endpoint de consulta de usuario (/api/auth/v1).

### 2. Seguridad en la Infraestructura (VPS y Cloudflare)
- **Plan original:** Desplegar el Backend for Frontend (BFF) en la VPS y utilizar el Proxy de Cloudflare para el dominio.
- **Implementacion real:** Se implemento un Tunel Zero Trust de Cloudflare (Cloudflared) en la VPS.
- **Justificacion:** En lugar de exponer puertos publicos en la VPS (lo cual representa un riesgo de seguridad de nivel de red), el tunel crea una conexion cifrada saliente desde el contenedor Docker hacia Cloudflare. De esta forma, el backend (api-fixya.sierrascode.com) queda invisible en internet para escaneos de puertos o ataques directos.

## Sprint 2: Modulo de Especialistas y Panel de Administracion

### 1. Gestion de Roles en Base de Datos (es_admin)
- **Plan original:** No detallaba el mecanismo especifico para la asignacion de privilegios de administrador.
- **Implementacion real:** Se incorporo una columna es_admin en la tabla usuario junto a una funcion is_admin() en PostgreSQL, la cual se evalua tanto en las politicas RLS de la base de datos como en el middleware requireAdmin del BFF.
- **Justificacion:** Centraliza las reglas de acceso directamente en la base de datos relacional y evita depender de configuraciones complejas o servicios para la autenticacion.

### 2. Procesamiento de Archivos en Memoria RAM con Multer
- **Plan original:** Previa la subida de archivos al servicio de almacenamiento en la nube a traves del backend.
- **Implementacion real:** Se configuro multer utilizando almacenamiento en memoria (memoryStorage) en lugar de guardar archivos en el sistema de archivos local de la VPS.
- **Justificacion:** Previene el consumo excesivo de disco en el servidor de aplicaciones, reduce operaciones de lectura y escritura en almacenamiento local y minimiza conflictos de permisos en el sistema operativo.

### 3. Postergacion de Notificaciones por Mensajeria Externa
- **Plan original:** Mencionaba el envio de notificaciones automaticas por WhatsApp al momento de aprobar o rechazar postulaciones.
- **Implementacion real:** Se priorizo la persistencia y auditoria en la base de datos (registro de estado, motivo de rechazo y marcas de tiempo), postergando la integracion con APIs de mensajeria externa para las etapas finales del desarrollo.
- **Justificacion:** Permite validar el flujo operativo principal sin introducir costos asociados a servicios de mensajeria ni depender de procesos de verificacion de cuentas comerciales en etapas tempranas.
