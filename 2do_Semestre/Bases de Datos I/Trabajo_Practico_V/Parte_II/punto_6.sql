SELECT c.nombre_carrera, c.departamento, a.apellido
FROM alumnos a
RIGHT JOIN carreras c ON a.id_carrera = c.id;