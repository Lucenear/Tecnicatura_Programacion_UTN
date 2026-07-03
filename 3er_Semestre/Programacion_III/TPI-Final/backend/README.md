# Food Store - Backend JPA/Consola

Este proyecto contiene el backend del sistema Food Store desarrollado en Java. Utiliza JPA con Hibernate para la persistencia en una base de datos H2 en modo archivo, y presenta un menú interactivo por consola.

## Requisitos Previos

- Java Development Kit (JDK) 17 o superior.
- (Opcional) Gradle si no se desea usar el `gradlew` provisto.

## Instrucciones de Ejecución

1. **Compilar el proyecto**:
   Desde la raíz del directorio `backend/`, ejecuta en tu terminal:
   ```bash
   ./gradlew build -x test
   ```
   *En Windows:*
   ```cmd
   gradlew.bat build -x test
   ```

2. **Ejecutar la aplicación**:
   Para iniciar el menú de consola, ejecuta:
   ```bash
   ./gradlew run --console=plain
   ```
   *En Windows:*
   ```cmd
   gradlew.bat run --console=plain
   ```

## Detalles del Desarrollo

- **Modelo de Dominio**: Implementado usando herencia (`Base` y entidades concretas).
- **Relaciones**:
  - `Categoria` -> `Producto` (Unidireccional @ManyToOne desde Producto)
  - `Usuario` -> `Pedido` (Unidireccional @OneToMany desde Usuario)
  - `Pedido` <-> `DetallePedido` (Bidireccional @OneToMany en Pedido con mappedBy, @ManyToOne en DetallePedido)
- **Base de datos**: Se genera automáticamente (H2) en `./data/jpa_db.mv.db`.
- **Transacciones**: El alta de un pedido y la reducción de inventario (stock) se realizan de manera atómica (con `rollback` si ocurre un error).
