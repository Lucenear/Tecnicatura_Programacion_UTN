package dao;

import entities.Legajo;

import java.sql.Statement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Date;

public class LegajoDao extends GenericDaoImpl<Legajo> {

    @Override
    protected String getInsertSql() {
        return "INSERT INTO Legajo (eliminado, nroLegajo, categoria, estado, fechaAlta, observaciones) VALUES (?, ?, ?, ?, ?, ?)";
    }

    @Override
    protected String getUpdateSql() {
        return "UPDATE Legajo SET nroLegajo = ?, categoria = ?, estado = ?, fechaAlta = ?, observaciones = ? WHERE id = ? AND eliminado = FALSE";
    }

    @Override
    protected String getSelectSql() {
        // siempre traigo solo los que no estan eliminados
        return "SELECT id, eliminado, nroLegajo, categoria, estado, fechaAlta, observaciones FROM Legajo WHERE eliminado = FALSE";
    }

    @Override
    protected String getDeleteSql() {
        return getSoftDeleteSql();
    }

    @Override
    protected String getTableName() {
        return "Legajo";
    }

    @Override
    protected void setParametersInsert(PreparedStatement ps, Legajo legajo) throws SQLException {
        ps.setBoolean(1, legajo.getEliminado());
        ps.setString(2, legajo.getNroLegajo());
        ps.setString(3, legajo.getCategoria());
        ps.setString(4, legajo.getEstado().name());
        ps.setDate(5, Date.valueOf(legajo.getFechaAlta()));
        ps.setString(6, legajo.getObservaciones());
    }

    @Override
    protected void setParametersUpdate(PreparedStatement ps, Legajo legajo) throws SQLException {
        ps.setString(1, legajo.getNroLegajo());
        ps.setString(2, legajo.getCategoria());
        ps.setString(3, legajo.getEstado().name());
        ps.setDate(4, Date.valueOf(legajo.getFechaAlta()));
        ps.setString(5, legajo.getObservaciones());
        ps.setLong(6, legajo.getId());
    }

    @Override
    protected Legajo mapearResultSet(ResultSet rs) throws SQLException {
        Legajo legajo = new Legajo();
        legajo.setId(rs.getLong("id"));
        legajo.setEliminado(rs.getBoolean("eliminado"));
        legajo.setNroLegajo(rs.getString("nroLegajo"));
        legajo.setCategoria(rs.getString("categoria"));
        legajo.setEstado(Legajo.Estado.valueOf(rs.getString("estado")));
        legajo.setFechaAlta(rs.getDate("fechaAlta").toLocalDate());
        legajo.setObservaciones(rs.getString("observaciones"));
        return legajo;
    }

    @Override
    public Long crear(Legajo legajo, Connection connection) throws Exception {
        String sql = getInsertSql();
        try (PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            setParametersInsert(ps, legajo);
            ps.executeUpdate();

            try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    legajo.setId(generatedKeys.getLong(1));
                    return legajo.getId();
                } else {
                    throw new SQLException("No pude obtener el ID generado para Legajo");
                }
            }
        }
    }

    @Override
    public void actualizar(Legajo legajo, Connection connection) throws Exception {
        try (PreparedStatement ps = connection.prepareStatement(getUpdateSql())) {
            setParametersUpdate(ps, legajo);
            int filas = ps.executeUpdate();
            if (filas == 0) {
                throw new SQLException("No encontre Legajo con ID: " + legajo.getId());
            }
        }
    }

    @Override
    public void eliminar(Long id, Connection connection) throws Exception {
        try (PreparedStatement ps = connection.prepareStatement(getDeleteSql())) {
            ps.setLong(1, id);
            int filas = ps.executeUpdate();
            if (filas == 0) {
                throw new SQLException("No encontre Legajo con ID: " + id);
            }
        }
    }
}
