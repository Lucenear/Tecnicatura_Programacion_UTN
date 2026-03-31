DELIMITER //
CREATE PROCEDURE InsertarUsuario
(
IN P_eliminado	boolean, 
IN P_nroLegajo	varchar(20), 
IN P_categoria varchar(30), 
IN P_estado	 ENUM('ACTIVO', 'INACTIVO') , 
IN P_fechaAlta	date, 
IN P_observaciones	varchar(255)
)
BEGIN
    INSERT INTO legajo
(
eliminado, 
nroLegajo, 
categoria, 
estado, 
fechaAlta, 
observaciones
)
VALUES
(
P_eliminado, 
P_nroLegajo, 
P_categoria, 
P_estado, 
P_fechaAlta, 
P_observaciones
);
END //
DELIMITER ;