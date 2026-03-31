SELECT 
    e.id,
    e.nombre,
    e.apellido,
    e.dni
FROM Empleado e
LEFT JOIN Legajo l ON e.legajo = l.id
WHERE e.eliminado = FALSE 
  AND l.id IS NULL;