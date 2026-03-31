USE TPFI_DDBB;

-- Abro sesion 1
START TRANSACTION;
UPDATE Legajo
SET categoria = 'X'
WHERE nroLegajo = 'LEGAJO-00000001';

-- Update con sesion 2

UPDATE Legajo
SET categoria = 'Z'
WHERE nroLegajo = 'LEGAJO-00000002';

