# Resumen del Sprint 3

## Buscador de Soluciones y Contacto (Parte Backend)

### 1. Clasificador de problemas por palabras clave

- Creamos un servicio liviano (clasificadorService.ts) que analiza el texto ingresado por el usuario.
- Compara el texto con listas de palabras asociadas a cada categoria (Plomeria, Electricidad, Educacion y Tecnologia).
- Si encuentra coincidencias, devuelve el identificador y nombre de la categoria detectada. Si no hay coincidencias, devuelve null para que el sistema busque de forma generica sin trabarse.
- La funcion limpia el texto antes de buscar (quita signos y mayusculas) para evitar fallos por variaciones al escribir.

### 2. Servicio de conexion con YouTube

- Implementamos youtubeService.ts para consultar la API de YouTube Data v3 y traer los 3 tutoriales mas relevantes.
- Habilitamos YouTube Data API v3 en Google Cloud Console y configuramos la clave en la variable de entorno YOUTUBE_API_KEY, logrando que el buscador devuelva videos reales en tiempo real segun la consulta del usuario.
- Agregamos el filtro videoEmbeddable=true y una validacion extra contra el endpoint /videos?part=status para descartar videos privados o bloqueados para reproducirse dentro de paginas externas (iframe), asegurando que solo se muestren los 3 primeros videos que realmente se pueden ver embebidos.
- Dejamos configurada una lista de respaldo con IDs reales por categoria para evitar fallos si en algun momento se agota la cuota diaria gratuita o falla la conexion con YouTube.

### 3. Endpoint de busqueda unificado

- Creamos la ruta GET /api/buscar/v1 protegida con el middleware requireAuth para validar que el usuario haya iniciado sesion antes de buscar.
- En una sola peticion hace las tres tareas: clasifica el texto, obtiene los 3 videos embebibles y consulta en Supabase a los especialistas que esten en estado Aprobado para esa categoria.
- Si no hay especialistas registrados todavia, devuelve una lista vacia sin fallar, permitiendo que el usuario vea los videos igualmente.

### 4. Registro de contacto en Base de Datos

- Agregamos la tabla contacto (id_usuario, id_especialista, created_at) con sus politicas RLS en database/schema_unificado.sql.
- Protegemos la ruta POST /api/especialistas/v1/:id/contacto con requireAuth, validamos que el especialista exista y este aprobado, y guardamos el registro del contacto en Supabase.
- Este registro deja lista la base necesaria para el Sprint 4, permitiendo validar que un usuario solo pueda calificar a un especialista si lo contacto previamente.

## Buscador de Soluciones y Contacto (Parte Frontend)

### 1. Barra de busqueda principal en Home

- Actualizamos la portada (src/app/page.tsx) incorporando un formulario de busqueda directo en el centro de la pantalla y botones con sugerencias rapidas.
- Indicamos debajo del buscador cuando el usuario no inicio sesion para que pueda ingresar con Google, y resolvemos la redireccion post-login directo desde el servidor (/auth/callback) hacia la consulta pendiente en /buscar para evitar mostrar la portada antes de cargar los resultados.

### 2. Pagina de resultados (/buscar)

- Desarrollamos la pantalla de resultados (src/app/buscar/page.tsx) validando la sesion activa del usuario. Si entra sin estar logueado, le muestra una pantalla clara para ingresar con Google antes de consultar el backend.
- Una vez autenticado, envia el token JWT en el header Authorization hacia GET /api/buscar/v1.
- Seccion de videos: muestra los 3 videos tutoriales embebidos mediante reproductores de YouTube adaptados tanto para celulares como para pantallas de escritorio.
- Seccion de especialistas: lista las tarjetas de profesionales aprobados en esa categoria con su zona, descripcion, calificacion (mostrando el badge "Nuevo" cuando aun no tienen reseñas o el promedio de estrellas cuando ya fueron calificados) y boton de contacto directo por WhatsApp.
- Al hacer clic en Contactar, envia el token JWT a POST /api/especialistas/v1/:id/contacto para guardar el contacto en Supabase y abre WhatsApp con un mensaje preconfigurado indicando la categoria del problema.
- Estado vacio: si no hay especialistas cargados para esa categoria, muestra un aviso claro y orienta al usuario para que se guie con los videos tutoriales mientras se suman mas expertos.

## Orden y calidad del codigo

- Creamos el archivo plantilla backend/.env.example con los nombres de las variables de entorno requeridas (incluyendo YOUTUBE_API_KEY) para documentar la configuracion del servidor sin exponer claves reales.
- Corregimos los errores de ESLint heredados de sprints anteriores en el frontend (admin/page.tsx, quiero-ser-especialista/page.tsx y AuthContext.tsx), dejando todo el proyecto con 0 errores de linter y de TypeScript.

## Obstaculos tecnicos que enfrentamos

### 1. Carga de variables de entorno en modulos ESM

