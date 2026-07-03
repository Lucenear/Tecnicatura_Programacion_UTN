# Trabajo Práctico Integrador - Programación 3

Sistema de gestión de pedidos de comida (Food Store) con Java, JPA, Hibernate y H2.

## Enlaces

🎥 **Video Demostrativo:** [Ver Video en Google Drive](https://drive.google.com/file/d/1JjZWK1aW7A1dGW8y4UGLxWDIsRGpoHkp/view?usp=sharing)

📚 **Documentación PDF:** [Ver Documentacion en Google Drive](https://drive.google.com/file/d/1XSvWpIIrBjyEX_06mKEoqtY8zLq6GwQp/view?usp=sharing)

---
### Estructura del Proyecto
- `/backend`: Código fuente de la API (Java Consola + JPA).
- `/frontend`: Código fuente de la interfaz de usuario (TypeScript).

---

## Documentacion del Proyecto: Food Store

### 1. Introduccion
El presente documento detalla la arquitectura, el modelo de dominio y las decisiones tecnicas implementadas en el desarrollo del sistema "Food Store". El objetivo principal del proyecto fue construir un sistema de gestion de pedidos de comida, abarcando tanto una API backend robusta como una interfaz frontend simulada, preparadas para una futura integracion completa.

### 2. Tecnologias Utilizadas
**Backend:**
- **Lenguaje:** Java 17
- **Gestor de Dependencias:** Gradle
- **Persistencia:** JPA (Java Persistence API) implementado con Hibernate ORM.
- **Base de Datos:** H2 Database (modo archivo local).
- **Logueo:** Logback Classic (para silenciar logs de inicializacion y proveer una consola limpia).

**Frontend:**
- **Lenguaje:** TypeScript, HTML5, CSS3.
- **Entorno:** Vite.
- **Almacenamiento:** LocalStorage y fetch a archivos JSON estaticos locales (simulando base de datos).

### 3. Modelo de Dominio y Relaciones
El sistema se estructuro utilizando herencia y mapeo relacional. Todas las entidades heredan de una clase abstracta `Base` (`@MappedSuperclass`), la cual provee de forma centralizada el ID, la fecha de creacion y el atributo booleano para bajas logicas.

**Relaciones implementadas:**
- **Categoria -> Producto (1 a N):** Relacion unidireccional por agregacion. El Producto conoce su Categoria, pero la Categoria no mantiene una lista en memoria, optimizando recursos.
- **Pedido -> DetallePedido (1 a N):** Relacion unidireccional por composicion con cascada completa (`CascadeType.ALL`). El ciclo de vida del Detalle depende exclusivamente de su Pedido padre.
- **Usuario -> Pedido (1 a N):** Relacion unidireccional mapeada via JOIN.

Adicionalmente, la entidad Pedido implementa la interfaz `Calculable`, garantizando el cumplimiento de contratos para calcular dinamicamente los totales.

### 4. Decisiones Tecnicas y de Diseno

#### 4.1. Transaccionalidad Atomica
Durante el alta de un Pedido, fue critico asegurar la consistencia de los datos (creacion del pedido, asociacion al usuario y reduccion de stock). Todo el bloque se ejecuta dentro de un unico `EntityManager`, abriendo la transaccion con `begin()`. Si alguna validacion falla o hay falta de stock, se invoca `rollback()` anulando cualquier impacto en la base de datos. Solo si todo es exitoso, se ejecuta `commit()`.

#### 4.2. Bajas Logicas
Ningun registro se elimina fisicamente de la base de datos (con excepcion de la limpieza de tablas en fase de desarrollo). La eliminacion se maneja marcando el flag `eliminado = true`. Todos los repositorios fueron adaptados para filtrar y traer unicamente los registros activos (eliminado = false).

#### 4.3. Consultas JPQL Personalizadas
Para resolver cruces de datos que exceden a los metodos CRUD basicos, se utilizaron consultas JPQL tipadas con parametros nombrados. Ejemplos destacados:
- `buscarProductosPorCategoria(Long catId)`: Permite listar el catalogo filtrado.
- `buscarPorMail(String mail)`: Retorna un `Optional<Usuario>` previniendo errores de puntero nulo y validando unicidad.
- `buscarPorEstado(Estado estado)`: Facilita los reportes estadisticos.

#### 4.4. Estructura del Frontend y Fetch a JSON
Para la presentacion se desarrollo una arquitectura de componentes web simulada. La capa de acceso a datos (`db.ts`) lee los catalogos iniciales desde archivos estaticos JSON (ej: `fetch('/data/productos.json')`) utilizando promesas y promoviendolos al LocalStorage del navegador web para mantener el estado. 
Esta capa intermedia fue disenada con el patron Adapter; en el futuro, para integrar la interfaz visual con nuestro backend Java via REST, bastara con reemplazar la lectura de LocalStorage por llamadas `fetch('http://localhost:8080/api/productos')`, manteniendo la logica de UI completamente intacta.

### 5. Instrucciones de Ejecucion
1. **Frontend:** Abrir una terminal en la carpeta `/frontend`, instalar dependencias con `npm install` y ejecutar el servidor con `npm run dev`.
2. **Backend:** Abrir una terminal en la carpeta `/backend` y ejecutar el comando `./gradlew run --console=plain`. Esto inicializara Hibernate, conectara a la base H2 y desplegara el menu interactivo.

### 6. Credenciales de Acceso (Frontend)
Para probar la interfaz web con los distintos roles, se proveen los siguientes usuarios de prueba:
- **Usuario Administrador:**
  - Correo: `admin@admin.com`
  - Clave: `123456`
- **Usuario Cliente (Comprador):**
  - Correo: `cliente@food.com`
  - Clave: `cliente123`