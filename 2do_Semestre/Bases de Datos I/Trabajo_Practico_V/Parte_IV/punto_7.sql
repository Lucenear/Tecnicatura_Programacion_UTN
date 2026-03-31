SELECT a.nombre, a.apellido
FROM alumnos a
INNER JOIN carreras c ON a.id_carrera = c.id
WHERE c.departamento != 'ARTES Y DISEÑO';