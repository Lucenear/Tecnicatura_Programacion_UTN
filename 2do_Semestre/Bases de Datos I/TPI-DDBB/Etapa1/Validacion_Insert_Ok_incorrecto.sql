USE TPFI_DDBB;

-- CREACION CORRECTOS LEGAJO
INSERT INTO legajo(eliminado,nroLegajo,categoria,estado,fechaAlta,observaciones) 
VALUES(FALSE,'LEGAJO-00000001','CATEGORIA-A','ACTIVO','2024-04-12','ES MUY RESPONSABLE');

INSERT INTO legajo(eliminado,nroLegajo,categoria,estado,fechaAlta,observaciones) 
VALUES(FALSE,'LEGAJO-00000002','CATEGORIA-B','ACTIVO','2023-05-10',' PUNTUALIDAD');

INSERT INTO legajo(eliminado,nroLegajo,categoria,estado,fechaAlta,observaciones) 
VALUES(FALSE,'LEGAJO-00000003','CATEGORIA-C','ACTIVO','2022-12-10',' SOLIDARIDAD');


-- CREACION DE DATOS INCORRECTOS LEGAJO

-- ESTE ERROR ESTARA DEBIDO A QUE LEGAJO NO PUEDE SER DUPLICADO (ES UNIQUE) 
INSERT INTO legajo(eliminado,nroLegajo,categoria,estado,fechaAlta,observaciones) 
VALUES(FALSE,'LEGAJO-00000002','CATEGORIA-B','ACTIVO','2023-05-10',' COMPAÑERISMO');


SELECT * FROM legajo;

-- CREACION CORRECTOS EMPLEADO
INSERT INTO empleado(eliminado,nombre,apellido,dni,email,fechaIngreso,area,legajo) 
VALUES(FALSE,'Pepe','Elizari','40464247','pepe@gmail.com','2025-06-14','DEV',1);

INSERT INTO empleado(eliminado,nombre,apellido,dni,email,fechaIngreso,area,legajo) 
VALUES(FALSE,'Horacio','Almega','23544765','horacio@gmail.com','2025-04-12','DEV',2);


-- CREACION INCORRECTOS EMPLEADO
-- ESTE ERROR ESTARA DADO POR PONER UN DATO NULL
INSERT INTO empleado(eliminado,nombre,apellido,dni,email,fechaIngreso,area,legajo) 
VALUES(FALSE,null,'Indigo','40431254','maria@gmail.com','2025-04-12','DEV',3);

-- ESTE ERROR ESTARA DADO POR DNI REPETIDO (ES UNIQUE)
INSERT INTO empleado(eliminado,nombre,apellido,dni,email,fechaIngreso,area,legajo) 
VALUES(FALSE,'Capore','Solomillo','23544765','capore@gmail.com','2025-04-12','DEV',3);

SELECT * FROM empleado ;