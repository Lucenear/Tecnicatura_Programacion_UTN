-- Primero creo la base de datos
CREATE DATABASE IF NOT EXISTS gestionacademica;

-- Uso esa base de datos
USE gestionacademica;

-- Creo la tabla carreras
CREATE TABLE carreras (
    id INT PRIMARY KEY,
    nombre_carrera VARCHAR(60) NOT NULL,
    duracion TINYINT NOT NULL,
    departamento VARCHAR(60) NOT NULL
);

-- Creo la tabla alumnos con relacion a carreras
CREATE TABLE alumnos (
    id INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    edad TINYINT NOT NULL,
    id_carrera INT NOT NULL,
    FOREIGN KEY (id_carrera) REFERENCES carreras(id)
);

-- Creo la tabla asignaturas con relacion a carreras
CREATE TABLE asignaturas (
    id INT PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL,
    creditos INT NOT NULL,
    id_carrera INT NOT NULL,
    FOREIGN KEY (id_carrera) REFERENCES carreras(id)
);