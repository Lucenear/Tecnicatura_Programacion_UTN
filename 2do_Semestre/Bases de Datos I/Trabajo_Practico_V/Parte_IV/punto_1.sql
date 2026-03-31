SELECT nombre, apellido
FROM alumnos
WHERE edad < (SELECT AVG(edad) FROM alumnos);