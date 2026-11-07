# Backend - Food Store API

Este proyecto implementa la API REST para la gestion del catalogo de productos de Food Store utilizando FastAPI, SQLModel y PostgreSQL.

## Arquitectura por Capas

El backend sigue una arquitectura limpia organizada en:
- `models`: definicion de entidades de base de datos con SQLModel.
- `schemas`: validacion de datos de entrada y salida con Pydantic.
- `repositories`: operaciones de persistencia y consultas con la sesion de base de datos.
- `services`: reglas de negocio, validaciones de unicidad y control de errores.
- `routers`: endpoints HTTP y codigos de estado de respuesta.

## Requisitos Previos

- Python 3.10 o superior
- Servidor PostgreSQL en ejecucion (opcionalmente SQLite para pruebas locales)

## Instalacion de Dependencias

Para instalar las dependencias requeridas del backend:

```bash
pip install -r requirements.txt
```

## Configuracion de Base de Datos

La conexion se configura mediante la variable de entorno `DATABASE_URL`.

Ejemplo para PostgreSQL:

```bash
export DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/food_store"
```

En sistemas Windows (PowerShell):

```powershell
$env:DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/food_store"
```

Si no se define la variable `DATABASE_URL`, el sistema intentara conectarse a la URL por defecto en localhost. Tambien es posible utilizar SQLite para pruebas rapidas:

```bash
export DATABASE_URL="sqlite:///./food_store.db"
```

## Ejecucion del Servidor

Para iniciar el servidor de desarrollo:

```bash
uvicorn main:app --reload
```

El servidor quedara disponible en `http://127.0.0.1:8000`.

## Documentacion Interactiva

FastAPI genera documentacion automatica en:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Pruebas de Endpoints

Se incluyen archivos de prueba para verificar las operaciones CRUD y casos de validacion:
- `postman_collection.json`: coleccion para importar y ejecutar en Postman.
- `rest_client.http`: archivo para la extension REST Client de VS Code o IDEs compatibles.
