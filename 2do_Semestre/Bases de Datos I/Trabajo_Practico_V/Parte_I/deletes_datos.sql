-- Borro al alumno con id 103 (Diego)
DELETE FROM alumnos 
WHERE id = 103;

-- Borro asignaturas de la carrera 1 que tengan 8 creditos
DELETE FROM asignaturas 
WHERE id_carrera = 1 AND creditos = 8;
