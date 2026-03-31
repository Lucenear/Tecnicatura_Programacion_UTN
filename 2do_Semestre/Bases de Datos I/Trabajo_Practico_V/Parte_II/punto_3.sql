SELECT a.nombre, a.apellido, c.nombre_carrera, c.duracion
FROM alumnos a
LEFT JOIN carreras c ON a.id_carrera = c.id;