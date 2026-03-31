USE TPFI_DDBB;

# Esta vista oculta datos sensibles de los empleados como DNI, EMAIL, Observaciones, etc.

CREATE VIEW v_empleados_publica AS
SELECT 
    e.nombre,
    e.apellido,
    e.area,
    l.nroLegajo,
    l.categoria,
    l.estado
FROM Empleado e
JOIN Legajo l ON e.legajo = l.id
WHERE e.eliminado = FALSE 
  AND l.eliminado = FALSE;