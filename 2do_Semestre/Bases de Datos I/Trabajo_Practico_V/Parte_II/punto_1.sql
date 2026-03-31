SELECT CONCAT(a.nombre, ' ', a.apellido) AS nombre_completo, c.duracion
FROM alumnos a
INNER JOIN carreras c ON a.id_carrera = c.id;