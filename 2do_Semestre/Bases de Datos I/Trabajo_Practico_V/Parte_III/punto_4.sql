CREATE VIEW vista_asignaturas_credito_alto AS
SELECT nombre, creditos
FROM asignaturas
WHERE creditos > 5;