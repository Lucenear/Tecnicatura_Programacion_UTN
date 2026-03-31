USE TPFI_DDBB;

-- Eliminamos el procedimiento si ya existía
DROP PROCEDURE IF EXISTS generamos_datos;

DELIMITER $$

CREATE PROCEDURE generamos_datos()
BEGIN
    DECLARE i INT DEFAULT 1;  
    
    WHILE i <= 500000 DO 
        -- Insertamos registros en la tabla Legajo
        INSERT INTO Legajo (eliminado, nroLegajo, categoria, estado, fechaAlta, observaciones)
        VALUES (
            FALSE,
            CONCAT('LEGAJO-', LPAD(i, 8, '0')),
            ELT(1 + (RAND() * 6), 'A', 'B', 'C', 'D', 'E', 'F'),
            IF(RAND() > 0.1, 'ACTIVO', 'INACTIVO'),
            DATE_ADD('2022-01-01', INTERVAL FLOOR(RAND() * 1500) DAY),
            CONCAT('El empleado tiene ', i, ' observaciones')
        );

        -- Insertamos registros en la tabla Empleado
        INSERT INTO Empleado (eliminado, nombre, apellido, dni, email, fechaIngreso, area, legajo)
        VALUES (
            FALSE,
            CONCAT('Nombre', i),
            CONCAT('Apellido', i),
            LPAD(i, 8, '0'),
            CONCAT('email', i, '@empresa.com'),
            DATE_ADD('2022-01-01', INTERVAL FLOOR(RAND() * 3000) DAY),
            ELT(1 + (RAND() * 5), 'QA', 'DEV', 'TECH LEAD', 'RRHH', 'SCRUM MASTER'),
            i
        );

        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;
