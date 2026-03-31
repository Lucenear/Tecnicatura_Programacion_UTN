CREATE VIEW vista_alumnos_mayores AS
SELECT nombre, apellido, edad, id_carrera
FROM alumnos
WHERE edad > 21;