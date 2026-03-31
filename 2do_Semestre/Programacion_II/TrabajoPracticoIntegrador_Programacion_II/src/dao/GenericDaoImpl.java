package dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public abstract class GenericDaoImpl<T> implements GenericDao<T> {

    @Override
    public List<T> leerTodos(Connection connection) throws Exception {
        List<T> entidades = new ArrayList<>();
        String sql = getSelectSql();

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                entidades.add(mapearResultSet(rs));
            }
        }
        return entidades;
    }

    @Override
    public Optional<T> leer(Long id, Connection connection) throws Exception {
        // uso el select base y agrego el filtro de id
        String sql = getSelectSql() + " AND id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return Optional.of(mapearResultSet(rs));
            }
            return Optional.empty();
        }
    }

    // defino metodos que cada DAO concreto debe implementar
    protected abstract String getInsertSql();
    protected abstract String getUpdateSql();
    protected abstract String getSelectSql();
    protected abstract String getDeleteSql();

    protected abstract void setParametersInsert(PreparedStatement ps, T entidad) throws SQLException;
    protected abstract void setParametersUpdate(PreparedStatement ps, T entidad) throws SQLException;

    protected abstract T mapearResultSet(ResultSet rs) throws SQLException;

    protected abstract String getTableName();

    // uso este metodo si hago delete logico
    protected String getSoftDeleteSql() {
        return "UPDATE " + getTableName() + " SET eliminado = TRUE WHERE id = ?";
    }
}
