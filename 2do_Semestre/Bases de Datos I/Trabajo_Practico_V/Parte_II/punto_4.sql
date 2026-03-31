SELECT a.nombre, a.apellido, c.departamento
FROM alumnos a
LEFT JOIN carreras c ON a.id_carrera = c.id;