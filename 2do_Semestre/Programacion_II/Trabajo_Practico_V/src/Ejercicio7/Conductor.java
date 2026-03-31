package Ejercicio7;

public class Conductor {
    private String nombre;
    private String licencia;

    public Conductor(String nombre, String licencia) {
        this.nombre = nombre;
        this.licencia = licencia;
    }

    public String getNombre() { return nombre; }
    public String getLicencia() { return licencia; }
}