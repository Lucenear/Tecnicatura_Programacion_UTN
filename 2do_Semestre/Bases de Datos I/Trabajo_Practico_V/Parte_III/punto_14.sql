CREATE OR REPLACE VIEW vista_creditos_por_alumno AS
SELECT 
    a.id,
    a.nombre,
    a.apellido,
    c.nombre_carrera,
    (SELECT SUM(asig.creditos) FROM asignaturas asig WHERE asig.id_carrera = a.id_carrera) AS total_creditos
FROM alumnos a
INNER JOIN carreras c ON a.id_carrera = c.id;