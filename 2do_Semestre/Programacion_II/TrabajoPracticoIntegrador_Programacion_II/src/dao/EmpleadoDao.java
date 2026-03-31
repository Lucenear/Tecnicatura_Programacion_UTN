package dao;

import entities.Empleado;
import entities.Legajo;

import java.sql.Statement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Date;
import java.util.Optional;

public class EmpleadoDao extends GenericDaoImpl<Empleado> {

    @Override
    protected String getInsertSql() {
        return "INSERT INTO Empleado (eliminado, nombre, apellido, dni, email, fechaIngreso, area, legajo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    }

    @Override
    protected String getUpdateSql() {
        return "UPDATE Empleado SET nombre = ?, apellido = ?, dni = ?, email = ?, fechaIngreso = ?, area = ?, legajo = ? WHERE id = ? AND eliminado = FALSE";
    }

    @Override
    protected String getSelectSql() {
        return """
            SELECT e.id, e.eliminado, e.nombre, e.apellido, e.dni, e.email, 
                   e.fechaIngreso, e.area, e.legajo,
                   l.nroLegajo, l.categoria, l.estado, l.fechaAlta, l.observaciones
            FROM Empleado e
            INNER JOIN Legajo l ON e.legajo = l.id AND l.eliminado = FALSE
            """;
    }

    @Override
    protected String getDeleteSql() {
        return "UPDATE Empleado SET eliminado = TRUE WHERE id = ?";
    }

    @Override
    protected String getTableName() {
        return "Empleado";
    }

    @Override
    protected void setParametersInsert(PreparedStatement ps, Empleado empleado) throws SQLException {
        ps.setBoolean(1, empleado.getEliminado());
        ps.setString(2, empleado.getNombre());
        ps.setString(3, empleado.getApellido());
        ps.setString(4, empleado.getDni());
        ps.setString(5, empleado.getEmail());
        ps.setDate(6, Date.valueOf(empleado.getFechaIngreso()));
        ps.setString(7, empleado.getArea());
        ps.setLong(8, empleado.getLegajo().getId()); // FK a Legajo
    }

    @Override
    protected void setParametersUpdate(PreparedStatement ps, Empleado empleado) throws SQLException {
        ps.setString(1, empleado.getNombre());
        ps.setString(2, empleado.getApellido());
        ps.setString(3, empleado.getDni());
        ps.setString(4, empleado.getEmail());
        ps.setDate(5, Date.valueOf(empleado.getFechaIngreso()));
        ps.setString(6, empleado.getArea());
        ps.setLong(7, empleado.getLegajo().getId());
        ps.setLong(8, empleado.getId());
    }

    @Override
    protected Empleado mapearResultSet(ResultSet rs) throws SQLException {
        Empleado empleado = new Empleado();
        empleado.setId(rs.getLong("id"));
        empleado.setEliminado(rs.getBoolean("eliminado"));
        empleado.setNombre(rs.getString("nombre"));
        empleado.setApellido(rs.getString("apellido"));
        empleado.setDni(rs.getString("dni"));
        empleado.setEmail(rs.getString("email"));
        empleado.setFechaIngreso(rs.getDate("fechaIngreso").toLocalDate());
        empleado.setArea(rs.getString("area"));

        // Mapear Legajo anidado si existe
        Long legajoId = rs.getLong("legajo");
        if (rs.wasNull()) {
            empleado.setLegajo(null);
        } else {
            Legajo legajo = new Legajo();
            legajo.setId(legajoId);
            legajo.setNroLegajo(rs.getString("nroLegajo"));
            legajo.setCategoria(rs.getString("categoria"));
            legajo.setEstado(Legajo.Estado.valueOf(rs.getString("estado")));
            legajo.setFechaAlta(rs.getDate("fechaAlta") != null ? rs.getDate("fechaAlta").toLocalDate() : null);
            legajo.setObservaciones(rs.getString("observaciones"));
            empleado.setLegajo(legajo);
        }
        return empleado;
    }

    @Override
    public Long crear(Empleado empleado, Connection connection) throws Exception {
        String sql = getInsertSql();
        try (PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            setParametersInsert(ps, empleado);
            ps.executeUpdate();

            try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    empleado.setId(generatedKeys.getLong(1));
                    return empleado.getId();
                } else {
                    throw new SQLException("No se pudo obtener el ID generado para Empleado.");
                }
            }
        }
    }

    @Override
    public void actualizar(Empleado empleado, Connection connection) throws Exception {
        try (PreparedStatement ps = connection.prepareStatement(getUpdateSql())) {
            setParametersUpdate(ps, empleado);
            int filas = ps.executeUpdate();
            if (filas == 0) {
                throw new SQLException("No se encontró Empleado con ID: " + empleado.getId());
            }
        }
    }

    @Override
    public void eliminar(Long id, Connection connection) throws Exception {
        try (PreparedStatement ps = connection.prepareStatement(getDeleteSql())) {
            ps.setLong(1, id);
            int filas = ps.executeUpdate();
            if (filas == 0) {
                throw new SQLException("No se encontró Empleado con ID: " + id);
            }
        }
    }
    
    // Agrego este metodo para poder eliminar empleados
    
    @Override
    public Optional<Empleado> leer(Long id, Connection connection) throws Exception {
        String sql = getSelectSql() + " WHERE e.id = ? AND e.eliminado = FALSE";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return Optional.of(mapearResultSet(rs));
            }
            return Optional.empty();
        }
    }
}