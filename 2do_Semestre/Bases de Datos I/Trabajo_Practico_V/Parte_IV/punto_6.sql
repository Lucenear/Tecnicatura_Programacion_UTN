SELECT DISTINCT a.nombre, a.apellido
FROM alumnos a
INNER JOIN asignaturas asig ON a.id_carrera = asig.id_carrera
WHERE asig.creditos > 10;