-- Creo base de datos
CREATE DATABASE IF NOT EXISTS tienda_calzados;
USE tienda_calzados;

-- Tabla vendedor
CREATE TABLE vendedor (
    id_vendedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL
);

-- Tabla cliente
CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    dni VARCHAR(15) NOT NULL UNIQUE
);

-- Tabla producto
CREATE TABLE producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL CHECK (precio > 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    talle VARCHAR(10) NOT NULL
);

-- Tabla venta
CREATE TABLE venta (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_vendedor INT NOT NULL,
    id_cliente INT NOT NULL,
    FOREIGN KEY (id_vendedor) REFERENCES vendedor(id_vendedor) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla detalle_venta
CREATE TABLE detalle_venta (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE RESTRICT ON UPDATE CASCADE
);
