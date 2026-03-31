SELECT c.nombre_carrera, v.nombre AS asignatura, v.creditos
FROM vista_asignaturas_credito_alto v
INNER JOIN asignaturas a ON v.nombre = a.nombre AND v.creditos = a.creditos
INNER JOIN carreras c ON a.id_carrera = c.id;