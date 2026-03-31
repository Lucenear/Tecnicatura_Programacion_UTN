package service;

import dao.GenericDao;
import config.DatabaseConnection;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public abstract class GenericService<T> {

    protected final GenericDao<T> dao;
    protected final DatabaseConnection dbConnection;

    public GenericService(GenericDao<T> dao, DatabaseConnection dbConnection) {
        this.dao = dao;
        this.dbConnection = dbConnection;
    }

    protected <R> R withTransaction(TransactionOperation<R> operation) {
        Connection conn = null;
        boolean autoCommit = true;
        try {
            conn = dbConnection.getConnection();
            autoCommit = conn.getAutoCommit();
            conn.setAutoCommit(false);
            R result = operation.execute();
            conn.commit();
            return result;
        } catch (Exception e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) {}
            }
            throw new RuntimeException("Error en transaccion: " + e.getMessage(), e);
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(autoCommit);
                    conn.close();
                } catch (SQLException e) {
                    System.err.println("Error al cerrar conexion: " + e.getMessage());
                }
            }
        }
    }

    public T insert(T entity) {
        return withTransaction(() -> {
            dao.crear(entity, dbConnection.getConnection());
            return entity;
        });
    }

    public T update(T entity) {
        return withTransaction(() -> {
            dao.actualizar(entity, dbConnection.getConnection());
            return entity;
        });
    }

    public void delete(Long id) {
        withTransaction(() -> {
            dao.eliminar(id, dbConnection.getConnection());
            return null;
        });
    }

    public T getById(Long id) {
        return withTransaction(() -> {
            var optional = dao.leer(id, dbConnection.getConnection());
            return optional.orElse(null);
        });
    }

    public List<T> getAll() {
        return withTransaction(() -> dao.leerTodos(dbConnection.getConnection()));
    }

    @FunctionalInterface
    protected interface TransactionOperation<R> {
        R execute() throws Exception;
    }
}