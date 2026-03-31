SELECT 
    a.nombre, 
    a.apellido, 
    a.edad, 
    c.nombre_carrera, 
    vac.nombre AS asignatura
FROM alumnos a
INNER JOIN carreras c ON a.id_carrera = c.id
INNER JOIN vista_asignaturas_creditos vac ON a.id_carrera = vac.id_carrera;