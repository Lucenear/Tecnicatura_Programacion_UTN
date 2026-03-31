-- Insertatamos un legajo con categoria invalida(ENUM de A - F)
INSERT INTO Legajo (eliminado, nroLegajo, categoria, estado, fechaAlta)
VALUES (FALSE, 'LEGAJO-00000001', 'Z', 'ACTIVO', '2025-01-01');