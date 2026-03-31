# Trabajo Final Integrador – Programación II

Trabajo práctico integrador de Programación II, correspondiente a la **Tecnicatura Universitaria en Programación a Distancia**, dictada por la **UTN**.

---

## 👥 Alumnos

- **Elizondo, Iñaki**  
- **Ducoli, Maximiliano David**  
- **Farias, Gustavo**  

## Comisión:
- **M2025-13**

## 🎥 Enlace al video explicativo
https://drive.google.com/file/d/1rngVOi8TYAfpe1QRqil7M3AtdjIfZAZb/view?usp=drive_link

---

**Aplicación Java con Relación 1→1 Unidireccional + DAO + MySQL**

Este proyecto implementa una aplicación de gestión de empleados y legajos utilizando Java, JDBC y MySQL, siguiendo buenas prácticas de arquitectura por capas (entities, dao, service, config, main), el patrón DAO y manejo transaccional con commit/rollback.

La relación entre `Empleado` y `Legajo` es **unidireccional 1→1**, donde cada empleado posee un único legajo institucional asociado.

---

## 🛠️ Tecnologías Utilizadas

- **Lenguaje:** Java 21
- **Base de Datos:** MySQL 8.0
- **Conexión:** JDBC (sin ORM)
- **Patrones:** DAO, Service, Capas
- **Herramientas:** IntelliJ IDEA / Eclipse, MySQL Workbench, Git, GitHub

---

## 📁 Estructura del Proyecto
```
DB/
    ├── 01 - create_schema.sql/ # Creacion del esquema de la base de datos
    ├── 02 - create_tables.sql/ # Creacion de las tablas (Legajo y Empleado)
    ├── 03 - Creacion de indices.sql/
    ├── 04 - create_SP_insert_registros.sql/ # Creacion del SP para crear 500.000 registros
    ├── 05 - call_SP_insert_registros.sql/ # Call al SP para ejecutar create de registros
Diagrama_UML
    ├── DIAGRAMA_UML.uxf/
src/
    ├── config/ # Gestión de conexión a la base de datos
    ├── dao/ # Interfaces y clases DAO con PreparedStatement
    ├── entities/ # Clases Empleado y Legajo (entidades con id y eliminado)
    ├── main/ # AppMenu: menú de consola interactivo
    ├── service/ # Lógica de negocio, validaciones y transacciones
```

---

## 🗃️ Dominio: Empleado → Legajo

### Clase `Empleado` (A)
- id, nombre, apellido, dni (único), email, fechaIngreso, área, legajo (referencia 1→1)
- baja lógica (`eliminado = true/false`)

### Clase `Legajo` (B)
- id, nroLegajo (único), categoría, estado (ACTIVO/INACTIVO), fechaAlta, observaciones
- clave foránea única hacia `empleado_id`

---

## 🔧 Requisitos e Instalación

### 1. Requisitos previos
- Java JDK 21 instalado
- MySQL 8.0 instalado y en ejecución
- MySQL Workbench (opcional, para gestionar la base)

### 2. Crear la base de datos y tablas

Ejecuta el script SQL proporcionado en MySQL Workbench:

```sql
-- Ejecutar desde MySQL Workbench
SOURCE:
Este repositorio en la carpeta DB;

Este script:

Crea la base de datos tpfi_ddbb
Crea las tablas empleado y legajo con restricciones (PK, FK, UNIQUE, ON DELETE CASCADE)

⚠️ Asegurate de conocer las credenciales de usuario y puerto.

🔐 Credenciales de Base de Datos
El proyecto está configurado para conectarse con los siguientes parámetros:

url=jdbc:mysql://localhost:3306/tpfi_ddbb
user=root
password= (vacio o segun configuracion local de cada integrante)



▶️ Cómo Compilar y Ejecutar
Desde terminal (Linux/Mac/Windows)

# 1. Compilar todo el proyecto
javac -d bin -sourcepath src src/main/AppMenu.java

# 2. Ejecutar la aplicación
java -cp bin main.AppMenu

Desde IDE (Netbeans / IntelliJ / Eclipse)
Abre el proyecto.
Asegurate de tener el driver JDBC de MySQL en el classpath (incluido como JAR).
Ejecuta la clase AppMenu.

🖥️ Funcionalidades del Menú de Consola
La aplicación ofrece un menú interactivo para realizar operaciones CRUD completas:

✅ Crear Empleado (con Legajo opcional)
✅ Asociar Legajo a Empleado existente
✅ Listar Empleados activos
✅ Buscar Empleado por DNI
✅ Actualizar datos personales o estado del legajo
✅ Eliminar lógicamente (marca como eliminado)
✅ Manejo robusto de errores (DNI duplicado, entrada inválida, etc.)

Todas las operaciones compuestas (ej: crear Empleado + Legajo) se realizan 
dentro de una transacción:

Si falla cualquiera, se hace rollback.
Si todo sale bien, se hace commit.

📎 Entregables Incluidos:

Código fuente completo
schema.sql: creación de base y tablas
data.sql: datos de prueba
Diagrama UML (uml.png)
Informe en PDF (informe_tfi_programacion2.pdf)
Este archivo README.md
Enlace al video del equipo

🎥 El video del Equipo incluye:

Presentación de los integrantes.
Demostración del menú y flujos CRUD.
Explicación técnica de las capas.
Simulación de rollback ante error.

⚠️ Nota: El trabajo requiere grupo de 4 personas. Coordinar inclusión del 
cuarto integrante según normativa de la tecnicatura.

🤖 Uso de Inteligencia Artificial
Se utilizó IA generativa únicamente para ayudar en la redacción, formateo y 
estructuración del presente README.md y del informe PDF, asegurando claridad 
y profesionalismo. No se utilizó para generar lógica de negocio ni código 
funcional principal.

📚 Fuentes y Recursos
Oracle JDBC Documentation
MySQL 8.0 Reference Manual
Guía de buenas prácticas de Java (Clean Code)
Repositorio oficial del curso – UTN FRBA Programación 2


