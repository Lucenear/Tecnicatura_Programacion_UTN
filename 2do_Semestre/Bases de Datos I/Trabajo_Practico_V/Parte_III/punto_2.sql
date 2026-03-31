CREATE VIEW vista_alumnos_carreras AS
SELECT a.id, a.nombre, a.apellido, a.id_carrera
FROM alumnos a;

SELECT v.nombre, v.apellido, c.nombre_carrera
FROM vista_alumnos_carreras v
INNER JOIN carreras c ON v.id_carrera = c.id;