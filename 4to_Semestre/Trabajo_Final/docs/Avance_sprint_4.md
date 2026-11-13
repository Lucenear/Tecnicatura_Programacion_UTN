# Resumen del Sprint 4

## Sistema de Reseñas y Calificaciones (CU-06)

### 1. Base de Datos y Recalculo Automatico

- Agregamos la tabla `public.resena` en `database/schema_unificado.sql` con relacion hacia `usuario` y `especialista`, calificacion entera restringida entre 1 y 5 (`CHECK (estrellas >= 1 AND estrellas <= 5)`), comentario opcional y restriccion de unicidad `uq_resena_usuario_especialista` para garantizar una unica reseña por par usuario-especialista.
- Creamos el trigger `on_resena_changed` (`AFTER INSERT OR UPDATE OR DELETE`) asociado a la funcion `public.recalcular_calificacion_especialista()` (`SECURITY DEFINER`), que recalcula `promedio_estrellas` y `total_resenas` en la tabla `especialista` ante cada alta, modificacion o eliminacion.
- Configuramos Row Level Security (`ENABLE ROW LEVEL SECURITY`) y revocamos permisos directos (`REVOKE ALL`) para `anon` y `authenticated` sobre `public.resena`, canalizando todas las lecturas y escrituras a traves del backend BFF (`service_role`).

### 2. Endpoints en el Backend (BFF)

- Implementamos `GET /api/especialistas/v1/:id/resena` (protegido con `requireAuth`) en `backend/src/routes/especialistasRoutes.ts`, que valida el UUID, confirma que el especialista este `Aprobado` y devuelve el listado de opiniones ordenadas por fecha de actualizacion, junto a los flags `haContactado`, `esPropioPerfil`, `puedeCalificar` y `miResena`.
- Para proteger la privacidad de los usuarios, el endpoint no expone los UUID de otros usuarios y solo marca la reseña del usuario actual con `es_mia: true`.
- Implementamos `POST /api/especialistas/v1/:id/resena` (protegido con `requireAuth`), validando entero de 1 a 5 estrellas y comentario opcional de hasta 500 caracteres, bloqueando autocalificaciones (`403`), exigiendo al menos un registro previo en `public.contacto` (`403`), permitiendo actualizar una reseña existente del mismo usuario y devolviendo los nuevos totales recalculados por el trigger.

### 3. Modal de Reseñas y Actualizacion en Vivo (/buscar)

- Creamos el componente `ResenasModal.tsx` sobre un elemento `<dialog>` nativo (`showModal()`, cierre por `X`, tecla `Escape` o clic fuera del cuadro).
- Incorporamos un selector accesible de 1 a 5 estrellas basado en radio buttons nativos dentro de `<fieldset>` y `<legend>`, campo de comentario con contador de 500 caracteres y mensajes claros de error o confirmacion.
- Cuando el usuario no contacto previamente al profesional o intenta ver su propio perfil, el modal oculta el formulario y muestra un aviso explicativo siguiendo los flujos alternativos del CU-06.
- Integramos el boton `Reseñas / Calificar` y el contador de calificaciones directamente en cada tarjeta de `frontend/src/app/buscar/page.tsx`, actualizando al instante el estado de la tarjeta (por ejemplo pasando de `Nuevo` a `★ 5.0 (1)`) al guardar una opinion.

## Estado de Postulacion de Especialistas y Cierre Legal

### 1. Consulta de estado propio en PostulacionModal

- Agregamos el endpoint `GET /api/especialistas/v1/mi-postulacion` (`requireAuth`) en el backend para devolver el estado actual del usuario postulante (`Pendiente`, `Aprobado` o `Rechazado` con `motivo_rechazo`), sin exponer rutas de archivos del bucket privado.
- Actualizamos `frontend/src/components/especialista/PostulacionModal.tsx` para consultar este endpoint al abrir el modal y mostrar una pantalla acorde: aviso de revision en curso si esta `Pendiente`, resumen del perfil activo y reputacion si ya fue `Aprobado`, o detalle del motivo de rechazo junto al boton para corregir los datos precargados y reenviar la solicitud.

### 2. Paginas Legales y Footer

