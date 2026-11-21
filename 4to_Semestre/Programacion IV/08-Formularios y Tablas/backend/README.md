# Food Store Backend

Backend desarrollado con FastAPI y SQLModel para la gestion de categorias, productos, ingredientes y pedidos.

## Requisitos

- Python 3.10 o superior

## Instalacion

Crear y activar el entorno virtual:

```bash
python -m venv .venv
source .venv/bin/activate
```

Instalar dependencias:

```bash
pip install -r requirements.txt
```

## Cargar datos de prueba

```bash
python seed.py
```

## Ejecucion

```bash
python -m fastapi dev app/main.py
```

La documentacion interactiva se encuentra en:
http://localhost:8000/docs

## Pruebas con REST Client

Los archivos pedidos.http, categorias.http, productos.http e ingredientes.http contienen los casos de prueba para cada endpoint.
