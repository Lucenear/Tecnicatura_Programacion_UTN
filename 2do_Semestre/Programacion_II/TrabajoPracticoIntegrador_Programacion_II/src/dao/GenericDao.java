package dao;

import java.sql.Connection;
import java.util.List;
import java.util.Optional;

public interface GenericDao<T> {

    Long crear(T entidad, Connection connection) throws Exception;

    Optional<T> leer(Long id, Connection connection) throws Exception;

    List<T> leerTodos(Connection connection) throws Exception;

    void actualizar(T entidad, Connection connection) throws Exception;

    void eliminar(Long id, Connection connection) throws Exception;
}
