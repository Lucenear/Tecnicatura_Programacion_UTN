SELECT a.nombre, a.apellido, c.nombre_carrera, asig.nombre AS asignatura, m.calificacion
FROM alumnos a
INNER JOIN carreras c ON a.id_carrera = c.id
INNER JOIN matriculas m ON a.id = m.id_alumno
INNER JOIN asignaturas asig ON m.id_asignatura = asig.id
WHERE a.id_carrera = asig.id_carrera;