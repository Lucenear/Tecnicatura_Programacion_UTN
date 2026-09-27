# Diseño de Base de Datos - FixYa

El esquema relacional garantiza la integridad referencial y permite la consulta de los especialistas aprobados por categoria.

```mermaid
erDiagram
    USUARIO {
        uuid id PK
        string email
        string nombre
        string avatar_url
        boolean es_admin
        timestamp created_at
    }

    CATEGORIA {
        integer id PK
        string nombre
        string descripcion
    }

    ESPECIALISTA {
        uuid id PK "Referencia a USUARIO.id"
        integer id_categoria FK
        string zona
        text descripcion
        string telefono
        string estado "Pendiente, Aprobado, Rechazado"
        string dni_url
        string certificado_url
        text motivo_rechazo
        timestamp created_at
    }

    USUARIO ||--o| ESPECIALISTA : "puede ser"
    CATEGORIA ||--o{ ESPECIALISTA : "agrupa"
```

## Reglas de Negocio (RLS - Row Level Security):
*   **Privacidad:** Un USUARIO solo puede modificar su propio registro de ESPECIALISTA.
*   **Visibilidad:** El publico general solo puede leer registros de ESPECIALISTA cuyo estado sea Aprobado.
*   **Administracion:** Solo los usuarios con es_admin = true pueden hacer operaciones de UPDATE sobre el campo estado o motivo_rechazo.
