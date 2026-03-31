CREATE USER 'usuario_junior'@'localhost' IDENTIFIED BY '_ZakWEQRJKFdsf_·$$$$$1496';
GRANT SELECT, UPDATE ON TPFI_DDBB.Legajo TO 'usuario_junior'@'localhost';
GRANT SELECT, UPDATE ON TPFI_DDBB.Empleado TO 'usuario_junior'@'localhost';
FLUSH PRIVILEGES;