- Creamos las paginas estaticas `/terminos` (`frontend/src/app/terminos/page.tsx`) y `/privacidad` (`frontend/src/app/privacidad/page.tsx`) especificando el rol de intermediario digital de FixYa, la ausencia de pasarela de pagos o responsabilidad civil por trabajos presenciales, el caracter orientativo de los tutoriales y el resguardo privado de documentos en `especialistas_docs`.
- Creamos `frontend/src/components/layout/Footer.tsx` y lo integramos en `app/layout.tsx`, vinculando ademas `Terminos y Condiciones` dentro del formulario de postulacion de especialistas (`PostulacionModal.tsx` y `quiero-ser-especialista/page.tsx`).

### 3. Ajustes de UI y Experiencia de Usuario en la Home y Buscador

- Eliminamos badges redundantes en la cabecera hero para dar foco inmediato a la propuesta de valor y al buscador principal.
- Rediseñamos las tres tarjetas del flujo explicativo de FixYa eliminando numeraciones duplicadas entre insignias y titulos, incorporando microinteracciones, bordes definidos y elementos de soporte que destacan el valor de cada paso sin patrones artificiales.
- Alineamos a la izquierda los titulos y descripciones para seguir la misma guia vertical de la insignia 'Paso 1/2/3', centrando las pildoras de beneficio al pie de cada tarjeta y eliminando marcas de agua de fondo para mantener una lectura limpia y sin superposiciones.
- Corregimos la alineacion vertical del boton 'Buscar' en la cabecera, nivelando su altura con el campo de texto y aplicando centrado en el eje transversal para eliminar el desfase superior.
- Configuramos un icono transparente en los metadatos de Next.js para retirar el favicon residual de la pestana del navegador.
- Corregimos desbordes horizontales en resoluciones menores a 490px mediante envoltura flexible en el pie de pagina y cabecera, junto con recorte transversal en el contenedor raiz.
- Incorporamos menu desplegable responsivo en la cabecera para dispositivos moviles, garantizando acceso directo a todas las opciones de usuario, administracion y cierre de sesion.
- Refinamos la jerarquia visual de las tarjetas de profesionales en la seccion de busqueda (`/buscar`): modernizamos el boton de WhatsApp con tono esmeralda sobrio y texto e icono en blanco puro, convertimos la insignia de calificacion superior en boton interactivo directo hacia el modal de resenas, reemplazamos el boton secundario gigante por un enlace de texto centrado y discreto, y limpiamos el fondo de la biografia sin bordes tipo input para optimizar el respiro visual.
- Corregimos la redireccion al contactar especialistas por WhatsApp desde el buscador: eliminamos la asignacion redundante sobre la ventana activa para evitar que la pestana de FixYa se redirija a WhatsApp simultaneamente junto a la nueva pestana abierta.

## Alcance de IA (Ollama)

- Siguiendo la estrategia de MVP escalonado definida en la propuesta original, priorizamos completar y verificar el flujo integral de reseñas (CU-06), estado de postulaciones y cierre legal antes de avanzar con la integracion opcional del modelo local de Ollama en la VPS, manteniendose operativo el clasificador por palabras clave en el backend.

## Obstaculos tecnicos que enfrentamos

### 1. Privacidad de autores y estado sincronizado entre modales

- Problema: Al exponer el listado de reseñas en el cliente, devolver el campo `id_usuario` de cada autor hubiera permitido correlacionar identidades internas, y mantener estado residual entre especialistas distintos dentro de un mismo modal podia mostrar datos previos por un instante.
- Solucion: Filtramos `id_usuario` en el BFF devolviendo unicamente el booleano `es_mia` respecto al token autenticado, y aislamos el contenido interno de `ResenasModal` (indexado por `especialista.id`) y `PostulacionModal` para inicializar consultas limpias en cada apertura y sincronizar los promedios actualizados hacia `/buscar` mediante callback.

### 2. Recalculo de promedios sin tareas diferidas externas

- Problema: La propuesta original mencionaba recalcular promedios mediante un proceso en horario de baja concurrencia, lo cual impediria al usuario ver reflejada su nueva calificacion inmediatamente despues de enviarla en la demo o en produccion.
- Solucion: Implementamos un trigger directo en PostgreSQL (`on_resena_changed`) sobre `INSERT`, `UPDATE` y `DELETE` en `resena`, logrando consistencia inmediata entre la tabla de reseñas y las tarjetas visibles en el buscador sin depender de cron jobs adicionales.
