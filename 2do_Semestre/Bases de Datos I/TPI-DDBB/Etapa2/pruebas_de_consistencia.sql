USE TPFI_DDBB;
-- LLAMAMOS LA FUNCION GENERAR DATOS
CALL generamos_datos();

-- 															PRUEBA DE CONSISTENCIA														--	


-- VERIFICAR LOS DATOS, ACA VAMOS A CONTAR CUANTAS CATEGORIAS HAY DE CADA TIPO DENTRO DE LEGAJO, SE SEPARARAN POR LETRAS (A,B,C,D...)
SELECT categoria , COUNT(*) FROM legajo GROUP BY categoria; 

-- VERIFICAR SI HAY CLAVES FORANEAS HUERFANAS
SELECT empleado.*
FROM empleado
LEFT JOIN legajo  ON empleado.legajo=legajo.id 
WHERE legajo.id IS NULL; -- filtra los que no tienen valores en ID from legajo.

-- VERIFICAR CUANTOS ELIMINADOS HAY EN LA COLUMNA ELIMINADO de la tabla empleado
SELECT eliminado ,COUNT(*) FROM empleado GROUP BY eliminado;