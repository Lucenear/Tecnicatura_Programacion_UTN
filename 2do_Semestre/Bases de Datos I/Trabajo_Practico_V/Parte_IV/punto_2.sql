SELECT id, nombre_carrera
FROM carreras
WHERE id NOT IN (SELECT DISTINCT id_carrera FROM asignaturas);