-- 1) Preparo el dato
UPDATE Legajo
SET categoria = 'INICIAL'
WHERE nroLegajo = 'LEGAJO-00000001';

-- 2) Inicio con el read committed - Elegir solo uno y comentar el otro!!!
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;-- veo cambios despues del inicio de transaccion 
-- SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;-- no veo cambios durante la transaccion 
START TRANSACTION;
SELECT categoria
FROM Legajo
WHERE nroLegajo = 'LEGAJO-00000001';

-- 3) Cambio el valor desde otra sesion 

USE TPFI_DDBB;

UPDATE Legajo
SET categoria = 'CAMBIADO'
WHERE nroLegajo = 'LEGAJO-00000001';

-- 4) Leo de nuevo el dato sin salir de la transaccion
SELECT categoria
FROM Legajo
WHERE nroLegajo = 'LEGAJO-00000001';
COMMIT;