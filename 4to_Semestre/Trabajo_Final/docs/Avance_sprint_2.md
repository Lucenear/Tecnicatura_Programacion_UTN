# Resumen del Sprint 2

## Modulo de Especialistas y Panel de Administracion

### 1. Base de Datos (Supabase)

- Modificamos la tabla usuario agregando la columna es_admin para diferenciar usuarios comunes de administradores.
- Creamos la tabla especialista vinculada con usuario y categoria, con estado inicial en Pendiente y campos para almacenar telefono, zona, descripcion y las URLs de la documentacion.
- Configuramos las politicas de seguridad RLS en la tabla especialista para que el publico general solo pueda consultar perfiles Aprobados, el usuario postulante pueda ver y editar su propio perfil, y los administradores tengan permisos totales de gestion.
- Configuramos las politicas de acceso sobre el bucket de almacenamiento especialistas_docs para controlar la subida de archivos y restringir la lectura de documentos sensibles unicamente al dueño y a los administradores.
- Unificamos todo el esquema relacional en el archivo database/schema_unificado.sql eliminando versiones intermedias.

### 2. Backend (Node.js + Express)

- Incorporamos la libreria multer configurada con almacenamiento en memoria RAM (memoryStorage) para recibir archivos binarios por multipart/form-data y transferirlos directamente a Supabase Storage sin guardarlos en el disco rigido de la VPS.
- Desarrollamos el middleware requireAdmin que consulta el rol del usuario autenticado en la base de datos antes de permitir el acceso a rutas protegidas.
- Implementamos el endpoint POST /api/especialistas/v1 para validar datos, subir DNI y certificado, y crear el registro de postulacion en estado Pendiente.
- Implementamos las rutas administrativas GET /api/admin/especialistas/v1/pendientes para listar postulaciones y PUT /api/admin/especialistas/v1/:id/estado para aprobar o rechazar perfiles guardando el motivo de rechazo.

### 3. Frontend (Next.js)

- Desarrollamos componentes de interfaz reutilizables (Input.tsx y Select.tsx) con soporte para manejo de errores y validaciones de formulario.
- Construimos la pagina /quiero-ser-especialista con el formulario completo de registro profesional, incluyendo la carga de imagenes para DNI y matricula.
- Desarrollamos la pantalla de confirmacion /quiero-ser-especialista/success para informar al usuario que su solicitud esta en revision.
- Implementamos el panel de control /admin con acceso restringido, mostrando tarjetas de revision con previsualizacion de comprobantes y botones de accion para aprobar o rechazar postulaciones.
- Actualizamos la barra de navegacion (Header) agregando enlaces condicionales hacia la postulacion y al panel de administracion segun el estado de autenticacion.

### 4. Seguridad en Frontend

- Incorporamos cabeceras HTTP de seguridad estandar en el archivo next.config.ts: X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy y Permissions-Policy para proteger la aplicacion contra ataques comunes en la web.


## Obstaculos tecnicos que enfrentamos

### 1. Incompatibilidad de tipos en clave foranea de categoria

- Problema: Al ejecutar el esquema inicial de especialista, la base de datos rechazo la creacion de la foreign key id_categoria porque estaba declarada como tipo UUID, mientras que en la tabla categoria el identificador era de tipo autonumerico (INTEGER).
- Solucion: Se corrigio la definicion del campo en el archivo SQL asignandole tipo INTEGER para que coincida exactamente con la clave primaria de categoria.

### 2. Error al iniciar el servidor de desarrollo del backend

- Problema: Al ejecutar pnpm run dev en el backend, la herramienta ts-node-dev fallaba debido a incompatibilidades con el soporte de modulos ESM nativos en Node.js.
- Solucion: Se reemplazo ts-node-dev por tsx en las dependencias y en el script de desarrollo de package.json, logrando una ejecucion fluida de TypeScript con recarga automatica.

### 3. Error de compilacion por importacion estatica de Supabase

- Problema: El comando next build arrojaba un fallo de compilacion en las nuevas pantallas porque se intentaba importar un objeto estatico supabase que no existia en la configuracion basada en @supabase/ssr.
- Solucion: Se refactorizo el codigo en los componentes del cliente para instanciar el cliente mediante la funcion createClient() en cada operacion.

### 4. Bloqueo de redireccion OAuth en pruebas locales

- Problema: Al probar la autenticacion desde una direccion IP local de red o tras volver de Google, la aplicacion quedaba en estado de carga permanente o no completaba la sesion por falta de un manejador de retorno.
- Solucion: Se creo la ruta /auth/callback/route.ts para intercambiar el codigo de autorizacion por la sesion correspondiente y se mejoro el manejo de errores en AuthContext.
