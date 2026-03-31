package entities;

import java.time.LocalDate;
import java.util.Objects;

public class Legajo {
    private Long id;
    private Boolean eliminado = false;
    private String nroLegajo;
    private String categoria;
    private Estado estado; // Enum: ACTIVO, INACTIVO
    private LocalDate fechaAlta;
    private String observaciones;

    public enum Estado {
        ACTIVO, INACTIVO
    }

    // Constructores
    public Legajo() {}

    public Legajo(String nroLegajo, String categoria, Estado estado, LocalDate fechaAlta, String observaciones) {
        this.nroLegajo = nroLegajo;
        this.categoria = categoria;
        this.estado = estado;
        this.fechaAlta = fechaAlta;
        this.observaciones = observaciones;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Boolean getEliminado() { return eliminado; }
    public void setEliminado(Boolean eliminado) { this.eliminado = eliminado; }

    public String getNroLegajo() { return nroLegajo; }
    public void setNroLegajo(String nroLegajo) { this.nroLegajo = nroLegajo; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public Estado getEstado() { return estado; }
    public void setEstado(Estado estado) { this.estado = estado; }

    public LocalDate getFechaAlta() { return fechaAlta; }
    public void setFechaAlta(LocalDate fechaAlta) { this.fechaAlta = fechaAlta; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

     @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Legajo legajo = (Legajo) o;
        return Objects.equals(id, legajo.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
     @Override
    public String toString() {
        return "Legajo Nro: " + nroLegajo +
               " | Estado: " + estado +
               " | Fecha Alta: " + (fechaAlta != null ? fechaAlta.toString() : "N/A") +
               (categoria != null ? " | Categoría: " + categoria : "") +
               (observaciones != null && !observaciones.isBlank() ? " | Obs: " + observaciones : "");
    }
}