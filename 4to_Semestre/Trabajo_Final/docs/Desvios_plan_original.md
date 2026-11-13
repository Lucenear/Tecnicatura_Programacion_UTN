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

## Sprint 3: Buscador de Soluciones y Contacto

### 1. Unificacion de Endpoints de Busqueda
- **Plan original:** Previa dos endpoints independientes: uno para consultar los videos de YouTube (/api/buscar/v1) y otro para combinar videos con especialistas (/api/buscar/completo/v1).
- **Implementacion real:** Se concentro toda la operacion en un unico endpoint GET /api/buscar/v1 que resuelve la clasificacion, los videos tutoriales y los especialistas aprobados.
- **Justificacion:** Reduce a la mitad la cantidad de peticiones de red realizadas por el cliente, disminuye los tiempos de espera y simplifica el consumo de datos desde la interfaz de usuario.

### 2. Contacto directo desde los resultados de busqueda
- **Plan original:** Previa separar el listado publico de especialistas con filtros laterales (/especialistas) y la vista de perfil individual (/especialistas/:id), ademas de guardar el historial de busquedas del usuario.
- **Implementacion real:** Se mostraron las tarjetas completas de los especialistas aprobados (con foto, zona, descripcion, calificacion y boton de WhatsApp) directamente en la pantalla de resultados (/buscar) debajo de los videos tutoriales, omitiendo por ahora el historial de busquedas.
- **Justificacion:** Reduce pasos de navegacion para que el usuario logueado encuentre ayuda mas rapido en una sola vista y prioriza el alcance principal del MVP Base al trabajar un solo integrante en el desarrollo.

## Sprint 4: Reseñas, Estado de Postulacion y Cierre

### 1. Recalculo inmediato de calificaciones por trigger en PostgreSQL
- **Plan original:** Proponia ejecutar el trigger o logica de recalculo de promedio de estrellas en un horario de baja concurrencia.
- **Implementacion real:** Se configuro el trigger `on_resena_changed` (`AFTER INSERT OR UPDATE OR DELETE`) para actualizar de forma inmediata `promedio_estrellas` y `total_resenas` en `especialista` cada vez que un usuario registra o edita una reseña.
- **Justificacion:** El volumen de escrituras esperado en el MVP es bajo y el recalculo inmediato evita inconsistencias visuales, logrando que tanto el modal como las tarjetas de `/buscar` muestren el promedio actualizado al instante.

### 2. Reseñas en modal dentro de /buscar en lugar de ruta separada
- **Plan original:** Ubicaba el listado de reseñas y el formulario de calificacion dentro de la vista individual del especialista (`/especialistas/:id`).
- **Implementacion real:** Se implemento `ResenasModal` (elemento `<dialog>` nativo) accesible directamente desde cada tarjeta en `/buscar`.
- **Justificacion:** Mantiene la coherencia con la simplificacion arquitectonica del Sprint 3, evitando saltos de pagina adicionales mientras conserva todas las reglas de negocio del CU-06 (contacto previo, unicidad, edicion de opinion propia y bloqueo de autocalificacion).

### 3. Consulta directa del estado de postulacion en el modal
- **Plan original:** En el Sprint 2 se habia postergado la notificacion por WhatsApp al aprobar o rechazar postulaciones.
- **Implementacion real:** Se incorporo el endpoint `GET /api/especialistas/v1/mi-postulacion` y vistas de estado dentro de `PostulacionModal` para informar en linea si la solicitud esta `Pendiente`, `Aprobado` o `Rechazado` (mostrando el `motivo_rechazo` con opcion de reenvio precargado).
- **Justificacion:** Resuelve la devolucion de estado hacia el postulante dentro de la propia plataforma sin requerir integracion paga de mensajeria externa.

