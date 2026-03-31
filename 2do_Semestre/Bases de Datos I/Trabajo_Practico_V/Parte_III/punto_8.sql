CREATE VIEW vista_asignaturas_creditos AS
SELECT id, nombre, creditos, id_carrera
FROM asignaturas
WHERE creditos > 3;