-- Intento malicioso: inyectar código SQL a través del parámetro P_observaciones
CALL InsertarUsuario(
    false,
    'legajo-500004',
    'C',
    'ACTIVO',
    '2025-10-21',
    'Intento de inyección; DROP TABLE legajo; --'
);
