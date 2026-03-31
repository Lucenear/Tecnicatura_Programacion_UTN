package service;

import dao.EmpleadoDao;
import entities.Empleado;
import entities.Legajo;
import java.util.List;
import java.util.stream.Collectors;
import config.DatabaseConnection;


public class EmpleadoService extends GenericService<Empleado> {

    private final LegajoService legajoService;
    
    public EmpleadoService(EmpleadoDao dao, LegajoService legajoService, DatabaseConnection dbConnection) {
        super(dao, dbConnection);
        this.legajoService = legajoService;
    }
    
    @Override
    public Empleado insert(Empleado empleado) {
        validarEmpleado(empleado);
        return super.insert(empleado);
    }
    
    @Override
    public Empleado update(Empleado empleado) {
        if (empleado.getId() == null) {
            throw new IllegalArgumentException("El ID del empleado no puede ser nulo");
        }
        validarEmpleado(empleado);
        return super.update(empleado);
    }

    public Empleado buscarPorDni(String dni) {
        List<Empleado> todos = getAll();
        return todos.stream()
                .filter(e -> !e.getEliminado() && dni.equals(e.getDni()))
                .findFirst()
                .orElse(null);
    }

    public List<Empleado> mostrarActivos() {
        return getAll().stream()
                .filter(e -> !e.getEliminado())
                .collect(Collectors.toList());
    }
  
    public void eliminarLogico(Long id) {
        withTransaction(() -> {
            Empleado emp = getById(id);
            if (emp == null || emp.getEliminado()) {
                throw new IllegalArgumentException("No se encuentra el empleado o ya esta eliminado");
            }
            dao.eliminar(id, dbConnection.getConnection());
            return null;
        });
    }

    public Empleado obtenerPorId(Long id) {
        return getById(id);
    }

    private void validarEmpleado(Empleado empleado) {
        if (empleado.getNombre() == null || empleado.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (empleado.getApellido() == null || empleado.getApellido().trim().isEmpty()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }
        if (empleado.getDni() == null || !empleado.getDni().matches("\\d{8,15}")) {
            throw new IllegalArgumentException("El DNI debe tener entre 8 y 15 digitos");
        }
        if (empleado.getLegajo() == null) {
            throw new IllegalArgumentException("Un empleado debe tener un legajo asignado");
        }

        // Validar que el legajo exista
        Legajo legajo = legajoService.obtenerPorId(empleado.getLegajo().getId());
        if (legajo == null) {
            throw new IllegalArgumentException("El legajo asignado no existe");
        }

        // Regla 1-1
        List<Empleado> activos = mostrarActivos();
        for (Empleado e : activos) {
            if (!e.getId().equals(empleado.getId()) &&
                e.getLegajo() != null &&
                e.getLegajo().getId().equals(empleado.getLegajo().getId())) {
                throw new IllegalArgumentException("El legajo ya esta asignado a otro empleado activo");
            }
        }
    }
    
    public Empleado obtenerPorLegajo(Legajo legajo) {
        if (legajo == null || legajo.getId() == null) {
            throw new IllegalArgumentException("El legajo no puede ser nulo");
        }

        List<Empleado> empleados = getAll();

        return empleados.stream()
                .filter(e -> !e.getEliminado()
                        && e.getLegajo() != null
                        && legajo.getId().equals(e.getLegajo().getId()))
                .findFirst()
                .orElse(null);
    }
}