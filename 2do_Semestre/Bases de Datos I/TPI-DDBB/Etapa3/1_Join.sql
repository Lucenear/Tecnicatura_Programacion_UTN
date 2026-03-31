USE TPFI_DDBB;

SELECT 
    e.nombre, 
    e.apellido, 
    e.dni, 
    e.area,
    l.nroLegajo, 
    l.categoria, 
    l.estado
FROM Empleado e
JOIN Legajo l ON e.legajo = l.id
WHERE e.eliminado = FALSE 
  AND l.eliminado = FALSE
  AND l.estado = 'ACTIVO';