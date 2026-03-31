-- CREAMOS INDICE EMPLEADO
CREATE INDEX idx_empleado_dni ON Empleado(dni);

-- CREAMOS INDICE LEGAJO
CREATE INDEX idx_legajo_id	ON legajo(id);

-- CREAMOS INDICE EMPLEADO LEGAJO
CREATE INDEX idx_empleado_legajo ON Empleado(legajo);

