# Food Store Backend

Backend desarrollado con FastAPI y SQLModel con modulo de seguridad completo, autenticacion con JWT en cookie HttpOnly y autorizacion RBAC.

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

Copiar las variables de entorno:

```bash
cp .env.example .env
```

## Cargar datos de prueba

```bash
python seed.py
```

## Credenciales de prueba

El script seed.py carga dos usuarios predefinidos:

- Administrador: admin@foodstore.com / contraseña: admin1234
- Usuario estandar: user@foodstore.com / contraseña: user1234

## Ejecucion

```bash
uvicorn app.main:app --reload
```

Documentacion interactiva:
http://localhost:8000/docs
