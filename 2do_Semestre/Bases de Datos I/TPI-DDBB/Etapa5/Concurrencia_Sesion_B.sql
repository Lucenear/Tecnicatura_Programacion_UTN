USE TPFI_DDBB;

-- Abro sesion 2
START TRANSACTION;
UPDATE Legajo
SET categoria = 'Y'
WHERE nroLegajo = 'LEGAJO-00000002';

--  Update con sesion 1

UPDATE Legajo
SET categoria = 'W'
WHERE nroLegajo = 'LEGAJO-00000001';
