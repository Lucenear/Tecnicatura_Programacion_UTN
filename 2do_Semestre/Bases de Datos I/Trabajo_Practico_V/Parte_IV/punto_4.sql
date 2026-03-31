SELECT c.nombre_carrera, COUNT(a.id) AS cantidad_alumnos
FROM carreras c
LEFT JOIN alumnos a ON c.id = a.id_carrera
GROUP BY c.id, c.nombre_carrera;