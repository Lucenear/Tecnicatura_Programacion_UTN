CREATE TABLE matriculas (
    id_alumno INT NOT NULL,
    id_asignatura INT NOT NULL,
    calificacion DECIMAL(3,1),
    PRIMARY KEY (id_alumno, id_asignatura),
    FOREIGN KEY (id_alumno) REFERENCES alumnos(id),
    FOREIGN KEY (id_asignatura) REFERENCES asignaturas(id)
);