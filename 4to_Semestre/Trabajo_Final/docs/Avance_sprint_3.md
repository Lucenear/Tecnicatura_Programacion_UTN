# Resumen del Sprint 3 (En curso)

## Buscador de Soluciones y Contacto (Parte Backend)

### 1. Clasificador de problemas por palabras clave

- Creamos un servicio liviano (clasificadorService.ts) que analiza el texto ingresado por el usuario.
- Compara el texto con listas de palabras asociadas a cada categoria (Plomeria, Electricidad, Educacion y Tecnologia).
- Si encuentra coincidencias, devuelve el identificador y nombre de la categoria detectada. Si no hay coincidencias, devuelve null para que el sistema busque de forma generica sin trabarse.
- La funcion limpia el texto antes de buscar (quita signos y mayusculas) para evitar fallos por variaciones al escribir.

### 2. Servicio de conexion con YouTube

- Implementamos youtubeService.ts para consultar la API de YouTube Data v3 y traer los 3 tutoriales mas relevantes.
- Incorporamos una lista de videos de respaldo para cada rubro. Si la API no tiene clave configurada, no responde o se agota la cuota gratuita diaria, el sistema muestra estos videos en lugar de arrojar un error en pantalla.

### 3. Endpoint de busqueda unificado

- Creamos la ruta GET /api/buscar/v1 que recibe la consulta por parametro en la URL.
- En una sola peticion hace las tres tareas: clasifica el texto, obtiene los 3 videos y consulta en Supabase a los especialistas que esten en estado Aprobado para esa categoria.
- Si no hay especialistas registrados todavia, devuelve una lista vacia sin fallar, permitiendo que el usuario vea los videos igualmente.

### 4. Metrica de contacto

- Creamos la ruta POST /api/especialistas/v1/:id/contacto.
- Valida que el especialista exista y este aprobado, y registra en el servidor el momento en que un usuario hace clic para contactarlo.

## Obstaculos tecnicos que enfrentamos

### 1. Carga de variables de entorno en modulos ESM

- Problema: Al iniciar el servidor, Node.js arrojaba un error indicando que supabaseUrl era requerida y no levantaba. Esto pasaba porque los imports estaticos de las rutas se cargaban antes de que se ejecutara dotenv.config().
- Solucion: Cambiamos la importacion a import 'dotenv/config' en la primera linea de index.ts y agregamos la lectura de dotenv directamente en authMiddleware.ts para asegurar que las variables esten listas antes de inicializar la conexion con Supabase.
