SELECT c.nombre_carrera, a.nombre
FROM alumnos a
RIGHT JOIN carreras c ON a.id_carrera = c.id;