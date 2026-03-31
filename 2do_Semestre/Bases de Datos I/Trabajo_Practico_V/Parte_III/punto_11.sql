CREATE OR REPLACE VIEW vista_asignaturas_credito_alto AS
SELECT asig.nombre, asig.creditos, c.nombre_carrera
FROM asignaturas asig
INNER JOIN carreras c ON asig.id_carrera = c.id
WHERE asig.creditos > 5;