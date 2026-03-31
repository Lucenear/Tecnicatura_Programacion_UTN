package service;

import dao.LegajoDao;
import entities.Legajo;
import java.time.LocalDate;
import java.util.List;
import config.DatabaseConnection;

public class LegajoService extends GenericService<Legajo> {

    public LegajoService(LegajoDao dao, DatabaseConnection dbConnection) {
        super(dao, dbConnection);
    }
    
    @Override
    public Legajo insert(Legajo legajo) {
        validarLegajo(legajo);
        return super.insert(legajo);
    }

    @Override
    public Legajo update(Legajo legajo) {
        if (legajo.getId() == null) {
            throw new IllegalArgumentException("El ID del legajo no puede ser nulo");
        }
        validarLegajo(legajo);
        return super.update(legajo);
    }

    public List<Legajo> mostrarActivos() {
        return getAll();
    }
    
    public Legajo obtenerPorId(Long id) {
        return getById(id);
    }

    private void validarLegajo(Legajo legajo) {
        if (legajo.getNroLegajo() == null || legajo.getNroLegajo().trim().isEmpty()) {
            throw new IllegalArgumentException("El numero de legajo es obligatorio");
        }
        if (legajo.getCategoria() == null || !legajo.getCategoria().matches("[A-F]")) {
            throw new IllegalArgumentException("La categoría debe ser A, B, C, D, E o F");
        }
        if (legajo.getEstado() == null) {
            throw new IllegalArgumentException("El estado es obligatorio");
        }
        if (legajo.getFechaAlta() == null) {
            legajo.setFechaAlta(LocalDate.now());
        }
    }
    
    public void eliminarLogico(Long id) {
        withTransaction(() -> {
            Legajo legajo = getById(id);
            if (legajo == null) {
                throw new IllegalArgumentException("Legajo con ID " + id + " no encontrado.");
            }
            if (legajo.getEliminado()) {
                throw new IllegalArgumentException("Legajo con ID " + id + " ya está eliminado.");
            }
            dao.eliminar(id, dbConnection.getConnection());
            return null;
        });
    }
}