-- Cambio el nombre de Juan a Juan Jose
UPDATE alumnos 
SET nombre = 'Juan Jose' 
WHERE id = 101;

-- Cambio el nombre y creditos de la asignatura con id 3
UPDATE asignaturas 
SET nombre = 'BASE DE DATOS I', creditos = 12 
WHERE id = 3;