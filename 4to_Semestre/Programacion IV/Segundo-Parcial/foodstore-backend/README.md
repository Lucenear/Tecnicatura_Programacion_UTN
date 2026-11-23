# Food Store Backend

Backend para el sistema de catalogo de Food Store desarrollado con FastAPI y SQLModel sobre PostgreSQL.

## Requisitos

- Python 3.12 o superior
- PostgreSQL 15 o superior

## Configuracion de la base de datos

La cadena de conexion por defecto se define en `app/core/database.py`:

```
postgresql://postgres:postgres@localhost:5432/foodstore
```

Se puede configurar mediante la variable de entorno `DATABASE_URL`:

```bash
export DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_base_datos"
```

## Instalacion

Crear y activar un entorno virtual:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Instalar las dependencias del proyecto:

```bash
pip install -r requirements.txt
```

## Ejecucion

Iniciar el servidor de desarrollo:

```bash
fastapi dev app/main.py
```

La documentacion interactiva Swagger se encuentra disponible en:

```
http://localhost:8000/docs
```

## Pruebas HTTP

Las pruebas de los endpoints se encuentran en la carpeta `tests/`:

- `tests/productos.http`: Casos de prueba para el modulo de productos.
- `tests/relaciones.http`: Casos de prueba para categorias y relaciones entre productos y categorias.
