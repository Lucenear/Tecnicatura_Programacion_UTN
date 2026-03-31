CREATE OR REPLACE VIEW vista_asignaturas_carrera AS
SELECT asig.nombre AS asignatura, asig.creditos, c.nombre_carrera
FROM asignaturas asig
INNER JOIN carreras c ON asig.id_carrera = c.id
WHERE asig.creditos > 3;