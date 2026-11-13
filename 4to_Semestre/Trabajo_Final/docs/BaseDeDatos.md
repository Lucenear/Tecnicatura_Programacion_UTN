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
        uuid id PK
        uuid id_usuario FK
        integer id_categoria FK
        string zona
        text descripcion
        string telefono
        string estado "Pendiente, Aprobado, Rechazado"
        string dni_url
        string certificado_url
        text motivo_rechazo
        decimal promedio_estrellas
        integer total_resenas
        timestamp created_at
    }

    CONTACTO {
        uuid id PK
        uuid id_usuario FK
        uuid id_especialista FK
        timestamp created_at
    }

    RESENA {
        uuid id PK
        uuid id_usuario FK
        uuid id_especialista FK
        integer estrellas
        text comentario
        timestamp created_at
        timestamp updated_at
    }

    USUARIO ||--o| ESPECIALISTA : "puede ser"
    CATEGORIA ||--o{ ESPECIALISTA : "agrupa"
    USUARIO ||--o{ CONTACTO : "realiza"
    ESPECIALISTA ||--o{ CONTACTO : "recibe"
    USUARIO ||--o{ RESENA : "escribe"
    ESPECIALISTA ||--o{ RESENA : "recibe"
```

## Reglas de Negocio (RLS - Row Level Security):
*   **Usuarios y rol Admin:** Cada USUARIO autenticado solo puede leer y editar sus propios datos basicos (`nombre`, `avatar_url`). La columna `es_admin` queda protegida tanto por permisos de columna (`GRANT UPDATE (nombre, avatar_url)`) como por clausula `WITH CHECK` para impedir auto-asignacion de privilegios de administrador.
*   **Especialistas y documentos:** Toda lectura publica, postulacion y aprobacion de ESPECIALISTA pasa por el backend BFF (`service_role`), evitando acceso anonimo directo o auto-aprobacion desde el cliente. El bucket `especialistas_docs` es privado y solo emite URLs firmadas temporales para administradores.
*   **Contactos:** Solo el backend BFF inserta registros en CONTACTO luego de validar que el especialista este aprobado, mientras que cada USUARIO autenticado unicamente puede consultar sus propios contactos.
*   **Reseñas:** Cada USUARIO autenticado puede registrar como maximo una reseña por ESPECIALISTA (`uq_resena_usuario_especialista`), siempre que exista un contacto previo y no sea su propio perfil. Las lecturas y escrituras se canalizan mediante el backend BFF (`REVOKE ALL` para `anon` y `authenticated`) y el trigger `on_resena_changed` recalcula automaticamente `promedio_estrellas` y `total_resenas`.
