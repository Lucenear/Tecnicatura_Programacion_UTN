SELECT 
    e.area,
    COUNT(*) AS total_empleados
FROM Empleado e
JOIN Legajo l ON e.legajo = l.id
WHERE e.eliminado = FALSE
  AND l.eliminado = FALSE
  AND l.estado = 'ACTIVO'
  AND e.area IN (
      SELECT DISTINCT e2.area
      FROM Empleado e2
      JOIN Legajo l2 ON e2.legajo = l2.id
      WHERE l2.categoria = 'A'
        AND e2.eliminado = FALSE
        AND l2.eliminado = FALSE
        AND l2.estado = 'ACTIVO'
  )
GROUP BY e.area
ORDER BY total_empleados DESC;