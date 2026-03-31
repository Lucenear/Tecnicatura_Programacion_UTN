USE TPFI_DDBB;

-- Ocultamos nombre y apellido completos y solo se visualizan iniciales
CREATE VIEW v_legajos_resumen_rrhh AS
SELECT 
    l.nroLegajo,
    l.categoria,
    l.estado,
    l.fechaAlta,
    e.area,
    CONCAT(LEFT(e.nombre, 1), '. ', LEFT(e.apellido, 1), '.') AS iniciales
FROM Legajo l
JOIN Empleado e ON l.id = e.legajo
WHERE l.eliminado = FALSE 
  AND e.eliminado = FALSE;