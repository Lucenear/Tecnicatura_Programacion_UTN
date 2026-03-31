-- Inserto carreras
INSERT INTO carreras (id, nombre_carrera, duracion, departamento)
VALUES 
(1, 'CIENCIA DE DATOS', 5, 'SISTEMAS'),
(2, 'ANALISIS DE DATOS', 3, 'SISTEMAS'),
(3, 'DISEÑO WEB', 3, 'ARTES Y DISEÑO');

-- Inserto alumnos
INSERT INTO alumnos SET id = 101, nombre = 'Juan', apellido = 'Soto', edad = 25, id_carrera = 1;
INSERT INTO alumnos SET id = 102, nombre = 'Gabriela', apellido = 'Ruiz', edad = 35, id_carrera = 2;
INSERT INTO alumnos SET id = 103, nombre = 'Diego', apellido = 'Lopez', edad = 29, id_carrera = 3;
INSERT INTO alumnos SET id = 104, nombre = 'Mariela', apellido = 'Puertas', edad = 19, id_carrera = 1;

-- Inserto algunas asignaturas para poder usar en los ejemplos
INSERT INTO asignaturas (id, nombre, creditos, id_carrera)
VALUES 
(1, 'PROGRAMACION I', 8, 1),
(2, 'ESTADISTICA', 6, 2),
(3, 'BASE DE DATOS I', 8, 1),
(4, 'DISEÑO GRAFICO', 10, 3),
(5, 'MATEMATICAS', 8, 1);