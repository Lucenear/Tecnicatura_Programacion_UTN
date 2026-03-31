package Ejercicio9;

public class Paciente {
    private String nombre;
    private String obraSocial;

    public Paciente(String nombre, String obraSocial) {
        this.nombre = nombre;
        this.obraSocial = obraSocial;
    }

    public String getNombre() { return nombre; }
    public String getObraSocial() { return obraSocial; }
}