- Problema: Al iniciar el servidor, Node.js arrojaba un error indicando que supabaseUrl era requerida y no levantaba. Esto pasaba porque los imports estaticos de las rutas se cargaban antes de que se ejecutara dotenv.config().
- Solucion: Cambiamos la importacion a import 'dotenv/config' en la primera linea de index.ts y agregamos la lectura de dotenv directamente en authMiddleware.ts para asegurar que las variables esten listas antes de inicializar la conexion con Supabase.

### 2. Videos de respaldo no disponibles y filtro de insercion

- Problema: En las primeras pruebas locales sin API Key configurada, el reproductor mostraba "Video no disponible" por usar IDs de ejemplo ficticios, y al conectar la API podian aparecer videos con insercion deshabilitada por su autor.
- Solucion: Reemplazamos los IDs de prueba por videos reales verificados, configuramos YOUTUBE_API_KEY con Google Cloud y sumamos el filtro videoEmbeddable=true junto con la verificacion de status.embeddable en la API para garantizar que todos los resultados se reproduzcan dentro de nuestra pagina.

### 3. Permisos SQL en Supabase y validacion en postulacion de especialistas

- Problema: Al probar el alta de especialistas y las consultas al backend, Supabase rechazaba el acceso a las tablas del esquema public con error 42501 (`permission denied`), porque las politicas RLS filtran filas pero no otorgan privilegios SQL (`GRANT`) sobre las tablas y secuencias. Ademas, el endpoint de postulacion no validaba perfiles previos ni sincronizaba usuarios faltantes en `public.usuario`, y los campos del formulario se veian con bajo contraste en modo oscuro.
- Solucion: Agregamos las sentencias `GRANT` y `ALTER DEFAULT PRIVILEGES` al final de `database/schema_unificado.sql` y las aplicamos en Supabase. Tambien reforzamos `POST /api/especialistas/v1` para verificar perfiles previos (permitiendo reenvio si estaba rechazado), sincronizar `public.usuario` cuando falte y devolver errores especificos, y agregamos color de texto explicito en `Input.tsx`, `Select.tsx` y `quiero-ser-especialista/page.tsx`.

### 4. Documentos privados en panel admin y mejoras de usabilidad

- Problema: En `/admin` las fotos de DNI y certificado devolvian 404 (`Bucket not found`) porque el bucket `especialistas_docs` es privado (`public: false`) y se estaba guardando `getPublicUrl`. Ademas, el panel no estaba pensado para filtrar varias solicitudes y el acceso a la postulacion redirigia a otra ruta en lugar de abrirse sobre la pantalla actual.
- Solucion: Pasamos a guardar el path interno en `especialistasRoutes.ts` y a generar URLs firmadas temporales (`createSignedUrl`) desde `GET /api/admin/especialistas/v1/pendientes` en `adminRoutes.ts` para mantener el bucket privado sin exponer documentos. En el frontend sumamos filtros por texto/categoria, contador de pendientes, vista en dos columnas y visor ampliado en `admin/page.tsx`, y creamos `PostulacionContext.tsx` junto a `PostulacionModal.tsx` (usando `<dialog>` nativo con cierre mediante `X`) para abrir y confirmar la postulacion sin cambiar de pagina.

### 5. Control de acceso al Panel Admin y visualizacion de especialistas nuevos

- Problema: El enlace "Panel Admin" se mostraba en la barra de navegacion para cualquier usuario autenticado aunque no tuviera `es_admin = true` en Supabase, y los especialistas recien aprobados sin reseñas aparecian con `0.0` estrellas en `/buscar`.
- Solucion: Actualizamos `GET /api/auth/v1/me` en `authRoutes.ts` para devolver el campo `esAdmin` consultando `public.usuario`, guardamos ese estado en `AuthContext.tsx` y condicionamos la renderizacion de "Panel Admin" en `Header.tsx` y en `admin/page.tsx`. En `buscar/page.tsx` reemplazamos el `0.0` por el badge `Nuevo` cuando `total_resenas` es 0.

### 6. Endurecimiento de seguridad en base de datos, Docker y subida de archivos

- Problema: Si bien las claves privadas (`SERVICE_ROLE` y `YOUTUBE_API_KEY`) solo residian en el backend y el bucket `especialistas_docs` ya era privado, las politicas SQL iniciales permitian `UPDATE` completo sobre `usuario` (riesgo de modificar `es_admin`), acceso `anon`/`authenticated` directo sobre `especialista` y subidas directas al bucket. Ademas, `especialistasRoutes.ts` no validaba el tipo MIME de las imagenes en el servidor y `Dockerfile` copiaba `.env` si existia durante el build.
- Solucion: Endurecimos `database/schema_unificado.sql` restringiendo `UPDATE` de `usuario` solo a `nombre` y `avatar_url` con `WITH CHECK` sobre `es_admin`, revocando escritura/lectura directa sobre `especialista`, insercion directa en `contacto` y subida directa a `storage.objects` (canalizando esas operaciones unicamente por el backend BFF). Tambien agregamos whitelist de MIME (`JPG`, `PNG`, `WebP`) en `especialistasRoutes.ts`, limpiamos el detalle de error 500 en `buscarRoutes.ts` y creamos `backend/.dockerignore`.

