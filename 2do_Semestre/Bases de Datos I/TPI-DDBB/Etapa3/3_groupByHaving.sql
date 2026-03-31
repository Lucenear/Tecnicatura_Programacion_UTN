SELECT 
    e.area,
    l.categoria,
    COUNT(*) AS total_empleados
FROM Empleado e
JOIN Legajo l ON e.legajo = l.id
WHERE e.eliminado = FALSE 
  AND l.eliminado = FALSE
  AND l.estado = 'ACTIVO'
GROUP BY e.area, l.categoria
HAVING COUNT(*) > 500
ORDER BY total_empleados DESC;