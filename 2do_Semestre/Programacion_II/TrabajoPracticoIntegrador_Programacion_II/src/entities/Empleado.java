package entities;

import java.time.LocalDate;

public class Empleado {
    private Long id;
    private Boolean eliminado = false;
    private String nombre;
    private String apellido;
    private String dni;
    private String email;
    private LocalDate fechaIngreso;
    private String area;
    private Legajo legajo; // Relación 1→1 unidireccional

    // Constructores
    public Empleado() {}

    public Empleado(String nombre, String apellido, String dni, String email,
                    LocalDate fechaIngreso, String area, Legajo legajo) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.email = email;
        this.fechaIngreso = fechaIngreso;
        this.area = area;
        this.legajo = legajo;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Boolean getEliminado() { return eliminado; }
    public void setEliminado(Boolean eliminado) { this.eliminado = eliminado; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDate getFechaIngreso() { return fechaIngreso; }
    public void setFechaIngreso(LocalDate fechaIngreso) { this.fechaIngreso = fechaIngreso; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public Legajo getLegajo() { return legajo; }
    public void setLegajo(Legajo legajo) { this.legajo = legajo; }

//    @Override
//    public String toString() {
//        return "Empleado: " + nombre + " " + apellido +
//               " | DNI: " + dni +
//               " | Area: " + area +
//               (legajo != null ? 
//                   " | Legajo: Nro: " + legajo.getNroLegajo() + 
//                    ", Estado: " + legajo.getEstado() + 
//                    ", Categoría: " + legajo.getCategoria() : 
//                   " | Legajo: No asignado");
//    }
    
    @Override
    public String toString() {
        return String.format("Empleado[id=%d, nombre=%s %s, dni=%s, area=%s]", 
                id, nombre, apellido, dni, area);
    }
}