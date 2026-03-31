CREATE OR REPLACE VIEW vista_alumnos_mayores AS
SELECT a.nombre, a.apellido, a.edad, c.nombre_carrera
FROM alumnos a
INNER JOIN carreras c ON a.id_carrera = c.id
WHERE a.edad > 21;