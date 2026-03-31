-- Insertamos un legajo duplicado y deberia fallar
INSERT INTO Legajo (eliminado, nroLegajo, categoria, estado, fechaAlta)
VALUES (FALSE, 'LEGAJO-00000001', 'A', 'ACTIVO', '2025-01-01');
