-- Alumnos que no se llaman Diego
SELECT * FROM alumnos WHERE nombre <> 'Diego';

-- Carreras que no duran 5 años
SELECT * FROM carreras WHERE duracion <> 5;

-- Carreras que duran 5 años
SELECT * FROM carreras WHERE duracion = 5;

-- Asignaturas con 12 creditos
SELECT * FROM asignaturas WHERE creditos = 12;

-- Alumnos mayores de 25 años
SELECT * FROM alumnos WHERE edad > 25;

-- Alumnos con edad mayor o igual a 25
SELECT * FROM alumnos WHERE edad >= 25;

-- Asignaturas con menos de 8 creditos
SELECT * FROM asignaturas WHERE creditos < 8;

-- Asignaturas con 8 creditos o menos
SELECT * FROM asignaturas WHERE creditos <= 8;

-- Asignaturas con creditos distintos de 8
SELECT * FROM asignaturas WHERE creditos != 8;

-- Alumnos de la carrera con id 3
SELECT * FROM alumnos WHERE id_carrera = 3;

-- Asignaturas con mas de 5 creditos
SELECT * FROM asignaturas WHERE creditos > 5;

-- Alumnos menores de 21 años
SELECT * FROM alumnos WHERE edad < 21;

-- Carreras del departamento SISTEMAS
SELECT * FROM carreras WHERE departamento = 'SISTEMAS';

-- Asignaturas de la carrera 1 con al menos 8 creditos
SELECT * FROM asignaturas WHERE id_carrera = 1 AND creditos >= 8;

-- Alumnos con apellido Lopez
SELECT * FROM alumnos WHERE apellido = 'Lopez';

-- Carreras de 5 años o del departamento ARTES Y DISEÑO
SELECT * FROM carreras WHERE duracion = 5 OR departamento = 'ARTES Y DISEÑO';