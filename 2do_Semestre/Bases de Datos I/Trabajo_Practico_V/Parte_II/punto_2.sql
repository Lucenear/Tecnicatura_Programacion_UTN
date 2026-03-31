SELECT a.*
FROM alumnos a
INNER JOIN carreras c ON a.id_carrera = c.id
WHERE c.departamento = 'Exactas';