DELIMITER $$

DROP PROCEDURE IF EXISTS actualizar_legajo_retry;

CREATE PROCEDURE actualizar_legajo_retry(
    IN p_nro_legajo VARCHAR(20),
    IN p_nueva_categoria VARCHAR(30)
)
BEGIN
    DECLARE intento INT DEFAULT 0;
    DECLARE max_intentos INT DEFAULT 2;
    DECLARE terminado BOOLEAN DEFAULT FALSE;

    WHILE intento <= max_intentos AND NOT terminado DO
        START TRANSACTION;
        
        -- Intento realizar el update
        UPDATE Legajo 
        SET categoria = p_nueva_categoria 
        WHERE nroLegajo = p_nro_legajo AND eliminado = FALSE;
        
        -- Si no hay error confirmo y salgo del while
        COMMIT;
        SET terminado = TRUE;
        
        -- Si hay error 1213 de deadlock capturo con un handler
        BEGIN
            DECLARE EXIT HANDLER FOR 1213
            BEGIN
                ROLLBACK;
                SET intento = intento + 1;
                -- Esperamos tres segundo antes de reintentar
                DO SLEEP(3);
            END;
            
            -- Volvemos a ejecutar la misma operacion dentro del handler
            START TRANSACTION;
            UPDATE Legajo 
            SET categoria = p_nueva_categoria 
            WHERE nroLegajo = p_nro_legajo AND eliminado = FALSE;
            COMMIT;
            SET terminado = TRUE;
        END;
        
    END WHILE;
    
    IF NOT terminado THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'No se pudo completar tras 2 reintentos por deadlock';
    END IF;
END$$

DELIMITER ;