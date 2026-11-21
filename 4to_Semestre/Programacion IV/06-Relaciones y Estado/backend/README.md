# Backend FastAPI - Categorias y Productos

Proyecto desarrollado con FastAPI y SQLModel para la gestion de categorias y productos con base de datos SQLite.

## Requisitos

- Python 3.10 o superior

## Instalacion

1. Crear entorno virtual:
python -m venv .venv

2. Activar entorno virtual:
En Linux/macOS:
source .venv/bin/activate
En Windows:
.venv\Scripts\activate

3. Instalar dependencias:
pip install -r requirements.txt

## Ejecucion

Ejecutar el servidor de desarrollo:
python -m fastapi dev app/main.py

El servidor estara disponible en http://localhost:8000
Documentacion interactiva Swagger en http://localhost:8000/docs

## Pruebas de endpoints

Se incluye el archivo productos.http para probar los endpoints de productos y la relacion con categorias utilizando la extension REST Client.
