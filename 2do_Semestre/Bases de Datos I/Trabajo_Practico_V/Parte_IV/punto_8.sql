SELECT DISTINCT asig.nombre
FROM asignaturas asig
INNER JOIN matriculas m ON asig.id = m.id_asignatura
INNER JOIN alumnos a ON m.id_alumno = a.id
WHERE a.edad = (SELECT MIN(edad) FROM alumnos);