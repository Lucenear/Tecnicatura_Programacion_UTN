# Backend FastAPI Productos y Categorias

Proyecto backend desarrollado con FastAPI, SQLModel y PostgreSQL para la gestion de productos y categorias.

## Requisitos previos

- Python 3.10 o superior
- PostgreSQL en ejecucion
- Base de datos creada

## Configuracion

1. Crear y activar el entorno virtual:

python -m venv .venv
source .venv/bin/activate

2. Instalar dependencias:

pip install -r requirements.txt

3. Configurar la conexion en el archivo .env:

DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/productos_db

## Ejecucion

Ejecutar el servidor con:

python -m fastapi dev app/main.py

La documentacion interactiva se encuentra disponible en:
http://localhost:8000/docs

## Pruebas de endpoints

Se incluye el archivo productos.http para probar todos los endpoints usando la extension REST Client.
