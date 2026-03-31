USE TPFI_DDBB;

-- Creamos tabla Legajo con restricciones
CREATE TABLE IF NOT EXISTS Legajo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    eliminado BOOLEAN NOT NULL DEFAULT FALSE, -- Baja lógica
    nroLegajo VARCHAR(20) NOT NULL UNIQUE, -- máx. 20
    categoria VARCHAR(30), -- máx. 30
    estado ENUM('ACTIVO', 'INACTIVO') NOT NULL, -- {ACTIVO, INACTIVO}
    fechaAlta DATE, -- java.time.LocalDate
    observaciones VARCHAR(255) -- máx. 255
);

-- Creamos tabla Empleado con restricciones y constraint
CREATE TABLE IF NOT EXISTS Empleado (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    eliminado BOOLEAN NOT NULL DEFAULT FALSE, -- Baja lógica
    nombre VARCHAR(80) NOT NULL, -- máx. 80
    apellido VARCHAR(80) NOT NULL, -- máx. 80
    dni VARCHAR(15) NOT NULL UNIQUE CHECK (length(dni) >= 8 and length(dni) < 16), -- máx. 15
    email VARCHAR(120), -- máx. 120
    fechaIngreso DATE,
    area VARCHAR(50), -- máx. 50
    legajo BIGINT UNIQUE,
    CONSTRAINT fk_empleado_legajo
        FOREIGN KEY (legajo) REFERENCES Legajo(id)
		ON UPDATE CASCADE
);